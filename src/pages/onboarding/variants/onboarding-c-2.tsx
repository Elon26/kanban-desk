import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import StorageImage from '@/images/onBoarding/storage-2.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingC2() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="px-4 h-full">
      <Image
        source={StorageImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: scaleX(316),
          height: scaleY(211),
          top: scaleY(127),
          left: scaleX(30),
        }}
      />
      <View
        style={{
          top: scaleY(466),
        }}
      >
        <UiText className="text-4xl font-extralight uppercase mb-6">
          {langs[selectedLang].pages.onboarding.secure_storage}
        </UiText>
        <UiText className="text-xl text-gray">
          {langs[selectedLang].pages.onboarding.securely_store}
        </UiText>
      </View>
    </View>
  );
}
