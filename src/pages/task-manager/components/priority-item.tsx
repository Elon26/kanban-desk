import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

import { Priority } from '../types/priority';

type Props = {
  priority: Priority | null;
};

export default function PriorityItem({ priority }: Props) {
  const selectedLang = useStorageValue('selectedLang');

  let priorityText = langs[selectedLang].pages.task_manager.not_selected;
  let color = '#BFBFBF';

  if (priority === 'High') {
    color = '#F76363';
    priorityText = langs[selectedLang].pages.task_manager.high_priority;
  }
  if (priority === 'Medium') {
    color = '#F7BE63';
    priorityText = langs[selectedLang].pages.task_manager.medium_priority;
  }
  if (priority === 'Low') {
    color = '#8AF763';
    priorityText = langs[selectedLang].pages.task_manager.low_priority;
  }

  return (
    <View
      className="rounded-full border px-2 py-1"
      style={{ borderColor: color }}
    >
      <UiText className="text-xs" style={{ color: color }}>
        {priorityText}
      </UiText>
    </View>
  );
}
