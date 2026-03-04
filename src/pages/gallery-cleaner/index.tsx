import { selectionModeAtom } from '@/components/gallery/atom';
import { ThumbnailOverlayComponent } from '@/components/gallery/thumbnail-overlay';
import { colors } from '@/config/theme';
import * as Sharing from 'expo-sharing';
import { useModals } from '@/hooks/use-modals';
import { usePermissions } from '@/hooks/use-permissions';
import { useSelectedAssets } from '@/hooks/use-selected-assets';
import { CameraRoll } from '@/modules/cleaner-gallery';
import CropIcon from '@/svg/crop.svg';
import PlanetIcon from '@/svg/planet.svg';
import WallpaperIcon from '@/svg/wallpaper.svg';
import { BottomFloat } from '@/ui/bottom-float';
import { FadeGradient } from '@/ui/fade-gradient';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { isNotNullOrUndefined } from '@/utils/array';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { openSettings } from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ExpoSimpleGalleryView,
  type ExpoSimpleGalleryMethods,
} from 'expo-simple-gallery';
import { useSetAtom } from 'jotai';
import { useEffect, useRef, useState, type FC } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import type { SvgProps } from 'react-native-svg';
import {
  invalidateCleanerAlbums,
  useCleanerAlbum,
} from './hooks/use-cleaner-album';
import { AlbumName, isNestedArray, type GalleryCleanerAlbum } from './types';
import { PageHeader } from '@/components/page-header';
import { Container } from '@/components/container';
import { PageBackground } from '@/components/page-background';
import { Page } from '@/components/page';
import byteHandler from '../smart-cleaner/helpers/byte-handler';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import * as MediaLibrary from 'expo-media-library';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { useTranslation } from 'react-i18next';
import { usePaywall } from '../paywall/hooks/use-paywall';
import { usePurchases } from '@kirz/expo-toolkit';

export type GalleryCleanerProps = {
  album?: GalleryCleanerAlbum;
  buttonPressAction?: 'back' | 'clean';
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function GalleryCleaner({
  album = 'similarPhotos',
  buttonPressAction = 'clean',
}: GalleryCleanerProps) {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');

  const { assets } = useCleanerAlbum(album);

  const { setSelectedByUri, selectAll, deselectAll, selectedWithinSubset } =
    useSelectedAssets(assets?.flat() ?? []);

  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  const setSelectionMode = useSetAtom(selectionModeAtom);

  useEffect(() => {
    setSelectionMode(true);
    return () => {
      setSelectionMode(false);
    };
  }, [setSelectionMode]);

  const uris =
    (isNestedArray(assets)
      ? assets?.map((group) =>
          group.map(({ uri }) => uri).filter(isNotNullOrUndefined)
        )
      : assets?.map(({ uri }) => uri).filter(isNotNullOrUndefined)) ?? [];

  const { openModal, closeModal, closeAllModals } = useModals();

  const deleteByUri = async (uri: string) => {
    openModal('LoaderModal');

    const item = assets?.flat().find((item) => item.uri === uri);
    const { order, integers, hundredths } = byteHandler(item?.size || 0);
    const sizeString = integers + ',' + hundredths + ' ' + order;

    if (!item?.id) {
      closeModal('LoaderModal');
      return;
    }
    const { success } = await CameraRoll.deleteAssets([item.id]);
    if (success) {
      deselectAll();
      await invalidateCleanerAlbums([album]);
      closeAllModals(() => {
        openModal('SuccessModal', {
          filesQuantity: 1,
          freedSpace: sizeString,
        });
      });
    } else {
      closeModal('LoaderModal');
    }
  };

  const handleClean = async () => {
    if (!hasPremium) {
      showPaywall();
      return;
    }

    openModal('LoaderModal');

    const quantity = selectedWithinSubset.length;
    const size = selectedWithinSubset.reduce(
      (acc, item) => acc + (item.size || 0),
      0
    );
    const { order, integers, hundredths } = byteHandler(size);
    const sizeString = integers + ',' + hundredths + ' ' + order;

    const ids = selectedWithinSubset.map((item) => item.id);
    if (!ids.length) {
      closeModal('LoaderModal');
      return;
    }
    const { success } = await CameraRoll.deleteAssets(ids);
    if (success) {
      deselectAll();
      await invalidateCleanerAlbums([album]);
      closeAllModals(() => {
        openModal('SuccessModal', {
          filesQuantity: quantity,
          freedSpace: sizeString,
        });
      });
    } else {
      closeModal('LoaderModal');
    }
  };

  useEffect(() => {
    return () => {
      if (buttonPressAction === 'clean') {
        deselectAll();
      }
    };
  }, [buttonPressAction]);

  const [initialSelectedUris] = useState<string[]>(
    selectedWithinSubset.map((item) => item.uri).filter(isNotNullOrUndefined)
  );

  const { checkPermissionStatus } = usePermissions();
  useEffect(() => {
    (async () => {
      const { status } = await checkPermissionStatus(
        'ios.permission.PHOTO_LIBRARY'
      );

      if (status === 'blocked') {
        Alert.alert(
          langs[selectedLang].alerts.access_denied,
          langs[selectedLang].alerts.access_to_photos,
          [
            {
              text: langs[selectedLang].alerts.open_settings,
              onPress: openSettings,
            },
            {
              text: langs[selectedLang].alerts.cancel,
              style: 'cancel',
            },
          ]
        );
        return [];
      }
    })();
  }, [checkPermissionStatus]);

  return (
    <>
      <Page>
        <PageBackground />
        <Container>
          <PageHeader
            pageName={AlbumName[album]}
            rightButtonLabel={
              selectedWithinSubset.length
                ? langs[selectedLang].page_names.cancel
                : langs[selectedLang].page_names.select_all
            }
            rightButtonHandler={
              selectedWithinSubset.length
                ? () => {
                    deselectAll();
                    galleryRef.current?.setSelected([]);
                  }
                : () => {
                    selectAll();
                    galleryRef.current?.setSelected(uris.flat());
                  }
            }
          />
          <View
            className="absolute z-20 gap-5"
            style={{
              top: scaleY(110),
              left: scaleX(20),
            }}
          >
            <Animated.View
              className="absolute overflow-hidden rounded-full bg-white/15 -inset-1"
              entering={ZoomIn.duration(200)}
              layout={LinearTransition}
            >
              <AnimatedBlurView
                tint="light"
                className="absolute inset-0"
                intensity={25}
                layout={LinearTransition}
              />
            </Animated.View>
            <Dropdown />
          </View>
          {!assets?.length ? (
            <UiText className="text-center text-lg font-bold mt-6">
              {langs[selectedLang].no} {AlbumName[album]}
            </UiText>
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
                initiallySelected={initialSelectedUris}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 0,
                  paddingTop: 0,
                  paddingBottom: scaleY(40),
                  gap: 7,
                }}
                thumbnailStyle={{ borderRadius: 12 }}
                thumbnailOverlayComponent={ThumbnailOverlayComponent}
                thumbnailLongPressAction="preview"
                thumbnailPressAction="select"
                thumbnailPanAction="select"
                fullscreenViewOverlayStyle={{
                  backgroundColor: colors.black.toString(),
                  paddingBottom: scaleY(40),
                }}
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
                      hasDeveloperPremium ? deleteByUri(uri) : showPaywall();
                    },
                  },
                ]}
                fullscreenViewOverlayComponent={(props) => (
                  <FullscreenViewOverlayComponent
                    {...props}
                    closeViewer={galleryRef.current?.closeImageViewer}
                    deleteByUri={
                      hasDeveloperPremium ? deleteByUri : () => showPaywall()
                    }
                  />
                )}
                onSelectionChange={(event) => {
                  setSelectedByUri(event.nativeEvent.selected);
                }}
                sectionHeaderStyle={{ height: scaleY(16) }}
              />
            </Animated.View>
          )}
          {selectedWithinSubset.length !== 0 && (
            <>
              <FadeGradient />
              <BottomFloat
                title={langs[selectedLang].buttons.remove_photos}
                subtitle={t('quantity', {
                  selectedQuantity: selectedWithinSubset.length,
                  totalQuantity: uris.flat().length,
                })}
                handler={handleClean}
              />
            </>
          )}
        </Container>
      </Page>
    </>
  );
}

function Dropdown() {
  const [expanded, setExpanded] = useState(false);
  const params = useLocalSearchParams() as { album?: GalleryCleanerAlbum };

  const list: [GalleryCleanerAlbum, FC<SvgProps>][] = [
    ['similarPhotos', WallpaperIcon],
    ['screenshots', CropIcon],
    ['blurryPhotos', PlanetIcon],
  ];

  return (
    <Animated.View className="gap-1" layout={LinearTransition}>
      {expanded &&
        list.map(([album, Icon], i) => (
          <DropdownItem
            key={album}
            active={album === params.album}
            album={album}
            Icon={Icon}
            onPress={() => {
              router.setParams({ album });
              setExpanded(false);
            }}
            index={i}
          />
        ))}

      <AnimatedTouchableOpacity
        className="items-center justify-center size-8"
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Medium);
          setExpanded(!expanded);
        }}
        key={`expanded=${expanded}`}
        entering={ZoomIn}
        exiting={ZoomOut}
      >
        <SfSymbol
          name={expanded ? 'chevron.up' : 'chevron.down'}
          tintColor={colors.text.toString()}
          size={scaleX(16)}
          weight="semibold"
        />
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
}

type DropdownItemProps = {
  active: boolean;
  album: GalleryCleanerAlbum;
  Icon: FC<SvgProps>;
  onPress: () => void;
  index: number;
};

function DropdownItem({
  active,
  album,
  Icon,
  onPress,
  index,
}: DropdownItemProps) {
  const [isTouched, setIsTouched] = useState(false);
  return (
    <AnimatedTouchableOpacity
      className="items-center justify-center size-8"
      entering={ZoomIn.duration(100).delay(index * 50)}
      exiting={ZoomOut}
      layout={LinearTransition}
      disabled={active}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Medium);
        onPress();
      }}
      onPressIn={() => {
        impactAsync(ImpactFeedbackStyle.Light);

        setIsTouched(true);
      }}
      onPressOut={() => setIsTouched(false)}
      activeOpacity={0.8}
    >
      {(active || isTouched) && (
        <>
          <View className="absolute overflow-hidden rounded-full bg-white/30 left-0 top-0 size-8">
            <BlurView
              className="absolute inset-0"
              tint="light"
              intensity={10}
            />
          </View>
          <View className="pointer-events-none absolute justify-center left-10 bottom-0 top-0 w-64">
            <View className="self-start overflow-hidden rounded-full bg-white/50 px-2 py-1">
              <BlurView
                className="absolute inset-0"
                tint="light"
                intensity={20}
              />
              <UiText className="text-sm text-[#262626]">
                {AlbumName[album]}
              </UiText>
            </View>
          </View>
        </>
      )}
      <Icon className="color-white size-6" />
    </AnimatedTouchableOpacity>
  );
}
