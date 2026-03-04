import { Image, ImageProps, View } from 'react-native';

import BackgroundImage from '@/images/paywall-screen-bg-image.png';

export function StarArea({ children }: { children: React.ReactNode }) {
  return (
    <View className="pt-[80px] w-full">
      <Image
        className="absolute h-[440px] inset-0 w-full"
        resizeMode="cover"
        source={BackgroundImage as ImageProps}
      />
      <View>{children}</View>
    </View>
  );
}
