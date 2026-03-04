/* eslint-disable react-compiler/react-compiler */
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import FirstScreenImage from '@/images/main-slider-1.png';
import SecondScreenImage from '@/images/main-slider-2.png';
import ThirdScreenImage from '@/images/main-slider-3.png';
import { UiText } from '@/ui/ui-text';

const { width } = Dimensions.get('window');

export default function MainSlider() {
  const selectedLang = useStorageValue('selectedLang');

  const fadeAnimFirst = useRef(new Animated.Value(1));
  const fadeAnimSecond = useRef(new Animated.Value(0));
  const fadeAnimThird = useRef(new Animated.Value(0));

  useEffect(() => {
    const firstImageAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(fadeAnimFirst.current, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.delay(5000),
        Animated.timing(fadeAnimFirst.current, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );
    const secondImageAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(fadeAnimSecond.current, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnimSecond.current, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.delay(3000),
      ])
    );
    const thirdImageAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(5000),
        Animated.timing(fadeAnimThird.current, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnimThird.current, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );

    firstImageAnim.start();
    secondImageAnim.start();
    thirdImageAnim.start();

    return () => {
      firstImageAnim.stop();
      secondImageAnim.stop();
      thirdImageAnim.stop();
    };
  }, []);

  return (
    <View
      className="relative overflow-hidden rounded-3xl mt-2 h-20"
      style={{ flex: 1, alignItems: 'center' }}
    >
      <Animated.View
        className="absolute justify-end overflow-hidden rounded-xl"
        style={{
          opacity: fadeAnimFirst.current,
          height: scaleY(80),
          width: width - scaleX(30),
        }}
      >
        <Image
          source={FirstScreenImage}
          contentFit="cover"
          className="absolute inset-0 h-full w-full"
        />
        <UiText className="text-gray m-3">
          {langs[selectedLang].pages.main.slider_screens.first}
        </UiText>
      </Animated.View>
      <Animated.View
        className="absolute justify-end overflow-hidden rounded-xl"
        style={{
          opacity: fadeAnimSecond.current,
          height: scaleY(80),
          width: width - scaleX(30),
        }}
      >
        <Image
          source={SecondScreenImage}
          contentFit="cover"
          className="absolute inset-0 h-full w-full"
        />
        <UiText className="text-gray m-3">
          {langs[selectedLang].pages.main.slider_screens.second}
        </UiText>
      </Animated.View>
      <Animated.View
        className="absolute justify-end overflow-hidden rounded-xl"
        style={{
          opacity: fadeAnimThird.current,
          height: scaleY(80),
          width: width - scaleX(30),
        }}
      >
        <Image
          source={ThirdScreenImage}
          contentFit="cover"
          className="absolute inset-0 h-full w-full"
        />
        <UiText className="text-gray m-3">
          {langs[selectedLang].pages.main.slider_screens.third}
        </UiText>
      </Animated.View>
    </View>
  );
}
