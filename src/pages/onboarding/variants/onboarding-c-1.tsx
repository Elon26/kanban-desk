import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useWindowDimensions, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import backgroundImage from '@/images/onBoarding/background.png';
import DiagramImageEn from '@/images/onBoarding/diagram-en.png';
import DiagramImageJa from '@/images/onBoarding/diagram-ja.png';
import DiagramImageKo from '@/images/onBoarding/diagram-ko.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingC1() {
  const { width } = useWindowDimensions();
  const selectedLang = useStorageValue('selectedLang');

  let diagramImage = DiagramImageEn;
  if (selectedLang === LangCode.ja) {
    diagramImage = DiagramImageJa;
  }
  if (selectedLang === LangCode.ko) {
    diagramImage = DiagramImageKo;
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
          top: scaleY(249),
          left: scaleY(16),
        }}
      />
      <Image
        source={backgroundImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: width,
          height: scaleY(600),
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
