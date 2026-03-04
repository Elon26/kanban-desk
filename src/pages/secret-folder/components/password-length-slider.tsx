import { scaleY } from '@kirz/nativewind-scale';
import { Slider } from '@miblanchard/react-native-slider';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { colors } from '@/config/theme';
import { UiText } from '@/ui/ui-text';

export type PasswordGenerationSliderProps = {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
};

export function PasswordLengthSlider({
  value,
  onChange,
}: PasswordGenerationSliderProps) {
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (innerValue === value) {
      return;
    }
    impactAsync(ImpactFeedbackStyle.Light);
    onChange(innerValue);
  }, [innerValue, onChange, value]);

  return (
    <Slider
      value={innerValue}
      trackStyle={{
        height: scaleY(4),
        borderRadius: 30,
        backgroundColor: colors.gray.toString(),
      }}
      minimumTrackStyle={{
        backgroundColor: colors.blue.toString(),
      }}
      step={1}
      trackClickable
      maximumValue={32}
      onValueChange={(x) => {
        setInnerValue(x[0]);
      }}
      renderThumbComponent={() => (
        <View className="items-center justify-center rounded-full border-4 border-white/10 bg-white size-6">
          <UiText className="text-center text-xs text-blue">{value}</UiText>
        </View>
      )}
    />
  );
}
