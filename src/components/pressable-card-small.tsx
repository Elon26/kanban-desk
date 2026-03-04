/* eslint-disable tailwindcss/no-custom-classname */
import { View } from 'react-native';

import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  title: string;
  Icon: React.FC;
  iconColor: string;
  handler: () => void;
};

export function PressableCardSmall({ title, Icon, iconColor, handler }: Props) {
  return (
    <Pressable
      className="flex-1 flex-row items-center rounded-3xl bg-white/10 gap-x-2 p-3"
      onPress={handler}
    >
      <View
        className="items-center justify-center rounded-full size-6"
        style={{ backgroundColor: iconColor }}
      >
        <Icon />
      </View>
      <View className="">
        <UiText className="font-medium">{title}</UiText>
      </View>
    </Pressable>
  );
}
