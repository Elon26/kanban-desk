import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import CalendarImageEn from '@/images/onBoarding/calendar-en.png';
import CalendarImageJa from '@/images/onBoarding/calendar-ja.png';
import CalendarImageKo from '@/images/onBoarding/calendar-ko.png';
import EllipseImage from '@/images/onBoarding/ellipse.png';
import TaskCardImageEn from '@/images/onBoarding/task-card-en.png';
import TaskCardImageJa from '@/images/onBoarding/task-card-ja.png';
import TaskCardImageKo from '@/images/onBoarding/task-card-ko.png';
import DotIcon from '@/svg/dot.svg';
import { UiText } from '@/ui/ui-text';

export function OnboardingA1() {
  const selectedLang = useStorageValue('selectedLang');

  const images = {
    en: { calendar: CalendarImageEn, taskCard: TaskCardImageEn },
    ja: { calendar: CalendarImageJa, taskCard: TaskCardImageJa },
    ko: { calendar: CalendarImageKo, taskCard: TaskCardImageKo },
  };

  return (
    <View className="px-4 h-full">
      <Image
        source={images[selectedLang].taskCard}
        style={{
          position: 'absolute',
          width: scaleX(158),
          height: scaleX(158),
          top: scaleY(31),
          left: scaleY(16),
        }}
      />
      <Image
        source={images[selectedLang].calendar}
        className="absolute"
        contentFit="contain"
        style={{
          width: scaleX(289),
          height: scaleY(303),
          top: scaleY(63),
          left: scaleX(195),
        }}
      />
      <Image
        source={EllipseImage}
        className="absolute"
        style={{
          width: scaleX(300),
          height: scaleX(300),
          top: scaleY(240),
          left: scaleX(-210),
        }}
      />
      <View
        style={{
          top: scaleY(333),
        }}
      >
        <UiText className="text-5xl font-extralight mb-2">
          {langs[selectedLang].pages.onboarding.plan}
        </UiText>
        <UiText className="text-5xl font-extralight mb-2">
          {langs[selectedLang].pages.onboarding.manage}
        </UiText>
        <View className="flex-row items-center gap-x-2 mb-8">
          <UiText className="text-4xl font-semibold">
            {langs[selectedLang].pages.onboarding.track}
          </UiText>
          <DotIcon />
          <UiText className="text-4xl font-semibold">
            {langs[selectedLang].pages.onboarding.task}
          </UiText>
        </View>
        <UiText className="text-xl text-gray">
          {langs[selectedLang].pages.onboarding.create}
        </UiText>
      </View>
    </View>
  );
}
