import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import TaskMapImageEn from '@/images/onBoarding/task-map-en.png';
import TaskMapImageJa from '@/images/onBoarding/task-map-ja.png';
import TaskMapImageKo from '@/images/onBoarding/task-map-ko.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingA2() {
  const selectedLang = useStorageValue('selectedLang');
  let taskMapImage = TaskMapImageEn;
  if (selectedLang === LangCode.ja) taskMapImage = TaskMapImageJa;
  if (selectedLang === LangCode.ko) taskMapImage = TaskMapImageKo;

  return (
    <View className="px-4 h-full">
      <Image
        source={taskMapImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: scaleX(377),
          height: scaleY(399),
          top: scaleY(31),
          left: scaleY(16),
        }}
      />
      <View
        style={{
          top: scaleY(466),
        }}
      >
        <UiText className="text-5xl font-extralight mb-6">
          {langs[selectedLang].pages.onboarding.organize}
        </UiText>
        <UiText className="text-xl text-gray">
          {langs[selectedLang].pages.onboarding.use_tags}
        </UiText>
      </View>
    </View>
  );
}
