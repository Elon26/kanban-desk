import { usePurchases } from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useModals } from '@/hooks/use-modals';
import {
  manageSelectedAssets,
  useSelectedAssets,
} from '@/hooks/use-selected-assets';
import { useSetStorage } from '@/hooks/use-storage';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { CameraRoll } from '@/modules/cleaner-gallery';
import { useContactsCleaner } from '@/pages/contacts-cleaner/hooks/use-contacts-cleaner';
import { useContactsSelector } from '@/pages/contacts-cleaner/hooks/use-contacts-selector';
import {
  invalidateCleanerAlbums,
  useCleanerAlbum,
} from '@/pages/gallery-cleaner/hooks/use-cleaner-album';
import { Btn } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { ChevronRight } from '@/ui/chevron';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { usePaywall } from '../paywall/hooks/use-paywall';
import RoundedArcChart from './components/diagram';
import { UsedSizeArea } from './components/used-size-area';
import byteHandler from './helpers/byte-handler';

const FAKE_DELAY = 3000;

const SCREENSHOTS_COLOR = '#FDD9A0';
const DUPL_CONTACTS_COLOR = '#C7F0D8';
const DUPL_PHOTOS_COLOR = '#C4BFFB';
const BLURRY_COLOR = '#F7CCE9';

export function SmartCleaner() {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');

  const similarPhotos = useCleanerAlbum('similarPhotos');
  const screenshots = useCleanerAlbum('screenshots');
  const blurryPhotos = useCleanerAlbum('blurryPhotos');
  const {
    groupsSimilarBy,
    mergeAndDeleteSimilarContacts,
    isScanningForSimilarContacts,
  } = useContactsCleaner();
  const similarGroups = groupsSimilarBy.any;

  const {
    assetsSize: allSimilarPhotosSize,
    isAllSelected: isAllSimilarPhotosSelected,
    isPartialSelected: isSimilarPhotosPartiallySelected,
    selectAll: selectAllSimilarPhotos,
    deselectAll: deselectAllSimilarPhotos,
    selectedAssets,
  } = useSelectedAssets(similarPhotos.assets?.flat() ?? []);

  const {
    assetsSize: allScreenshotsSize,
    isAllSelected: isAllScreenshotsSelected,
    isPartialSelected: isScreenshotsPartiallySelected,
    selectAll: selectAllScreenshots,
    deselectAll: deselectAllScreenshots,
  } = useSelectedAssets(screenshots.assets?.flat() ?? []);

  const {
    assetsSize: allBlurryPhotosSize,
    isAllSelected: isAllBlurryPhotosSelected,
    isPartialSelected: isBlurryPhotosPartiallySelected,
    selectAll: selectAllBlurryPhotos,
    deselectAll: deselectAllBlurryPhotos,
  } = useSelectedAssets(blurryPhotos.assets?.flat() ?? []);

  const [blurryPhotosPercent, setBlurryPhotosPercent] = useState(0);
  const [screenshotsPercent, setScreenshotsPercent] = useState(0);
  const [similarPhotosPercent, setSimilarPhotosPercent] = useState(0);

  useEffect(() => {
    const totalSize =
      allBlurryPhotosSize + allScreenshotsSize + allSimilarPhotosSize;
    const currentBlurryPhotosPercent = (allBlurryPhotosSize / totalSize) * 90;
    const currentScreenshotsPercent = (allScreenshotsSize / totalSize) * 90;
    const currentSimilarPhotosPercent = (allSimilarPhotosSize / totalSize) * 90;

    setBlurryPhotosPercent(currentBlurryPhotosPercent);
    setScreenshotsPercent(currentScreenshotsPercent);
    setSimilarPhotosPercent(currentSimilarPhotosPercent);
  }, [allBlurryPhotosSize, allScreenshotsSize, allSimilarPhotosSize]);

  const { selectedContacts, setSelectedContacts } = useContactsSelector();
  const isAllContactsSelected =
    selectedContacts.length === similarGroups.flat().length &&
    similarGroups.length > 0;
  const isContactsPartiallySelected =
    selectedContacts.length > 0 && !isAllContactsSelected;
  const selectAllContacts = () => setSelectedContacts(similarGroups.flat());
  const deselectAllContacts = () => setSelectedContacts([]);

  const countFormatted = (assets: unknown[] | unknown[][] | undefined) => {
    const count = assets?.flat().length ?? 0;

    if (count === undefined) return '...';
    if (count === 0) return langs[selectedLang].pages.smart_cleaner.zero_files;
    return t(count === 1 ? 'viewAll_one' : 'viewAll_plural', { count: count });
  };

  useEffect(() => {
    return () => {
      manageSelectedAssets.clear();
      setSelectedContacts([]);
    };
  }, [setSelectedContacts]);

  useEffect(() => {
    selectAllSimilarPhotos();
    selectAllScreenshots();
    selectAllBlurryPhotos();
    selectAllContacts();
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { openModal, closeModal, closeAllModals } = useModals();
  const setLastSmartClean = useSetStorage('lastSmartClean');

  const handleClean = async () => {
    if (!hasPremium) {
      showPaywall();
      return;
    }

    openModal('LoaderModal');

    const quantity = selectedAssets.length + selectedContacts.length;
    const size =
      selectedAssets.reduce((acc, item) => acc + (item.size || 0), 0) +
      (selectedContacts.length > 0 ? 1000 * 50 : 0);
    const { order, integers, hundredths } = byteHandler(size);
    const sizeString = integers + ',' + hundredths + ' ' + order;

    const set = new Set(selectedAssets.map((asset) => asset.id));
    const [cleaningSuccess] = await Promise.all([
      CameraRoll.deleteAssets(Array.from(set)),
      mergeAndDeleteSimilarContacts(selectedContacts, similarGroups),
      new Promise((resolve) => setTimeout(resolve, FAKE_DELAY)),
    ]);
    if (cleaningSuccess.success) {
      setLastSmartClean(Date.now());
      manageSelectedAssets.clear();
      setSelectedContacts([]);
      invalidateCleanerAlbums(['screenshots', 'blurryPhotos', 'similarPhotos']);
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

  const segments = useMemo(
    () => [
      {
        value: screenshotsPercent,
        color: SCREENSHOTS_COLOR,
        isSelected: isAllScreenshotsSelected,
        totalSize: allScreenshotsSize,
      },
      {
        value: 10,
        color: DUPL_CONTACTS_COLOR,
        isSelected: isAllContactsSelected,
        totalSize: 1000 * 50,
      },
      {
        value: similarPhotosPercent,
        color: DUPL_PHOTOS_COLOR,
        isSelected: isAllSimilarPhotosSelected,
        totalSize: allSimilarPhotosSize,
      },
      {
        value: blurryPhotosPercent,
        color: BLURRY_COLOR,
        isSelected: isAllBlurryPhotosSelected,
        totalSize: allBlurryPhotosSize,
      },
    ],
    [
      screenshotsPercent,
      isAllScreenshotsSelected,
      allScreenshotsSize,
      isAllContactsSelected,
      similarPhotosPercent,
      isAllSimilarPhotosSelected,
      allSimilarPhotosSize,
      blurryPhotosPercent,
      isAllBlurryPhotosSelected,
      allBlurryPhotosSize,
    ]
  );

  const { width } = useWindowDimensions();
  const [totalSelectedSizeOrder, setTotalSelectedSizeOrder] = useState('');
  const [totalSelectedSizeIntegers, setTotalSelectedSizeIntegers] =
    useState('');
  const [totalSelectedSizeHundredths, setTotalSelectedSizeHundredths] =
    useState('');

  useEffect(() => {
    const totalSelectedSize = segments.reduce(
      (sum, s) => sum + (s.isSelected ? s.totalSize : 0),
      0
    );
    const { order, integers, hundredths } = byteHandler(totalSelectedSize);

    setTotalSelectedSizeOrder(order);
    setTotalSelectedSizeIntegers(integers);
    setTotalSelectedSizeHundredths(hundredths);
  }, [segments]);

  useEffect(() => {
    openModal('ScanningModal');
  }, []);

  return (
    <>
      <Page>
        <PageBackground />
        <Container>
          <PageHeader pageName={langs[selectedLang].page_names.smart_cleaner} />
          <ScrollView className="mt-4">
            <UsedSizeArea
              usedSize={
                allSimilarPhotosSize +
                allScreenshotsSize +
                allBlurryPhotosSize +
                (!isScanningForSimilarContacts &&
                similarGroups.flat().length > 0
                  ? 1000 * 50
                  : 0)
              }
            />
            <View className="rounded-3xl bg-white/5 gap-y-5.5 p-3">
              <View className="-mt-4">
                <RoundedArcChart
                  segmentsToSet={segments}
                  radiusOuter={(width - 30) * 0.45}
                  radiusInner={(width - 30) * 0.3}
                  size={width - 30}
                  selectedSizeLabelOrder={totalSelectedSizeOrder}
                  selectedSizeLabelIntegers={totalSelectedSizeIntegers}
                  selectedSizeLabelHundredths={totalSelectedSizeHundredths}
                />
              </View>
              <Btn
                label={langs[selectedLang].buttons.fast_cleanup}
                handler={handleClean}
                size="big"
                disabled={
                  selectedAssets.length === 0 && selectedContacts.length === 0
                }
              />
              <View className="gap-y-3">
                {(
                  [
                    [
                      langs[selectedLang].pages.smart_cleaner.screenshots,
                      SCREENSHOTS_COLOR,
                      screenshots.assets,
                      isAllScreenshotsSelected,
                      isScreenshotsPartiallySelected,
                      selectAllScreenshots,
                      deselectAllScreenshots,
                      () =>
                        router.navigate({
                          pathname: '/gallery-cleaner/[album]',
                          params: {
                            album: 'screenshots',
                            buttonPressAction: 'back',
                          },
                        }),
                    ],
                    [
                      langs[selectedLang].pages.smart_cleaner
                        .duplicate_contacts,
                      DUPL_CONTACTS_COLOR,
                      isScanningForSimilarContacts
                        ? undefined
                        : similarGroups.flat(),
                      isAllContactsSelected,
                      isContactsPartiallySelected,
                      selectAllContacts,
                      deselectAllContacts,
                      () =>
                        router.navigate({
                          pathname: '/contacts-cleaner',
                          params: {
                            buttonPressAction: 'back',
                          },
                        }),
                    ],
                    [
                      langs[selectedLang].pages.smart_cleaner.duplicate_photos,
                      DUPL_PHOTOS_COLOR,
                      similarPhotos.assets,
                      isAllSimilarPhotosSelected,
                      isSimilarPhotosPartiallySelected,
                      selectAllSimilarPhotos,
                      deselectAllSimilarPhotos,
                      () =>
                        router.navigate({
                          pathname: '/gallery-cleaner/[album]',
                          params: {
                            album: 'similarPhotos',
                            buttonPressAction: 'back',
                          },
                        }),
                    ],
                    [
                      langs[selectedLang].pages.smart_cleaner.blurry_photos,
                      BLURRY_COLOR,
                      blurryPhotos.assets,
                      isAllBlurryPhotosSelected,
                      isBlurryPhotosPartiallySelected,
                      selectAllBlurryPhotos,
                      deselectAllBlurryPhotos,
                      () =>
                        router.navigate({
                          pathname: '/gallery-cleaner/[album]',
                          params: {
                            album: 'blurryPhotos',
                            buttonPressAction: 'back',
                          },
                        }),
                    ],
                  ] as const
                ).map(
                  ([
                    title,
                    color,
                    assets,
                    isAllSelected,
                    isPartiallySelected,
                    selectAll,
                    deselectAll,
                    onPress,
                  ]) => (
                    <TouchableOpacity
                      className="gap-3"
                      key={title}
                      onPress={onPress}
                    >
                      <View className="flex-row justify-between gap-x-2.5">
                        <View
                          className="size-[11] rounded-full top-1.5"
                          style={{ backgroundColor: color }}
                        />
                        <View className="flex-1">
                          <View className="flex-row items-center gap-x-2">
                            <UiText
                              className="text-lg font-medium"
                              numberOfLines={1}
                            >
                              {title}
                            </UiText>
                            <ChevronRight />
                          </View>
                          <View className="flex-row items-center gap-1">
                            <UiText className="text-xs color-gray">
                              {countFormatted(assets)}
                            </UiText>
                          </View>
                        </View>
                        <Pressable
                          className="flex-row items-center gap-x-2"
                          onPress={isAllSelected ? deselectAll : selectAll}
                        >
                          <UiText className="capitalize text-gray">
                            {langs[selectedLang].select}
                          </UiText>
                          <Checkbox
                            checked={isAllSelected}
                            onChange={isAllSelected ? deselectAll : selectAll}
                            disabled={!assets?.length}
                          />
                        </Pressable>
                      </View>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </ScrollView>
        </Container>
      </Page>
    </>
  );
}
