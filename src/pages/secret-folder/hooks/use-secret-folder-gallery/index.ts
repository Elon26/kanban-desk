import { useAnalytics, usePurchases } from '@kirz/expo-toolkit';
import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';
import { ActionSheetIOS } from 'react-native';
import { useModal } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { CameraRoll, type GalleryAsset } from '@/modules/cleaner-gallery';

import { useGalleryPicker } from '../use-gallery-picker';
import { type SecretFolderAsset } from './atom';

export function useSecretFolderGallery() {
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const selectedLang = useStorageValue('selectedLang');
  const { openGalleryPicker, openCameraPicker } = useGalleryPicker();
  const { logEvent } = useAnalytics();
  const { openModal, closeModal } = useModal<ModalStackParams>();
  const [assets, setAssets] = useStorage('secretGalleryStorage');

  const showActionSheet = useCallback(async () => {
    const promise = await new Promise((res) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            langs[selectedLang].alerts.cancel,
            langs[selectedLang].alerts.take_photo,
            langs[selectedLang].alerts.import_photos_or_videos,
          ],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            res('cancel');
          } else if (buttonIndex === 2) {
            res('gallery');
          } else if (buttonIndex === 1) {
            res('camera');
          }
        }
      );
    });
    return promise;
  }, []);

  const [lastSecureAction, setLastSecureAction] =
    useStorage('lastSecureAction');
  const [securedDataPercent, setSecuredDataPercent] =
    useStorage('securedDataPercent');
  let updatedSecuredDataPercent = securedDataPercent;

  const addAssets = useCallback(async () => {
    const selectedOption = await showActionSheet();

    if (selectedOption === 'cancel') {
      return;
    }

    const pickedAssets = await (
      selectedOption === 'camera' ? openCameraPicker : openGalleryPicker
    )();

    if (!pickedAssets.length) {
      return;
    }

    let confirm: (value: unknown) => void = () => {};
    const confirmationPromise = new Promise<unknown>((resolve) => {
      confirm = resolve;
    });

    if (selectedOption !== 'camera') {
      setTimeout(() => {
        openModal('RemoveAfterImportModal', {
          description:
            langs[selectedLang].modals.remove_after_import_modal.description,
          resolve: confirm,
        });
      }, 500);
    }

    if (selectedOption === 'camera') {
      confirm('');
    }

    const action = await confirmationPromise;

    if (updatedSecuredDataPercent < 100) {
      updatedSecuredDataPercent += 10;
      setSecuredDataPercent(updatedSecuredDataPercent);
      setLastSecureAction(Date.now());
    }

    closeModal('RemoveAfterImportModal');

    const pickedAssetsToUse = hasPremium ? pickedAssets : [pickedAssets[0]];

    const allowedPhotos: (GalleryAsset & { tempUri: string })[] =
      await Promise.all(pickedAssetsToUse.filter((x) => x.id));

    const storedAssets = await Promise.all(
      allowedPhotos.map(async ({ tempUri, ...item }) => {
        const filename = `${item.id.replace(/\//g, '-')}-${new Date().valueOf()}`;

        const newImagePath = `${FileSystem.documentDirectory}/${filename}_${tempUri
          .slice(-5)
          .replace(/:/g, '-')}`;

        const newImageThumbnailPath =
          selectedOption === 'gallery'
            ? `${FileSystem.documentDirectory}${filename}_thumbnail.jpg`
            : undefined;

        try {
          await Promise.all([
            FileSystem.copyAsync({
              from: tempUri,
              to: newImagePath,
            }),
          ]);
          newImageThumbnailPath &&
            (await CameraRoll.extractThumbnail(
              item.id,
              newImageThumbnailPath,
              200,
              200
            ));
        } catch (error) {
          console.error(error);
        }

        const originalUri = newImagePath.replace(
          FileSystem.documentDirectory ?? '',
          ''
        );

        return {
          ...item,
          id: `${item.id}_${new Date().valueOf()}`,
          uri: (item.mediaType === 'video'
            ? await (async () => {
                const videoPreviewPath = `${FileSystem.documentDirectory}${filename}_preview.jpg`;

                await CameraRoll.extractThumbnail(
                  item.id,
                  videoPreviewPath,
                  -1,
                  -1
                );

                return videoPreviewPath;
              })()
            : originalUri
          ).replace(FileSystem.documentDirectory ?? '', ''),
          thumbnailUri: (newImageThumbnailPath ?? originalUri).replace(
            FileSystem.documentDirectory ?? '',
            ''
          ),
          originalUri,
        };
      })
    );

    setAssets((prev) => {
      const p = prev;
      return [...p, ...storedAssets];
    });

    if (action === 'later') {
      return;
    }
    logEvent('secret_gallery_added');
    await CameraRoll.deleteAssets(allowedPhotos.map((x) => x.id));
  }, [
    setAssets,
    closeModal,
    openGalleryPicker,
    openModal,
    openCameraPicker,
    showActionSheet,
    logEvent,
  ]);

  const deleteAssets = useCallback(
    async (ids: string[]) => {
      const assetsToDelete = assets.filter((x) => ids.includes(x.id));

      let confirm: (value: unknown) => void = () => {};
      const confirmationPromise = new Promise<unknown>((resolve) => {
        confirm = resolve;
      });

      openModal('ConfirmationOfDeletionModal', {
        description:
          langs[selectedLang].modals.confirmation_of_deletion_modal
            .deleted_files,
        resolve: confirm,
      });

      const action = await confirmationPromise;

      closeModal('ConfirmationOfDeletionModal');

      if (action === 'later') {
        return;
      }

      // remove files
      await Promise.all([
        ...assetsToDelete.map((x) =>
          FileSystem.deleteAsync(`${FileSystem.documentDirectory}${x.uri}`)
        ),
        ...assetsToDelete
          .filter(
            (x: SecretFolderAsset) => x.thumbnailUri && x.thumbnailUri !== x.uri
          )
          .map((x: SecretFolderAsset) =>
            FileSystem.deleteAsync(
              `${FileSystem.documentDirectory}${x.thumbnailUri}`
            )
          ),
      ]).catch((err) => {
        console.error(err);
      });
      logEvent('secret_gallery_deleted');
      // remove from async storage
      setAssets(assets.filter((x) => !ids.includes(x.id)));
    },
    [setAssets, assets, logEvent]
  );

  return {
    assets,
    addAssets,
    deleteAssets,
  };
}
