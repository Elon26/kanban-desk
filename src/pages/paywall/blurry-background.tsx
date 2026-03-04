import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import { Ellipse, G, Svg } from 'react-native-svg';

export function BlurryBackground() {
  return (
    <View className="absolute bg-background">
      <Svg
        width="304"
        height="173"
        viewBox="0 0 304 173"
        fill="none"
        style={{
          position: 'absolute',
          top: -72,
          right: -135,
        }}
      >
        <G opacity="0.2">
          <Ellipse cx="152" cy="86.5" rx="152" ry="86.5" fill="#0084FF" />
        </G>
      </Svg>
      <Svg
        width="229"
        height="340"
        viewBox="0 0 229 340"
        fill="none"
        style={{
          position: 'absolute',
          top: 190,
          right: -32,
        }}
      >
        <G opacity="0.3">
          <Ellipse opacity="0.2" cx="114.5" cy="170" rx="114.5" ry="170" fill="#FF9D00" />
        </G>
      </Svg>
      <Svg
        width="375"
        height="603"
        viewBox="0 0 375 603"
        fill="none"
        style={{
          position: 'absolute',
          left: -145,
          bottom: -43,
        }}
      >
        <G opacity="0.2">
          <Ellipse cx="177.5" cy="320" rx="114.5" ry="170" fill="#51FF00" />
        </G>
      </Svg>

      <BlurView
        intensity={150}
        tint="light"
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
      />
    </View>
  );
}
