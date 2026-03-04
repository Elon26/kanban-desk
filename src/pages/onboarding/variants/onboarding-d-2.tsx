/* eslint-disable react-compiler/react-compiler */
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackCardImage from '@/images/onBoarding/back-card.png';
import FrontCardImage from '@/images/onBoarding/front-card.png';
import ShieldImage from '@/images/onBoarding/shield.png';
import { UiText } from '@/ui/ui-text';

export function OnboardingD2() {
  const { width } = useWindowDimensions();
  const selectedLang = useStorageValue('selectedLang');
  const isOnboardingDAnimationStarts = useStorageValue(
    'isOnboardingDAnimationStarts'
  );

  const animatedCardRotate = useRef(new Animated.Value(0));
  const animatedShieldScale = useRef(new Animated.Value(0.5));
  const animatedShieldOpacity = useRef(new Animated.Value(0));

  useEffect(() => {
    if (isOnboardingDAnimationStarts) {
      Animated.timing(animatedCardRotate.current, {
        toValue: -70,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      Animated.timing(animatedShieldScale.current, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      Animated.timing(animatedShieldOpacity.current, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnboardingDAnimationStarts]);

  const cardRotate = animatedCardRotate.current.interpolate({
    inputRange: [0, 70],
    outputRange: ['0deg', '70deg'],
  });

  return (
    <View
      className="gap-y-5 px-4 h-full w-full"
      style={{ paddingTop: scaleY(24) }}
    >
      <View>
        <UiText className="text-center text-4xl font-thin">
          {langs[selectedLang].pages.onboarding.take_control}
        </UiText>
      </View>

      <View
        className="items-center justify-center w-full"
        style={{ height: scaleY(321) }}
      >
        <Image
          source={BackCardImage}
          contentFit="contain"
          style={{
            width: scaleX(256),
            height: scaleY(148),
          }}
        />

        <View className="absolute">
          <Animated.View
            style={{
              transform: [{ rotate: cardRotate }],
            }}
          >
            <Image
              source={FrontCardImage}
              contentFit="contain"
              style={{
                width: scaleX(256),
                height: scaleY(148),
                top: scaleY(30),
                left: scaleX(5),
              }}
            />
          </Animated.View>
        </View>

        <View className="absolute">
          <Animated.View
            style={{
              transform: [{ scale: animatedShieldScale.current }],
              opacity: animatedShieldOpacity.current,
            }}
          >
            <Image
              source={ShieldImage}
              contentFit="contain"
              style={{
                width: scaleX(260),
                height: scaleY(280),
              }}
            />
          </Animated.View>
        </View>
      </View>

      <View className="absolute px-edge bottom-48" style={{ width }}>
        <UiText className="text-center text-xl text-gray">
          {langs[selectedLang].pages.onboarding.hide_your_data}
        </UiText>
      </View>
    </View>
  );
}
