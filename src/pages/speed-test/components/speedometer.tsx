import { MeasureType } from '@kirz/expo-speedtest/build/types';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, LinearGradient, Stop } from 'react-native-svg';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import SpeedArrow from '@/svg/speed-arrow.svg';
import { UiText } from '@/ui/ui-text';

const STROKE_WIDTH = 30;
const MAX_VALUE = 500;
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Speedometer({
  value,
  status,
  downloadResults,
}: {
  value: number;
  status: MeasureType | 'inactive';
  downloadResults: number | null;
}) {
  const selectedLang = useStorageValue('selectedLang');

  const { width } = useWindowDimensions();
  const SIZE = width - 80;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS * (SWEEP_ANGLE / 360);

  const animatedValue = useSharedValue(0);
  const animatedDisplayValue = useSharedValue(0);
  const [displayedText, setDisplayedText] = useState('0.0');

  // Обновляем анимированные значения
  useEffect(() => {
    const clamped = Math.min(value, MAX_VALUE);
    animatedValue.value = withTiming(clamped, { duration: 1000 });
    animatedDisplayValue.value = withTiming(clamped, { duration: 1000 });
  }, [value]);

  // Обновляем текст через runOnJS
  useDerivedValue(() => {
    const formatted = `${animatedDisplayValue.value.toFixed(1)}`;
    runOnJS(setDisplayedText)(formatted);
  }, [animatedDisplayValue]);

  // Анимация дуги
  const animatedProps = useAnimatedProps(() => {
    const progress = animatedValue.value / MAX_VALUE;
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress),
    };
  });

  // Анимация стрелки
  const arrowStyle = useAnimatedStyle(() => {
    const progress = animatedValue.value / MAX_VALUE;
    const angle = -START_ANGLE + SWEEP_ANGLE * progress;

    return {
      transform: [
        { rotate: `${angle}deg` },
        { translateY: -RADIUS + STROKE_WIDTH / 2 - 40 },
      ],
    };
  });

  return (
    <View className="items-center justify-center pt-4">
      <View>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#aa7a6e" />
              <Stop offset="100%" stopColor="#413238" />
            </LinearGradient>
          </Defs>

          <G rotation={START_ANGLE} origin={`${SIZE / 2}, ${SIZE / 2}`}>
            <Circle
              stroke="#ffffff07"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE}, ${2 * Math.PI * RADIUS}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            <AnimatedCircle
              stroke="url(#grad)"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE}, ${2 * Math.PI * RADIUS}`}
              strokeLinecap="round"
              animatedProps={animatedProps}
            />
          </G>
        </Svg>
      </View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: SIZE / 2,
            left: SIZE / 2,
          },
          arrowStyle,
        ]}
      >
        <SpeedArrow />
      </Animated.View>

      {status !== 'inactive' && (
        <View className="absolute items-start top-[40%] w-32">
          <UiText className="capitalize text-gray">
            {(status === 'download' &&
              langs[selectedLang].pages.speed_test.download) ||
              (status === 'upload' &&
                langs[selectedLang].pages.speed_test.upload)}
          </UiText>
          <View className="flex-row items-end mb-4">
            <UiText className="text-3xl font-semibold">{displayedText}</UiText>
            <UiText className="text-lg pb-1"> mb/s</UiText>
          </View>
          <View
            className="self-center rounded-2xl border p-3"
            style={{
              borderColor:
                value > 100 ? '#81F763' : value > 50 ? '#F7BE63' : '#F76363',
            }}
          >
            <UiText
              className="text-sm"
              style={{
                color:
                  value > 100 ? '#81F763' : value > 50 ? '#F7BE63' : '#F76363',
              }}
            >
              {value > 100
                ? langs[selectedLang].pages.speed_test.high_speed
                : value > 50
                  ? langs[selectedLang].pages.speed_test.medium_speed
                  : langs[selectedLang].pages.speed_test.low_speed}
            </UiText>
          </View>
        </View>
      )}

      {status === 'inactive' && downloadResults && (
        <View className="absolute top-[45%] w-32">
          <UiText className="text-center text-gray mb-2">
            {langs[selectedLang].pages.speed_test.rating}
          </UiText>
          <View className="self-center">
            <View
              className="rounded-2xl border p-3"
              style={{
                borderColor:
                  downloadResults > 100
                    ? '#81F763'
                    : downloadResults > 50
                      ? '#F7BE63'
                      : '#F76363',
              }}
            >
              <UiText
                className="text-center text-sm"
                style={{
                  color:
                    downloadResults > 100
                      ? '#81F763'
                      : downloadResults > 50
                        ? '#F7BE63'
                        : '#F76363',
                }}
              >
                {downloadResults > 100
                  ? langs[selectedLang].pages.speed_test.high_speed
                  : downloadResults > 50
                    ? langs[selectedLang].pages.speed_test.medium_speed
                    : langs[selectedLang].pages.speed_test.low_speed}
              </UiText>
            </View>
          </View>
        </View>
      )}

      <View className="absolute flex-row justify-center gap-x-32 bottom-[28px] w-full">
        <UiText className="text-white">0</UiText>
        <UiText className="text-white">{MAX_VALUE}</UiText>
      </View>
    </View>
  );
}
