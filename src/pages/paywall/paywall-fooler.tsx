import { Env } from '@kirz/expo-env';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UiText } from '@/ui/ui-text';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { useWebViewModal } from './hooks/use-web-view-modal';
import { scaleY } from '@kirz/nativewind-scale';

export function PaywallFooter({ children }: { children: ReactNode }) {
  const selectedLang = useStorageValue('selectedLang');
  const { openModal: openWebViewModal } = useWebViewModal();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute w-screen bg-[#19171c] gap-y-3 px-10 bottom-0 pt-3"
      style={{ paddingBottom: insets.bottom || scaleY(16) }}
    >
      {children}
      <UiText className="self-center text-sm text-gray">
        <UiText
          className="text-sm text-gray underline"
          onPress={() => {
            openWebViewModal(Env.TERMS_OF_USE);
          }}
        >
          {langs[selectedLang].pages.settings.terms}
        </UiText>{' '}
        {langs[selectedLang].and_symbol}{' '}
        <UiText
          className="text-sm text-gray underline"
          onPress={() => {
            openWebViewModal(Env.PRIVACY_POLICY);
          }}
        >
          {langs[selectedLang].pages.settings.privacy}
        </UiText>
      </UiText>
    </View>
  );
}
