import { FC, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';

import { UiText } from '@/ui/ui-text';

type Props = {
  Icon: FC;
  label: string;
  handler: () => void;
  children: ReactNode;
};

export default function TaskSettingTypeItem({
  Icon,
  label,
  handler,
  children,
}: Props) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-x-2 py-1"
      onPress={handler}
    >
      <Icon />
      <UiText className="text-sm font-medium text-gray w-20">{label}</UiText>
      {children}
    </TouchableOpacity>
  );
}
