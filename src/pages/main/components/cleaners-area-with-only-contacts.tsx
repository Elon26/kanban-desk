import { prettyBytes, useStorageUsage } from '@kirz/react-native-device-info';
import { type Route, router } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Divider } from '@/components/divider';
import { useConfig } from '@/hooks/use-config';
import { useStorageValue } from '@/hooks/use-storage';
import { useWidgetBridge } from '@/hooks/use-widget-bridge';
import langs from '@/i18n/langs.json';
import { useContactsCleaner } from '@/pages/contacts-cleaner/hooks/use-contacts-cleaner';
import StorageItem from '@/pages/main/components/storage-item';
import ContactIcon from '@/svg/contact.svg';
import EyeIcon from '@/svg/eye-closed.svg';
import GalleryIcon from '@/svg/gallery.svg';
import { Btn } from '@/ui/button';
import { PulseBtn } from '@/ui/pulse-button';
import { UiText } from '@/ui/ui-text';

import CircleDiagram from './circle-diagram';
import CleanerItem from './cleaner-item';

type Props = {
  hasPremium: boolean;
  hasButton: boolean;
  hasNewButton: boolean;
};

export default function CleanersAreaWithOnlyContacts({
  hasPremium,
  hasButton,
  hasNewButton,
}: Props) {
  const { moderation_mode } = useConfig();
  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');
  const storageUsage = useStorageUsage();
  const percentage = Math.round((storageUsage.used / storageUsage.total) * 100);
  const { updateWidgetData } = useWidgetBridge();

  const { groupsSimilarBy, isScanningForSimilarContacts } =
    useContactsCleaner();
  const similarGroups = groupsSimilarBy.any;

  useEffect(() => {
    if (storageUsage) {
      updateWidgetData('CleanerWidget', {
        storageInfoTotal: prettyBytes(storageUsage.total),
        storageInfoOccupied: prettyBytes(storageUsage.used),
        storageInfoPercentOccupied: percentage / 100,
      });
    }
  }, [storageUsage, updateWidgetData]);

  return (
    <View className="mt-2">
      <View className="flex-row">
        <View className="items-center justify-center rounded-t-3xl bg-white/10 p-3">
          <UiText className="text-center font-medium">
            {langs[selectedLang].smart_cleaner}
          </UiText>
          <View className="h-[80px] w-[110px]">
            <View className="size-[110px] justify-center">
              <CircleDiagram
                size={110}
                numDots={20}
                dotRadius={2}
                percentage={hasPremium ? percentage : 0}
              />
              <View className="absolute items-center justify-center h-full w-full">
                <View className="flex-row items-end justify-center">
                  <UiText className="text-2xl font-semibold">
                    {hasPremium ? percentage : '--'}
                  </UiText>
                  <UiText className="text-xs pb-0.5">%</UiText>
                </View>
                <UiText className="text-xs">
                  {moderation_mode
                    ? langs[selectedLang].used
                    : langs[selectedLang].loaded}
                </UiText>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-1 rounded-es-3xl ml-[0.25px]">
          <View className="flex-1 justify-center rounded-es-3xl p-3">
            <CleanerItem
              Icon={ContactIcon}
              handler={() => router.navigate('/contacts-cleaner')}
              quantity={similarGroups.flat().length}
              color="purple"
              hasPremium={hasPremium}
              isLoading={isScanningForSimilarContacts}
            />
            <Divider />
            <CleanerItem
              Icon={GalleryIcon}
              handler={() => router.navigate('/gallery-cleaner/similarPhotos')}
              quantity={null}
              color="yellow"
              hasPremium={hasPremium}
              isLoading={false}
            />
          </View>
        </View>
      </View>
      <View className="rounded-b-3xl rounded-se-3xl bg-white/10 text-center p-3">
        <View className="gap-y-3 mb-1.5">
          <View className="flex-row items-center justify-between gap-x-3">
            <View className="gap-y-1">
              <UiText className="font-medium">
                {langs[selectedLang].pages.main.storage_used}
              </UiText>
              <UiText className="text-sm font-medium color-gray">
                {t('storage', {
                  usedSpace: hasPremium
                    ? prettyBytes(storageUsage.used)
                    : '-- GB',
                  totalSpace: hasPremium
                    ? prettyBytes(storageUsage.total)
                    : '-- GB',
                })}
              </UiText>
            </View>
            <View className="flex-1 flex-row justify-center">
              <StorageItem
                label="N/A"
                Icon={EyeIcon}
                hasPremium={hasPremium}
                percentage={0}
                link={'/gallery-cleaner/blurryPhotos' as Route}
                isLoading={false}
              />
              <StorageItem
                label="N/A"
                Icon={EyeIcon}
                hasPremium={hasPremium}
                percentage={0}
                link={'/gallery-cleaner/screenshots' as Route}
                isLoading={false}
              />
              <StorageItem
                label="N/A"
                Icon={EyeIcon}
                hasPremium={hasPremium}
                percentage={0}
                link={'/gallery-cleaner/similarPhotos' as Route}
                isLoading={false}
              />
            </View>
          </View>
          {hasButton &&
            (hasNewButton ? (
              <PulseBtn
                label={langs[selectedLang].buttons.start_cleaning}
                handler={() => router.navigate('/smart-cleaner')}
                color="#FF2020"
              />
            ) : (
              <Btn
                label={langs[selectedLang].buttons.start_cleaning}
                handler={() => router.navigate('/smart-cleaner')}
                size="big"
              />
            ))}
        </View>
      </View>
    </View>
  );
}
