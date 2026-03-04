import MaskedView from '@react-native-masked-view/masked-view';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { gradients } from '@/config/theme';

import { UiText } from './ui-text';

export type ButtonGradientOutlineProps = {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
  colors?: [string, string] | readonly [string, string];
} & PropsWithChildren;

export function ButtonGradientOutline({
  onPress,
  disabled,
  label,
  disabledLabel = label,
  className,
  colors = gradients.primary as [string, string],
  children = null,
}: ButtonGradientOutlineProps) {
  const startColor = useSharedValue(colors[0]);
  const endColor = useSharedValue(colors[1]);
  const gradientColors = useDerivedValue(() => [
    startColor.value,
    endColor.value,
  ]);
  useEffect(() => {
    startColor.value = withTiming(colors[0]);
    endColor.value = withTiming(colors[1]);
  }, [colors, startColor, endColor]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <TouchableOpacity
      className={twMerge('items-center justify-center h-10', className)}
      onPress={onPress}
      disabled={disabled}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setWidth(width);
        setHeight(height);
      }}
    >
      <MaskedView
        style={{ position: 'absolute', inset: 0 }}
        maskElement={
          <View className="absolute items-center justify-center overflow-hidden rounded-full border border-white inset-0">
            <View
              className={twMerge(
                'absolute inset-0',
                disabled ? 'bg-white/10' : 'bg-white/100'
              )}
            />
            <UiText className="text-sm font-medium">{disabledLabel}</UiText>
          </View>
        }
      >
        <Canvas
          style={{
            position: 'absolute',
            inset: 0,
            width,
            height,
          }}
        >
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(width * 0.1, height)}
              end={vec(width * 0.9, 0)}
              colors={gradientColors}
            />
          </Rect>
        </Canvas>
      </MaskedView>
      {!disabled && label && (
        <UiText className="text-sm font-medium">{label}</UiText>
      )}
      {children}
    </TouchableOpacity>
  );
}
