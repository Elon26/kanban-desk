/* eslint-disable react-compiler/react-compiler */
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import ScanIconsImage from '@/images/scan-icons.png';
import { UiText } from '@/ui/ui-text';

export default function ScanningModal() {
  const { closeModal } = useModals();
  const selectedLang = useStorageValue('selectedLang');
  const { height, width } = useWindowDimensions();

  const size = scaleX(160);
  const radius = size / 2 - scaleX(8);
  const totalDots = 20;

  const animatedDots = useRef(new Animated.Value(0));
  const animatedOpacity = useRef(new Animated.Value(0));
  const animatedIconsTranslateY = useRef(new Animated.Value(300));
  const [filledDots, setFilledDots] = useState(0);

  useEffect(() => {
    Animated.timing(animatedDots.current, {
      toValue: totalDots,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedOpacity.current, {
      toValue: 1,
      duration: 4000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedIconsTranslateY.current, {
      toValue: scaleY(0),
      duration: 4000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      closeModal('ScanningModal');
    }, 5000);
  }, []);

  useEffect(() => {
    const listener = animatedDots.current.addListener(({ value }) => {
      setFilledDots(Math.floor(value));
    });
    return () => animatedDots.current.removeListener(listener);
  }, [animatedDots]);

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
    <Page>
      <PageBackground />
      <Container>
        <View className="gap-y-1 mt-10">
          <UiText className="text-center text-3xl font-bold text-gray">
            {langs[selectedLang].pages.scanning.scanning}
          </UiText>
          <UiText className="text-center text-lg font-semibold text-gray px-10">
            {langs[selectedLang].pages.scanning.unwanted}
          </UiText>
        </View>

        <View
          className="absolute items-center justify-center"
          style={{ height, width }}
        >
          <Animated.View
            className="absolute overflow-hidden rounded-full border border-blue"
            style={{
              width: scaleX(320),
              height: scaleX(320),
              opacity: animatedOpacity.current,
            }}
          >
            <Svg height="100%" width="100%">
              <Defs>
                <RadialGradient
                  id="grad"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#171331" stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>
          </Animated.View>

          <Animated.View
            className="absolute overflow-hidden rounded-full border border-blue"
            style={{
              width: scaleX(190),
              height: scaleX(190),
              opacity: animatedOpacity.current,
            }}
          >
            <Svg height="100%" width="100%">
              <Defs>
                <RadialGradient
                  id="grad"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#171331" stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>
          </Animated.View>

          <Svg width={size} height={size}>
            {dots}
          </Svg>
        </View>

        <Animated.View
          className="absolute items-center justify-end"
          style={{
            height,
            width,
            opacity: animatedOpacity.current,
            transform: [{ translateY: animatedIconsTranslateY.current }],
          }}
        >
          <Image
            source={ScanIconsImage}
            contentFit="contain"
            style={{
              position: 'absolute',
              width: width,
              height: scaleY(240),
            }}
          />
        </Animated.View>
      </Container>
    </Page>
  );
}
