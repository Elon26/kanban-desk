import { Image } from 'expo-image';
import { useWindowDimensions, View } from 'react-native';

import PaywallImage from '@/images/empty.png';

export function CartArea({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();
  return (
    <View>
      <View className="pt-5 w-full">{children}</View>
      <Image
        style={{ height: height / 1.5, zIndex: -100, marginTop: -height / 3.5 }}
        className="rounded-2xl"
        source={PaywallImage}
        contentFit="cover"
      />
    </View>
  );
}
