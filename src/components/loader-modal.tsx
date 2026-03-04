import { BlurView } from 'expo-blur';
import { useWindowDimensions, View } from 'react-native';

import LoaderAnimation from '@/animations/loader.json';
import { LottieView } from '@/ui/lottie';

export function LoaderModal() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        width,
        height,
      }}
      className="items-center justify-center bg-background/10"
    >
      <BlurView className="absolute inset-0" intensity={20} tint="dark" />
      <LottieView autoPlay className="h-44 w-56" source={LoaderAnimation} />
    </View>
  );
}
