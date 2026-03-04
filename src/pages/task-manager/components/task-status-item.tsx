import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  label: string;
  color: string;
};

export default function TaskStatusItem({ label, color }: Props) {
  const handledLabel = label.length > 20 ? label.slice(0, 20) + '...' : label;

  return (
    <View
      className="rounded-3xl p-1.5"
      style={{
        backgroundColor: color + '35',
      }}
    >
      <View className="flex-row items-center gap-x-2">
        <View
          className="rounded-full size-3"
          style={{
            backgroundColor: color,
          }}
        />
        <UiText className="text-sm">{handledLabel}</UiText>
      </View>
    </View>
  );
}
