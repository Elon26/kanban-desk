import { colors } from '@/config/theme';
import { UiText } from '@/ui/ui-text';
import { hexa } from '@/utils/color';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  type StyleProp,
  TouchableOpacity,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, { type AnimatedProps, ZoomIn } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export type ModalFrameProps = {
  href?: Href;
  title?: string;
  slot1?: ReactNode;
  slot2?: ReactNode;
  color?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
} & AnimatedProps<ViewProps>;

export function ModalFrame({
  href,
  title,
  slot1,
  slot2,
  color = colors.primary.toString(),
  className,
  style,
  ...props
}: ModalFrameProps) {
  const Container = AnimatedTouchableOpacity;

  return (
    <Container
      className={twMerge(
        'overflow-hidden rounded-2.5xl bg-white gap-1 p-1',
        className
      )}
      onPress={href ? () => router.navigate(href) : undefined}
      entering={ZoomIn}
      style={style}
      activeOpacity={href ? 0.2 : 1}
      {...props}
    >
      <View className="absolute inset-0">
        <LinearGradient
          colors={[color, hexa(color, 0)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.9 }}
          style={{ flex: 1 }}
        />
      </View>
      <UiText className="text-center font-medium uppercase text-white">
        {title}
      </UiText>
      <View className="rounded-2xl border border-black/10 bg-white gap-2.5 p-1">
        <View className="rounded-0.5xl border border-dashed border-black/15 gap-6 px-4 py-2.5">
          {slot1}
        </View>
        {slot2}
      </View>
    </Container>
  );
}
