import { scaleX } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import BG from '@/images/speed-test/bg.png';
import { ChevronRight } from '@/ui/chevron';
import { UiText } from '@/ui/ui-text';

export function SpeedTestWidget() {
  return (
    <TouchableOpacity onPress={() => router.navigate('/speed-test')}>
      <View
        style={{ height: scaleX(125) }}
        className="flex-row justify-between overflow-hidden rounded-2.5xl p-4 px-3"
      >
        <Image
          source={BG}
          className="absolute z-10"
          style={{ width: scaleX(335), height: scaleX(140) }}
          contentFit="contain"
        />
        <BlurView intensity={30} className="absolute inset-0" tint="dark" />

        <View className="gap-1">
          <UiText className="font-medium">Speed Test</UiText>
          <UiText
            style={{ fontSize: scaleX(11) }}
            className="font-light opacity-50"
          >
            Check your internet speed
          </UiText>
        </View>
        <View className="items-center justify-center size-6">
          <ChevronRight />
        </View>
      </View>
      <View className="absolute rounded-2.5xl border border-white/10 inset-0" />
    </TouchableOpacity>
  );
}
