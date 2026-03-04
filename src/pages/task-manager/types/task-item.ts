import { getStorageAtom } from '@/hooks/use-storage';
import type { Priority } from './priority';
import { getDefaultStore } from 'jotai';

export type TaskItem = {
  id: string;
  name: string;
  priority: Priority | null;
  tagId: string | null;
  statusId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  description: string;
  updatedAt: number;
  fileUris: string[];
};

export type SerializedTaskItem = {
  id: string;
  name: string;
  priority: string;
  tagId: string;
  statusId: string;
  startTime: string;
  endTime: string;
  description: string;
  updatedAt: string;
  statusColor: string;
};

export const serializeTasksForUserDefaults = (tasks: TaskItem[]): SerializedTaskItem[] => {
  const statusesAtom = getStorageAtom('taskStatuses');
  const store = getDefaultStore();
  const statuses = store.get(statusesAtom);

  const statusColors = statuses.reduce(
    (acc, status) => {
      acc[status.id] = status.color;
      return acc;
    },
    {} as Record<string, string>
  );

  const serializedTasks = tasks.map((task) => ({
    id: task.id ?? '',
    name: task.name ?? '',
    priority: task.priority ?? '',
    tagId: task.tagId ?? '',
    statusId: task.statusId ?? '',
    startTime: task.startTime ? new Date(task.startTime).toISOString() : '',
    endTime: task.endTime ? new Date(task.endTime).toISOString() : '',
    description: task.description ?? '',
    updatedAt: task.updatedAt ? new Date(task.updatedAt).toISOString() : '',
    statusColor: (task.statusId && statusColors[task.statusId]) ?? '#dddddd',
  }));

  return serializedTasks;
};
