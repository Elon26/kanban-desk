import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { UiText } from '@/ui/ui-text';

type Props = {
  checked?: boolean | 'mix';
  onChange?: (checked: boolean) => void;
};

export function PaywallCheckbox({ checked, onChange }: Props) {
  return (
    <Pressable
      className="size-[24px] items-center justify-center rounded-full bg-white/10"
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onChange?.(!checked);
      }}
    >
      <View
        className={twMerge(
          'size-[18px] items-center overflow-hidden rounded-full border border-white/30 bg-white/20',
          checked && 'border-green bg-green'
        )}
      >
        {checked === true && (
          <Animated.View
            className="absolute items-center justify-center rounded-full inset-0"
            entering={ZoomIn.springify().duration(250)}
            exiting={ZoomOut.duration(250)}
          >
            <UiText className="text-2xs font-semibold color-black">✓</UiText>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
}
