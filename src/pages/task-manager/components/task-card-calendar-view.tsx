import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import AttachedIcon from '@/svg/task-tracker/attached.svg';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

import { TaskItem } from '../types/task-item';
import PriorityItem from './priority-item';
import TagItem from './tag-item';

type Props = {
  task: TaskItem;
};

export default function TaskCardCalendarView({ task }: Props) {
  const selectedLang = useStorageValue('selectedLang');

  const tags = useStorageValue('userTags');
  const currentTag = tags.find((tag) => tag.id === task.tagId);
  const taskStatuses = useStorageValue('taskStatuses');
  const currentTaskStatus = taskStatuses.find(
    (status) => status.id === task.statusId
  );
  let attachmentsRow = '';
  task.fileUris.forEach((uri, index) => {
    const rowToSet = uri.split('/').pop();
    if (index !== 0) attachmentsRow += ', ';
    attachmentsRow += rowToSet;
  });
  const handledAttachmentsRow =
    attachmentsRow.length > 35
      ? attachmentsRow.slice(0, 35) + '...'
      : attachmentsRow;

  return (
    <TouchableOpacity
      className="rounded-lg gap-y-2 p-3"
      style={{
        backgroundColor: currentTaskStatus?.color + '30' || '#ffffff30',
      }}
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
        style={{ color: currentTaskStatus?.color }}
      >
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
      {attachmentsRow && (
        <View className="flex-row items-center self-start rounded-lg bg-white/10 gap-x-2 p-1">
          <AttachedIcon />
          <UiText className="text-xs font-medium text-gray">
            {handledAttachmentsRow}
          </UiText>
        </View>
      )}
    </TouchableOpacity>
  );
}
