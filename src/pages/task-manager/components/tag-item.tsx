import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

import { TaskColor } from '../types/task-color';

type Props = {
  name: string;
  color: TaskColor | null;
};

export default function TagItem({ name, color }: Props) {
  const handledName = name.length > 20 ? name.slice(0, 20) + '...' : name;

  return (
    <View
      className="self-center rounded-full px-2 py-1"
      style={{ backgroundColor: color || '#ffffff10' }}
    >
      <UiText className="text-xs">{'# ' + handledName}</UiText>
    </View>
  );
}
