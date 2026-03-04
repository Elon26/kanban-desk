import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Pressable } from './pressable';
import { UiText } from './ui-text';

type BottomFloatProps = {
  title: string;
  subtitle: string;
  handler: () => void;
};

export function BottomFloat({ title, subtitle, handler }: BottomFloatProps) {
  return (
    <Animated.View
      className="absolute rounded-3xl bg-white/30 gap-4 left-edge right-edge p-2.5"
      style={{
        bottom: scaleY(50),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: scaleX(32),
      }}
      entering={ZoomIn.duration(200)}
    >
      <View className="absolute overflow-hidden rounded-3xl inset-0">
        <BlurView tint="light" intensity={25} className="flex-1" />
      </View>
      <Pressable className="flex-row items-center gap-2.5" onPress={handler}>
        <View className="flex-1 gap-1">
          <UiText className="text-center font-medium w-full" numberOfLines={1}>
            {title}
          </UiText>
          <UiText
            className="text-center text-sm opacity-50 w-full"
            numberOfLines={1}
          >
            {subtitle}
          </UiText>
        </View>
      </Pressable>
    </Animated.View>
  );
}
