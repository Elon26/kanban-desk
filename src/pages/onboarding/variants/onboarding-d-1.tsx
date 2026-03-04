import { Env } from '@kirz/expo-env';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function OnboardingD1() {
  const selectedLang = useStorageValue('selectedLang');

  const size = scaleX(200);
  const radius = size / 2 - scaleX(8);
  const totalDots = 25;

  const animatedDots = useRef(new Animated.Value(Math.round(totalDots * 0.73)));
  const animatedPercent = useRef(new Animated.Value(90));
  const animatedStorage = useRef(new Animated.Value(90));
  const [filledDots, setFilledDots] = useState(0);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentStorage, setCurrentStorage] = useState(0);

  useEffect(() => {
    Animated.timing(animatedDots.current, {
      toValue: totalDots * 0.25,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedPercent.current, {
      toValue: 25,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedStorage.current, {
      toValue: 30,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const listener = animatedDots.current.addListener(({ value }) => {
      setFilledDots(Math.round(value));
    });
    return () => animatedDots.current.removeListener(listener);
  }, [animatedDots]);

  useEffect(() => {
    const listener = animatedPercent.current.addListener(({ value }) => {
      setCurrentPercent(Math.round(value));
    });
    return () => animatedPercent.current.removeListener(listener);
  }, [animatedPercent]);

  useEffect(() => {
    const listener = animatedStorage.current.addListener(({ value }) => {
      setCurrentStorage(Math.round(value));
    });
    return () => animatedStorage.current.removeListener(listener);
  }, [animatedStorage]);

  const dots = Array.from({ length: totalDots }, (_, i) => {
    const angle = (i / totalDots) * 2 * Math.PI - Math.PI / 2;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    const isFilled = i < filledDots;
    return (
      <Circle
        key={i}
        cx={x}
        cy={y}
        r={scaleX(5)}
        fill={isFilled ? '#3D93F2' : '#BFBFBF40'}
      />
    );
  });

  return (
    <View
      className="gap-y-10 px-4 h-full w-full"
      style={{ paddingTop: scaleY(24) }}
    >
      <View>
        <UiText className="text-center text-4xl font-thin">
          {langs[selectedLang].pages.onboarding.welcome_to}
        </UiText>
        <UiText className="text-center text-4xl font-medium">
          {Env.APP_NAME}
        </UiText>
      </View>

      <View className="items-center">
        <Svg width={size} height={size}>
          {dots}
        </Svg>
        <View className="absolute gap-y-5 top-15">
          <UiText className="text-center font-semibold text-gray">
            {langs[selectedLang].pages.onboarding.storage_loaded_on}
          </UiText>
          <UiText
            className={twMerge(
              'text-center text-4xl font-semibold',
              currentPercent > 75
                ? 'text-[#E53C3C]'
                : currentPercent > 50
                  ? 'text-[#F7BE63]'
                  : 'text-[#30D079]'
            )}
          >
            {currentPercent}%
          </UiText>
        </View>
      </View>

      <View className="items-center rounded-full border-2 border-blue bg-white/10 gap-y-1.5 p-3 w-full">
        <UiText className="text-xs text-gray">
          {langs[selectedLang].pages.paywall.paywall_d.system_is_loaded}
        </UiText>
        <UiText
          className={twMerge(
            'text-xl font-medium',
            currentStorage > 75
              ? 'text-[#E53C3C]'
              : currentStorage > 50
                ? 'text-[#F7BE63]'
                : 'text-[#30D079]'
          )}
        >
          {currentStorage} GB
        </UiText>
      </View>

      <View>
        <UiText className="text-center text-xl text-gray">
          {langs[selectedLang].pages.onboarding.say_goodbye}
        </UiText>
      </View>
    </View>
  );
}
