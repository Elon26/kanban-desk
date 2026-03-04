import { scaleX, scaleY } from '@kirz/nativewind-scale';
import type { ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

const DOT_ACTIVE_COLOR = '#B793FF';
const DOT_NO_ACTIVE_COLOR = '#FFFFFF';
const DOT_ACTIVE_WIDTH = scaleX(40);
const DOT_INACTIVE_WIDTH = scaleX(10);
const DOT_HEIGHT = scaleY(10);

type AnimatedDotProps = {
  index: number;
  animatedValue: SharedValue<number>;
};

export function AnimatedDot({ index, animatedValue }: AnimatedDotProps) {
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [index - 0.5, index],
      [DOT_NO_ACTIVE_COLOR, DOT_ACTIVE_COLOR]
    );

    return {
      backgroundColor,

      width: interpolate(
        animatedValue.value,
        [index - 1, index, index + 1],
        [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
        'clamp'
      ),
      height: DOT_HEIGHT,
      borderRadius: 15,
      marginHorizontal: 5,
    };
  }, [animatedValue]);

  return <Animated.View style={[animatedStyle]} className={twMerge('mx-1')} />;
}
