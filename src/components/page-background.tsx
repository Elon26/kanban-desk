import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import LinesImage from '@/images/onBoarding/lines.png';
import PageBackgroundImage from '@/images/page-background.png';

type Props = {
  withLines?: boolean;
};

export function PageBackground({ withLines = false }: Props) {
  return (
    <View className="absolute h-screen w-screen">
      <LinearGradient
        colors={['#000000', '#000000', '#100C16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <Image
        source={PageBackgroundImage}
        className="size-64"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      {withLines && (
        <Image
          source={LinesImage}
          style={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            top: scaleY(60),
            right: scaleX(100),
          }}
        />
      )}
    </View>
  );
}
