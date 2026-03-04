import { useStorageUsage } from '@kirz/react-native-device-info';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

import byteHandler from '../helpers/byte-handler';
import { GradientProgressBar } from './progress-bar';

type Props = {
  usedSize: number;
};

export function UsedSizeArea({ usedSize }: Props) {
  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');

  const {
    order: usedSizeOrder,
    integers: usedSizeIntegers,
    hundredths: usedSizeHundredths,
  } = byteHandler(usedSize);

  const storageUsage = useStorageUsage();
  const {
    order: totalSizeOrder,
    integers: totalSizeIntegers,
    hundredths: totalSizeHundredths,
  } = byteHandler(storageUsage.total);

  const lastSmartClean = useStorageValue('lastSmartClean');
  const isLastSmartCleanWasTooLongAgo =
    Date.now() - lastSmartClean > 1000 * 60 * 60 * 24 * 7;

  return (
    <View className="gap-y-3 mx-1 mb-8 mt-4">
      <View className="flex-row justify-between">
        <View className="flex-row items-end">
          <UiText className="text-5xl font-light">{usedSizeOrder}</UiText>
          <UiText className="text-5xl font-semibold pl-2">
            {usedSizeIntegers}
          </UiText>
          <UiText className="text-2xl font-medium text-gray pb-1.5">
            ,{usedSizeHundredths}
          </UiText>
        </View>

        <View className="mt-1">
          <View
            className="rounded-3xl border px-2 py-1"
            style={{
              borderColor: isLastSmartCleanWasTooLongAgo
                ? '#F76363'
                : '#30D079',
            }}
          >
            <UiText
              className="text-xs"
              style={{
                color: isLastSmartCleanWasTooLongAgo ? '#F76363' : '#30D079',
              }}
            >
              {langs[selectedLang].pages.smart_cleaner.last_clean}{' '}
              {lastSmartClean === 0
                ? langs[selectedLang].never
                : new Date(lastSmartClean).toLocaleDateString(
                    createLangStringForDate(selectedLang)
                  )}
            </UiText>
          </View>
        </View>
      </View>

      <View>
        <GradientProgressBar progress={(usedSize / storageUsage.total) * 100} />
      </View>

      <View className="flex-row items-end">
        <UiText>
          {t('storageUsed', {
            usedSpace: `${usedSizeIntegers},${usedSizeHundredths} ${usedSizeOrder}`,
            totalSpace: `${totalSizeIntegers},${totalSizeHundredths} ${totalSizeOrder}`,
          })}
        </UiText>
      </View>
    </View>
  );
}
