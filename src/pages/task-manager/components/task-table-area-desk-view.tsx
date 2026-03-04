import { scaleX } from '@kirz/nativewind-scale';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useStorage, useStorageValue } from '@/hooks/use-storage';
import { useWidgetBridge } from '@/hooks/use-widget-bridge';
import { draggableCollectionDictionaryEn } from '@/i18n/DraggableDesk/en';
import { draggableCollectionDictionaryJa } from '@/i18n/DraggableDesk/ja';
import { draggableCollectionDictionaryKo } from '@/i18n/DraggableDesk/ko';
import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import {
  DraggableCollectionView,
  type OnItemIndexPathChangePayload,
  type Task,
} from '@/modules/draggable-collection';
import { getLocale } from '@/utils/get-locale';
import { uuid } from '@/utils/uuid';

import { serializeTasksForUserDefaults } from '../types/task-item';
import type { TaskStatus } from '../types/task-status';

export default function TaskTableAreaDeskView() {
  const selectedLang = getLocale();
  const { setWidgetData } = useWidgetBridge();

  const [userTasks, setUserTasks] = useStorage('userTasks');

  const taskStatuses = useStorageValue('taskStatuses');
  const userTags = useStorageValue('userTags');

  function handleTaskStatusGroups(taskStatuses: TaskStatus[]) {
    const handledTaskStatusGroups = taskStatuses.map((taskStatus) => {
      const filteredTasks = userTasks.filter(
        (userTask) => userTask.statusId === taskStatus.id
      );

      const handledTasks = filteredTasks.map((task) => {
        let taskPriority = undefined;
        if (task.priority === 'High') {
          taskPriority = {
            id: uuid(),
            name: langs[selectedLang].pages.priorities.high,
            color: '#F76363',
          };
        }
        if (task.priority === 'Medium') {
          taskPriority = {
            id: uuid(),
            name: langs[selectedLang].pages.priorities.medium,
            color: '#F7BE63',
          };
        }
        if (task.priority === 'Low') {
          taskPriority = {
            id: uuid(),
            name: langs[selectedLang].pages.priorities.low,
            color: '#8AF763',
          };
        }

        const taskTag = userTags.find((tag) => tag.id === task.tagId);
        const attachmentsToSet = task.fileUris.map((uri) => {
          const arr = uri.split('/');
          const fileName = arr[arr.length - 1];
          return {
            id: uuid(),
            name: fileName,
            url: uri,
          };
        });

        const taskToSet: Task = {
          id: task.id,
          name: task.name,
          priority: taskPriority,
          tag: taskTag,
          startTime: task.startTime ? task.startTime.toString() : '',
          endTime: task.endTime ? task.endTime.toString() : '',
          description: task.description,
          updatedAt: JSON.parse(JSON.stringify(new Date(task.updatedAt))),
          attachments: attachmentsToSet,
        };

        return taskToSet;
      });

      return {
        status: taskStatus,
        tasks: handledTasks,
      };
    });

    return handledTaskStatusGroups;
  }

  const [taskStatusGroups, setTaskStatusGroups] = useState(
    handleTaskStatusGroups(taskStatuses)
  );

  function handleMoveTask(data: OnItemIndexPathChangePayload) {
    const updatedTasks = userTasks.map((task) => {
      if (task.id === data.taskId) {
        task.statusId = data.destinationCategoryId;
      }
      return task;
    });
    setUserTasks(updatedTasks);
    setWidgetData('CalendarWidget', {
      tasks: serializeTasksForUserDefaults(updatedTasks),
    });
  }

  useFocusEffect(
    useCallback(() => {
      setTaskStatusGroups(handleTaskStatusGroups(taskStatuses));
    }, [userTasks, taskStatuses])
  );

  let dict = draggableCollectionDictionaryEn;
  if (selectedLang === LangCode.ja) dict = draggableCollectionDictionaryJa;
  if (selectedLang === LangCode.ko) dict = draggableCollectionDictionaryKo;

  return (
    <DraggableCollectionView
      style={stylesheet.container}
      data={taskStatusGroups}
      onItemIndexPathChange={(event) => handleMoveTask(event.nativeEvent)}
      onItemTap={(event) =>
        router.navigate({
          pathname: '/task-manager/edit-task/[id]',
          params: {
            id: event.nativeEvent.id,
          },
        })
      }
      onAddNewGroupTapped={() => router.navigate('/task-manager/select-status')}
      dictionary={dict}
    />
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -scaleX(16),
  },
});
