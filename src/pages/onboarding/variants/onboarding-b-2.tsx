import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import StorageImageEn from '@/images/onBoarding/storage-en.png';
import StorageImageJa from '@/images/onBoarding/storage-ja.png';
import StorageImageKo from '@/images/onBoarding/storage-ko.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingB2() {
  const selectedLang = useStorageValue('selectedLang');
  let storageImage = StorageImageEn;
  if (selectedLang === LangCode.ja) storageImage = StorageImageJa;
  if (selectedLang === LangCode.ko) storageImage = StorageImageKo;

  return (
    <View className="px-4 h-full">
      <Image
        source={storageImage}
        contentFit="contain"
        style={{
          position: 'absolute',
          width: scaleX(340),
          height: scaleY(400),
          top: scaleY(20),
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
