import { scaleX } from '@kirz/nativewind-scale';
import { usePinInputState } from 'expo-with-pincode';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

type CharacterProps = {
  value?: number | null;
};

export function Char({ value }: CharacterProps) {
  const HIDE_DELAY = 300;
  const { error, success } = usePinInputState();
  let tintColor = colors.text.toString();
  if (success) {
    tintColor = colors.blue.toString();
  }
  if (error) {
    tintColor = colors.red.toString();
  }
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (value !== null) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [value]);

  return (
    <View
      className={twMerge(
        'rounded-lg border border-black/15 bg-white/10 h-12 w-10',
        success ? 'border-blue' : '',
        error ? 'border-red' : ''
      )}
    >
      {value !== null && (
        <>
          {!hidden && (
            <Animated.View
              className="absolute items-center justify-center inset-0"
              entering={ZoomIn.springify()}
              exiting={ZoomOut.delay(HIDE_DELAY)}
            >
              <UiText
                className={twMerge(
                  'text-3.5xl font-semibold',
                  success ? 'text-blue' : '',
                  error ? 'text-red' : ''
                )}
              >
                {value}
              </UiText>
            </Animated.View>
          )}
          <Animated.View
            className="absolute items-center justify-center inset-0"
            entering={ZoomIn.springify().delay(HIDE_DELAY)}
            exiting={ZoomOut}
          >
            <SfSymbol
              name="staroflife.fill"
              size={scaleX(20)}
              tintColor={tintColor}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
}
