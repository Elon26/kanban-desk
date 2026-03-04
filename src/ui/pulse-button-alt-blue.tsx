/* eslint-disable react-compiler/react-compiler */
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Pressable } from './pressable';
import { UiText } from './ui-text';

type ChevronProps = {
  label: string;
  handler: () => void;
  disabled?: boolean;
  color: string;
};

export function PulseBtnAltBlue({
  label,
  handler,
  disabled = false,
  color,
}: ChevronProps) {
  const leftX = useRef(new Animated.Value(scaleX(160)));
  const waveDuration = 1000;

  useEffect(() => {
    const waves = Animated.loop(
      Animated.sequence([
        Animated.timing(leftX.current, {
          toValue: -scaleX(240),
          duration: waveDuration,
          useNativeDriver: true,
        }),
        Animated.timing(leftX.current, {
          toValue: scaleX(160),
          duration: waveDuration,
          useNativeDriver: true,
        }),
      ])
    );
    waves.start();

    return () => {
      waves.stop();
    };
  }, []);

  return (
    <Pressable
      onPress={handler}
      disabled={disabled}
      className="overflow-hidden rounded-3xl"
      style={{
        height: scaleY(52),
        backgroundColor: color,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: scaleX(300),
          height: scaleY(70),
          top: 0,
          right: 0,
          transform: [{ translateX: leftX.current }],
        }}
      >
        <LinearGradient
          colors={['#3D93F2', '#5ea9f8', '#3D93F2']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Animated.View>

      <View className="absolute items-center justify-center h-full w-full">
        <UiText className="text-center text-base font-medium">{label}</UiText>
      </View>
    </Pressable>
  );
}
