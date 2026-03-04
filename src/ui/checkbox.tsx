import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { UiText } from './ui-text';

type CheckboxProps = {
  checked?: boolean | 'mix';
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function Checkbox({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      className={twMerge('flex-row items-center gap-x-2', className)}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onChange?.(!checked);
      }}
      disabled={disabled}
      {...props}
    >
      {label && <UiText>{label}</UiText>}
      <Pressable
        className={twMerge(
          'size-[18px] items-center overflow-hidden rounded-full border-2 border-gray bg-blue/30',
          checked && 'border-white bg-blue'
        )}
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Light);
          onChange?.(!checked);
        }}
        hitSlop={5}
      >
        {checked === true && (
          <Animated.View
            className="absolute items-center justify-center rounded-full inset-0"
            entering={ZoomIn.springify().duration(250)}
            exiting={ZoomOut.duration(250)}
          >
            <UiText className="text-2xs font-semibold">✓</UiText>
          </Animated.View>
        )}
      </Pressable>
    </Pressable>
  );
}
