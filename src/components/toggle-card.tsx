import { Pressable, Switch, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  title: string;
  Icon?: React.FC;
  value: boolean;
  toggleValue: () => void;
};

export function ToggleCard({ title, Icon, value, toggleValue }: Props) {
  return (
    <Pressable
      className="flex-row items-center rounded-3xl bg-white/10 gap-x-2 p-3"
      onPress={toggleValue}
    >
      {Icon && (
        <View className="items-center justify-center rounded-full bg-[#A3C9FA] size-9">
          <Icon />
        </View>
      )}
      <View className="flex-1">
        <UiText className="font-medium">{title}</UiText>
      </View>
      <Switch
        value={value}
        trackColor={{ false: '#767577', true: '#3D93F2' }}
        onChange={toggleValue}
      />
    </Pressable>
  );
}
