/* eslint-disable react-compiler/react-compiler */
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { Pressable } from './pressable';
import { UiText } from './ui-text';

type ChevronProps = {
  label: string;
  handler: () => void;
  disabled?: boolean;
  color: string;
};

export function PulseBtn({
  label,
  handler,
  disabled = false,
  color,
}: ChevronProps) {
  // background animation
  const backgroundPulse = useRef(new Animated.Value(1));

  // wave movement (left / right)
  const leftX = useRef(new Animated.Value(-scaleX(30)));
  const rightX = useRef(new Animated.Value(scaleX(30)));
  const waveOpacity = useRef(new Animated.Value(0.35));

  useEffect(() => {
    const colorDuration = 1000;
    const waveDuration = 450;

    // background pulse (оставим как было, но тоже ускорим)
    const bgPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundPulse.current, {
          toValue: 0.4,
          duration: colorDuration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundPulse.current, {
          toValue: 1,
          duration: colorDuration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    bgPulse.start();

    // wave movement
    const waves = Animated.loop(
      Animated.parallel([
        // move left wave ←
        Animated.sequence([
          Animated.timing(leftX.current, {
            toValue: -200,
            duration: waveDuration,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(2 * colorDuration - waveDuration),
          Animated.timing(leftX.current, {
            toValue: -scaleX(30),
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        // move right wave →
        Animated.sequence([
          Animated.timing(rightX.current, {
            toValue: 200,
            duration: waveDuration,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(2 * colorDuration - waveDuration),
          Animated.timing(rightX.current, {
            toValue: scaleX(30),
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        // opacity fade
        Animated.sequence([
          Animated.timing(waveOpacity.current, {
            toValue: 0,
            duration: waveDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(waveOpacity.current, {
            toValue: 0.35,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    waves.start();

    return () => {
      bgPulse.stop();
      waves.stop();
    };
  }, []);

  return (
    <Pressable
      onPress={handler}
      disabled={disabled}
      className="overflow-hidden rounded-3xl bg-white/10"
      style={{
        height: scaleY(52),
      }}
    >
      {/* background pulse */}
      <Animated.View
        className="rounded-3xl w-full"
        style={{
          backgroundColor: color,
          height: scaleY(52),
          opacity: backgroundPulse.current,
        }}
      />

      {/* LEFT circular wave */}
      <Animated.View
        style={{
          position: 'absolute',
          width: scaleY(52),
          height: scaleY(52),
          borderRadius: 100,
          backgroundColor: 'rgba(0,0,0,0.25)',
          opacity: waveOpacity.current,
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -scaleY(26) },
            { translateY: -scaleY(26) },
            { translateX: leftX.current },
          ],
        }}
      />

      {/* RIGHT circular wave */}
      <Animated.View
        style={{
          position: 'absolute',
          width: scaleY(52),
          height: scaleY(52),
          borderRadius: 100,
          backgroundColor: 'rgba(0,0,0,0.25)',
          opacity: waveOpacity.current,
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -scaleY(26) },
            { translateY: -scaleY(26) },
            { translateX: rightX.current }, // motion to the right
          ],
        }}
      />

      {/* label */}
      <View className="absolute items-center justify-center h-full w-full">
        <UiText className="text-center text-base font-medium">{label}</UiText>
      </View>
    </Pressable>
  );
}
