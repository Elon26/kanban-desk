import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import { TaskItem } from '@/pages/task-manager/types/task-item';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

type Props = {
  task: TaskItem;
};

export default function TodayTaskItem({ task }: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const taskStatuses = useStorageValue('taskStatuses');
  const currentStatus = taskStatuses.find(
    (status) => status.id === task.statusId
  );

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between"
      onPress={() =>
        router.navigate({
          pathname: '/task-manager/edit-task/[id]',
          params: {
            id: task.id,
          },
        })
      }
    >
      <View className="flex-row gap-x-2.5">
        <View
          className="rounded-full mt-1.5 size-3"
          style={{ backgroundColor: currentStatus?.color }}
        />
        <View className="flex-1 gap-y-2">
          <UiText className="text-lg font-semibold">{task.name}</UiText>
          {task.description && (
            <UiText className="text-xs text-gray" numberOfLines={2}>
              {task.description}
            </UiText>
          )}
          <UiText className="text-xs color-[#63CBF7]">
            {task.endTime &&
              new Date(task.endTime).toLocaleDateString(
                createLangStringForDate(selectedLang),
                {
                  month: 'long',
                  day: 'numeric',
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
          </UiText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
