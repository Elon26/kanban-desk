import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { Pressable } from '@/ui/pressable';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export function PaywallFooterButtonArea({
  changeScreen,
  paywallScreenNumber,
  buttonText,
}: {
  changeScreen: (screenNumber: 1 | 2 | 3) => void;
  paywallScreenNumber: 1 | 2 | 3;
  buttonText: string;
}) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="items-center gap-y-2">
      <UiButton
        className="rounded-xl"
        onPress={() => changeScreen(paywallScreenNumber === 1 ? 2 : 3)}
      >
        <UiText className="font-bold text-white">{buttonText}</UiText>
      </UiButton>
      <View className="flex-row gap-x-1">
        <Pressable>
          <UiText className="text-sm text-gray underline">
            {langs[selectedLang].pages.settings.terms}
          </UiText>
        </Pressable>
        <UiText className="text-sm text-gray">
          {langs[selectedLang].and_symbol}
        </UiText>
        <Pressable>
          <UiText className="text-sm text-gray underline">
            {langs[selectedLang].pages.settings.privacy}
          </UiText>
        </Pressable>
      </View>
    </View>
  );
}
