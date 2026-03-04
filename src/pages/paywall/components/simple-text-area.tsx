import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function SimpleTextArea() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="py-8">
      <UiText className="text-center text-sm font-medium text-gray">
        {langs[selectedLang].pages.paywall.no_upfront_payment}
      </UiText>
      <UiText className="text-center text-sm font-medium text-gray">
        {langs[selectedLang].pages.paywall.enjoy_free}
      </UiText>
      <UiText className="text-center text-sm font-medium text-gray">
        {langs[selectedLang].pages.paywall.cancel_anytime}
      </UiText>
    </View>
  );
}
