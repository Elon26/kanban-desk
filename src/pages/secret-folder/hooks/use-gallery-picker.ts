import * as ImagePicker from 'expo-image-picker';
import { openSettings } from 'expo-linking';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { usePermissions } from '@/hooks/use-permissions';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import type { GalleryAsset } from '@/modules/cleaner-gallery';
import { uuid } from '@/utils/uuid';

export function useGalleryPicker() {
  const selectedLang = useStorageValue('selectedLang');
  const { checkPermissionStatus } = usePermissions();

  const openPicker = useCallback(
    async (
      type: 'camera' | 'library',
      options?: ImagePicker.ImagePickerOptions
    ) => {
      if (type === 'library') {
        const { status } = await checkPermissionStatus(
          'ios.permission.PHOTO_LIBRARY'
        );

        if (status === 'blocked') {
          Alert.alert(
            langs[selectedLang].alerts.permission_required,
            langs[selectedLang].alerts.enable_photo,
            [
              {
                text: langs[selectedLang].alerts.cancel,
                style: 'cancel',
              },
              {
                text: langs[selectedLang].alerts.settings,
                onPress: openSettings,
              },
            ]
          );
          return [];
        }
      }
      if (type === 'camera') {
        const { status } = await checkPermissionStatus('ios.permission.CAMERA');
        if (status === 'blocked') {
          Alert.alert(
            langs[selectedLang].alerts.camera_denied,
            langs[selectedLang].alerts.enable_camera,
            [
              {
                text: langs[selectedLang].alerts.cancel,
                style: 'cancel',
              },
              {
                text: langs[selectedLang].alerts.settings,
                onPress: openSettings,
              },
            ]
          );
          return [];
        }
      }

      const { assets } = await (
        type === 'camera'
          ? ImagePicker.launchCameraAsync
          : ImagePicker.launchImageLibraryAsync
      )({
        ...options,
        selectionLimit: 0,
        mediaTypes: options?.mediaTypes ?? ['videos', 'images', 'livePhotos'],
        allowsMultipleSelection: true,
      });

      if (!assets?.length) {
        return [];
      }

      const galleryAssets: (GalleryAsset & { tempUri: string })[] = [];

      for (const asset of assets) {
        const assetId = asset.assetId ?? uuid();
        const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? uuid();

        if (!asset.fileSize || !asset.uri) {
          continue;
        }
        const galleryAsset: GalleryAsset & { tempUri: string } = {
          id:
            type === 'library'
              ? assetId
              : `${new Date().valueOf()}_${Math.floor(Math.random() * 100000)}`,
          mediaType: asset.type?.includes('video')
            ? ('video' as const)
            : ('image' as const),
          size: asset.fileSize,
          name: fileName,
          uri: type === 'library' ? `ph://${asset.assetId}` : asset.uri,
          tempUri: asset.uri,
          duration: asset.duration ?? 0,
        };
        galleryAssets.push(galleryAsset);
      }

      return galleryAssets;
    },
    [checkPermissionStatus]
  );

  const openGalleryPicker = useCallback(
    async (options?: ImagePicker.ImagePickerOptions) => {
      return await openPicker('library', options);
    },
    [openPicker]
  );

  const openCameraPicker = useCallback(
    async (options?: ImagePicker.ImagePickerOptions) => {
      return await openPicker('camera', {
        mediaTypes: 'images',
        ...(options ?? {}),
      });
    },
    [openPicker]
  );

  return { openCameraPicker, openGalleryPicker };
}
