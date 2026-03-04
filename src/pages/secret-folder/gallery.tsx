import { useAnalytics, usePurchases } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import {
  type ExpoSimpleGalleryMethods,
  ExpoSimpleGalleryView,
} from 'expo-simple-gallery';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import { ThumbnailOverlayComponent } from '@/components/gallery/thumbnail-overlay-alt';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { colors } from '@/config/theme';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiButton } from '@/ui/ui-button';
import { isNotNullOrUndefined } from '@/utils/array';

import { manageSelectedAssets } from '../../hooks/use-selected-assets';
import { usePaywall } from '../paywall/hooks/use-paywall';
import { EmptyComponent } from './components/empty';
import { useSecretFolderGallery } from './hooks/use-secret-folder-gallery';
import type { SecretFolderAsset } from './hooks/use-secret-folder-gallery/atom';

export function SecretGallery() {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const selectedLang = useStorageValue('selectedLang');
  const insets = useSafeAreaInsets();

  const { assets, addAssets, deleteAssets } = useSecretFolderGallery();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAssets, setSelected] = useState<SecretFolderAsset[]>([]);

  const [adding, setAdding] = useState(false);

  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('secret_gallery_screen');
  }, [logEvent]);

  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  const uris =
    assets
      ?.map(
        ({ uri, originalUri }: SecretFolderAsset) =>
          `${FileSystem.documentDirectory}${originalUri ?? uri}`
      )
      .filter((uri): uri is string => uri !== undefined) ?? [];

  useEffect(() => {
    if (selectionMode) {
      galleryRef.current?.setThumbnailPressAction('select');
      galleryRef.current?.setThumbnailPanAction('select');
    } else {
      setSelected([]);
      galleryRef.current?.setSelected([]);
      galleryRef.current?.setThumbnailPressAction('open');
      galleryRef.current?.setThumbnailPanAction('none');
    }
  }, [selectionMode]);

  const getAssetByUri = (uri: string) => {
    const relativeUri = uri.split('/').pop();
    return assets.find((a) => a.originalUri?.endsWith(relativeUri ?? ''));
  };

  const deleteByUri = (uri: string) => {
    const foundAsset = getAssetByUri(uri);
    foundAsset && deleteAssets([foundAsset.id]);
  };

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.secret_gallery}
          rightButtonLabel={
            selectionMode
              ? langs[selectedLang].page_names.cancel
              : langs[selectedLang].page_names.select
          }
          rightButtonHandler={
            selectionMode
              ? () => {
                  manageSelectedAssets.clear();
                  setSelectionMode(false);
                  galleryRef.current?.setSelected([]);
                }
              : () => {
                  setSelectionMode(true);
                }
          }
        />
        {!assets?.length ? (
          <EmptyComponent />
        ) : (
          <Animated.View
            className="absolute left-4 right-0 bottom-0 mt-2 top-0 pt-24 w-full"
            entering={ZoomIn.withInitialValues({
              transform: [{ scale: 0.8 }],
              transformOrigin: 'top center',
            }).delay(500)}
          >
            <ExpoSimpleGalleryView
              ref={galleryRef}
              assets={uris}
              columnsCount={3}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: scaleY(10),
                paddingBottom:
                  scaleY(48 + 16) + (insets.bottom === 0 ? scaleY(16) : 0),
                gap: scaleX(5),
              }}
              thumbnailStyle={{ borderRadius: scaleX(12) }}
              thumbnailOverlayComponent={
                selectionMode ? ThumbnailOverlayComponent : undefined
              }
              thumbnailPressAction="open"
              thumbnailLongPressAction="preview"
              thumbnailPanAction="none"
              contextMenuOptions={[
                {
                  title: langs[selectedLang].alerts.open,
                  sfSymbol: 'arrowshape.turn.up.right',
                  action: ({ index }) =>
                    galleryRef.current?.openImageViewer(index),
                },
                {
                  title: langs[selectedLang].alerts.share,
                  sfSymbol: 'square.and.arrow.up',
                  action: async ({ uri }) => {
                    if (uri.startsWith('file://')) {
                      Sharing.shareAsync(uri);
                      return;
                    }
                    if (uri.startsWith('ph://')) {
                      const asset = await MediaLibrary.getAssetInfoAsync(
                        uri.replace('ph://', '')
                      );
                      asset.localUri && Sharing.shareAsync(asset.localUri);
                    }
                  },
                },
                {
                  title: langs[selectedLang].alerts.delete,
                  attributes: ['destructive'],
                  sfSymbol: 'trash',
                  action: async ({ uri }) => {
                    deleteByUri?.(uri);
                  },
                },
              ]}
              fullscreenViewOverlayStyle={{
                backgroundColor: colors.background.toString(),
              }}
              fullscreenViewOverlayComponent={(props) => (
                <FullscreenViewOverlayComponent
                  {...props}
                  closeViewer={galleryRef.current?.closeImageViewer}
                  setSelectionMode={setSelectionMode}
                  deleteByUri={deleteByUri}
                />
              )}
              onSelectionChange={({ nativeEvent }) => {
                const foundAssets = nativeEvent.selected
                  .map((uri) => {
                    const relativeUri = uri.split('/').pop();
                    return assets.find((a) =>
                      a.originalUri?.endsWith(relativeUri ?? '')
                    );
                  })
                  .filter(isNotNullOrUndefined);
                setSelected(foundAssets);
              }}
            />
          </Animated.View>
        )}
        <View
          className="absolute flex-row items-stretch gap-2.5 left-edge right-edge px-edge"
          style={{ bottom: insets.bottom + scaleY(12) || scaleY(52) }}
        >
          {selectedAssets.length ? (
            <UiButton
              className="flex-1 bg-blue"
              onPress={() => {
                deleteAssets(selectedAssets.map((x) => x.id));
                galleryRef.current?.setSelected([]);
              }}
              loading={adding}
            >
              {langs[selectedLang].buttons.delete}
            </UiButton>
          ) : (
            <UiButton
              className="flex-1 bg-blue"
              onPress={
                !hasPremium && uris.length
                  ? () => showPaywall()
                  : () => {
                      setAdding(true);
                      addAssets().finally(() => setAdding(false));
                    }
              }
            >
              {langs[selectedLang].buttons.add_new}
            </UiButton>
          )}
        </View>
      </Container>
    </Page>
  );
}
