import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

import { TaskItem } from '../types/task-item';
import PriorityItem from './priority-item';
import TagItem from './tag-item';

type Props = {
  task: TaskItem;
};

export default function TaskCard({ task }: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const tags = useStorageValue('userTags');
  const currentTag = tags.find((tag) => tag.id === task.tagId);

  return (
    <TouchableOpacity
      className="rounded-lg bg-white/10 gap-y-2 p-3"
      onPress={() =>
        router.navigate({
          pathname: '/task-manager/edit-task/[id]',
          params: {
            id: task.id,
          },
        })
      }
    >
      {task.priority && (
        <View className="items-start">
          <PriorityItem priority={task.priority} />
        </View>
      )}
      <View className="flex-row gap-x-2">
        <UiText className="flex-1 text-lg font-semibold" numberOfLines={1}>
          {task.name}
        </UiText>
        {currentTag && (
          <TagItem name={currentTag.name} color={currentTag.color} />
        )}
      </View>
      {task.description && (
        <UiText numberOfLines={2} className="text-xs color-gray">
          {task.description}
        </UiText>
      )}
      <UiText
        className="text-xs font-medium"
        style={{
          color:
            new Date() <= new Date(task.endTime as Date)
              ? '#8AF763'
              : '#F76363',
        }}
      >
        {langs[selectedLang].pages.task_manager.deadline}:{' '}
        {new Date(task.endTime as Date).toLocaleDateString(
          createLangStringForDate(selectedLang),
          {
            month: 'long',
            day: 'numeric',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
          }
        )}
      </UiText>
      <UiText className="text-xs font-medium color-[#63CBF7]">
        {langs[selectedLang].pages.task_manager.updated}:{' '}
        {new Date(task.updatedAt).toLocaleDateString(
          createLangStringForDate(selectedLang),
          {
            month: 'long',
            day: 'numeric',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
          }
        )}
      </UiText>
    </TouchableOpacity>
  );
}
