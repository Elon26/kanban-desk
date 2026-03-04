import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import ContactsImageEn from '@/images/onBoarding/contacts-en.png';
import ContactsImageJa from '@/images/onBoarding/contacts-ja.png';
import ContactsImageKo from '@/images/onBoarding/contacts-ko.png';
import DiagramImageEn from '@/images/onBoarding/diagram-en.png';
import DiagramImageJa from '@/images/onBoarding/diagram-ja.png';
import DiagramImageKo from '@/images/onBoarding/diagram-ko.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingB1() {
  const selectedLang = useStorageValue('selectedLang');

  let diagramImage = DiagramImageEn;
  let contactsImage = ContactsImageEn;
  if (selectedLang === LangCode.ja) {
    diagramImage = DiagramImageJa;
    contactsImage = ContactsImageJa;
  }
  if (selectedLang === LangCode.ko) {
    diagramImage = DiagramImageKo;
    contactsImage = ContactsImageKo;
  }

  return (
    <View className="px-4 h-full">
      <Image
        source={diagramImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: scaleX(345),
          height: scaleY(185),
          top: scaleY(52),
          left: scaleY(16),
        }}
      />
      <Image
        source={contactsImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: scaleX(469),
          height: scaleY(145),
          top: scaleY(273),
          left: scaleX(-60),
        }}
      />
      <View
        style={{
          top: scaleY(466),
        }}
      >
        <UiText className="text-4xl font-extralight mb-6">
          {langs[selectedLang].pages.onboarding.deep_clean}
        </UiText>
        <UiText className="text-xl text-gray">
          {langs[selectedLang].pages.onboarding.remove_junk}
        </UiText>
      </View>
    </View>
  );
}
