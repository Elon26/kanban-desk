import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { ScrollView, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

import { TaskStatus } from '../types/task-status';
import TaskCard from './task-card';

type Props = {
  taskStatus: TaskStatus;
};

export default function TaskStatusArea({ taskStatus }: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const allUserTasks = useStorageValue('userTasks');
  const currentStatusTasks = allUserTasks.filter(
    (task) => task.statusId === taskStatus.id
  );

  return (
    <View
      className="rounded-2xl gap-y-5 p-3"
      style={{
        backgroundColor: taskStatus.color + '35',
        width: scaleX(280),
        minHeight: scaleY(168),
      }}
    >
      <View className="flex-row items-center justify-between gap-x-2">
        <View className="flex-row items-center gap-x-2">
          <View
            className="rounded-full size-3"
            style={{
              backgroundColor: taskStatus.color,
            }}
          />
          <UiText className="text-lg font-semibold">{taskStatus.name}</UiText>
        </View>
        <UiText className="text-xs text-gray">
          {currentStatusTasks.length}{' '}
          {currentStatusTasks.length === 1
            ? langs[selectedLang].pages.task_manager.task
            : langs[selectedLang].pages.task_manager.tasks}
        </UiText>
      </View>
      {currentStatusTasks.length > 0 && (
        <ScrollView>
          <View className="gap-y-2">
            {currentStatusTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
