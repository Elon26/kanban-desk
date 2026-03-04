import { scaleX } from '@kirz/nativewind-scale';
import {
  ExpoWithPincodeType,
  PinpadButton,
  useLocalAuthentication,
} from 'expo-with-pincode';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

type PincodeButtonProps = {
  value: ExpoWithPincodeType.PinpadValue;
  disabled?: boolean;
  isNotNumber?: boolean;
};

export function PincodeButton({
  value,
  disabled = false,
  isNotNumber = true,
}: PincodeButtonProps) {
  useLocalAuthentication();
  const scale = useSharedValue(1);
  const handlePressIn = () => {
    scale.value = withSpring(0.6);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={twMerge(
        'rounded-3xl size-18',
        isNotNumber ? 'bg-transperent' : 'bg-white/10',
        disabled ? 'pointer-events-none opacity-0' : ''
      )}
      style={animatedStyle}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <PinpadButton
        value={value}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        {value === 'backspace' ? (
          <SfSymbol
            name="delete.left.fill"
            size={scaleX(36)}
            tintColor={colors.white.toString()}
          />
        ) : value === 'faceid' ? (
          <SfSymbol
            name="faceid"
            size={scaleX(36)}
            tintColor={colors.white.toString()}
          />
        ) : (
          <UiText className="text-3.5xl font-semibold">{value}</UiText>
        )}
      </PinpadButton>
    </Animated.View>
  );
}
