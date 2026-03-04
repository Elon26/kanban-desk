import * as DocumentPicker from 'expo-document-picker';
import { type RelativePathString, router, usePathname } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import AttachIcon from '@/svg/task-tracker/attach.svg';
import AttachedIcon from '@/svg/task-tracker/attached.svg';
import DeadlineIcon from '@/svg/task-tracker/deadline.svg';
import DescriptionIcon from '@/svg/task-tracker/description.svg';
import PriorityIcon from '@/svg/task-tracker/priority.svg';
import StartIcon from '@/svg/task-tracker/start.svg';
import StatusIcon from '@/svg/task-tracker/status.svg';
import TagIcon from '@/svg/task-tracker/tag.svg';
import TrashIcon from '@/svg/task-tracker/trash.svg';
import { UiText } from '@/ui/ui-text';

import PriorityItem from '../components/priority-item';
import TagItem from '../components/tag-item';
import TaskSettingTypeItem from '../components/task-setting-type-item';
import TaskStatusItem from '../components/task-status-item';
import type { Priority } from '../types/priority';
import type { Tag } from '../types/tag';
import {
  serializeTasksForUserDefaults,
  type TaskItem,
} from '../types/task-item';
import type { TaskStatus } from '../types/task-status';
import { Pressable } from '@/ui/pressable';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import { usePurchases } from '@kirz/expo-toolkit';
import { Btn } from '@/ui/button';
import { updateTasksNotifications } from '@/hooks/use-notifications';
import { useWidgetBridge } from '@/hooks/use-widget-bridge';
import langs from '@/i18n/langs.json';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

export default function EditTaskPage({ id }: { id: string | string[] }) {
  const selectedLang = useStorageValue('selectedLang');
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const pathname = usePathname();
  const { openModal, closeModal } = useModals();
  const { showPaywall } = usePaywall();
  const { setWidgetData } = useWidgetBridge();

  const userTags = useStorageValue('userTags');
  const taskStatuses = useStorageValue('taskStatuses');
  const userTasks = useStorageValue('userTasks');
  const setUserTasks = useSetStorage('userTasks');
  const isNotificationsActive = useStorageValue('isNotificationsActive');

  const [userTask, setUserTask] = useState<TaskItem | null>(
    userTasks.find((task) => task.id === id) || null
  );
  const [tagToShow, setTagToShow] = useState<Tag | null>(
    userTags.find((tag) => tag.id === userTask?.tagId) || null
  );
  const [statusToShow, setStatusToShow] = useState<TaskStatus | null>(
    taskStatuses.find((status) => status.id === userTask?.statusId) || null
  );
  const [priorityToShow, setPriorityToShow] = useState<Priority | null>(
    userTask?.priority || null
  );
  const [startTimeToShow, setStartTimeToShow] = useState<Date | null>(
    userTask?.startTime || null
  );
  const [endTimeToShow, setEndTimeToShow] = useState<Date | null>(
    userTask?.endTime || null
  );
  const [urisForShow, setUrisForShow] = useState<string[] | null>(
    userTask?.fileUris || null
  );
  const [taskName, setTaskName] = useState(userTask?.name || '');
  const [taskDescription, setTaskDescription] = useState(
    userTask?.description || ''
  );

  const handleDelete = async (taskId: string) => {
    let confirm: (value: unknown) => void = () => {};
    const confirmationPromise = new Promise<unknown>((resolve) => {
      confirm = resolve;
    });

    openModal('ConfirmationOfDeletionModal', {
      description:
        langs[selectedLang].modals.confirmation_of_deletion_modal
          .action_cannot_be_undone,
      resolve: confirm,
    });

    const action = await confirmationPromise;

    closeModal('ConfirmationOfDeletionModal');

    if (action === 'later') return;

    urisForShow?.forEach(async (uri) => {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    });
    const tasksToSet = userTasks.filter((task) => task.id !== taskId);
    setUserTasks(tasksToSet);
    if (isNotificationsActive)
      updateTasksNotifications(tasksToSet, selectedLang);
    router.back();
  };

  useEffect(() => {
    setUserTask(userTasks.find((task) => task.id === id) || null);
    setTagToShow(userTags.find((tag) => tag.id === userTask?.tagId) || null);
    setStatusToShow(
      taskStatuses.find((status) => status.id === userTask?.statusId) || null
    );
    setPriorityToShow(userTask?.priority || null);
    setStartTimeToShow(userTask?.startTime || null);
    setEndTimeToShow(userTask?.endTime || null);
    setTaskName(userTask?.name || '');
    setTaskDescription(userTask?.description || '');
  }, [pathname]);

  useEffect(() => {
    if (taskName) {
      const editedTasks = userTasks.map((task) => {
        if (task.id === id) {
          task.name = taskName;
          task.updatedAt = Date.now();
          return task;
        } else {
          return task;
        }
      });
      setUserTasks(editedTasks);
      if (isNotificationsActive)
        updateTasksNotifications(editedTasks, selectedLang);
    }
  }, [taskName]);

  useEffect(() => {
    const editedTasks = userTasks.map((task) => {
      if (task.id === id) {
        task.description = taskDescription;
        task.updatedAt = Date.now();
        return task;
      } else {
        return task;
      }
    });
    setUserTasks(editedTasks);
    if (isNotificationsActive)
      updateTasksNotifications(editedTasks, selectedLang);
  }, [taskDescription]);

  async function handleAddFile() {
    if (hasPremium) {
      pickAndSaveFile();
    } else {
      let confirm: (value: unknown) => void = () => {};
      const confirmationPromise = new Promise<unknown>((resolve) => {
        confirm = resolve;
      });

      openModal('UnlockFullUploadModal', {
        resolve: confirm,
      });

      const action = await confirmationPromise;

      closeModal('UnlockFullUploadModal');

      if (action === 'getPremium') {
        showPaywall();
        return;
      }
      if (action === 'continue') pickAndSaveFile();
    }
  }

  const isFileAlreadySaved = async (fileName: string): Promise<boolean> => {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory!
    );
    return files.includes(fileName);
  };

  const pickAndSaveFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];

      if (!hasPremium && file.size && file.size > 5 * 1000 * 1000) {
        Alert.alert(langs[selectedLang].alerts.file_big);
        return;
      }

      const sourceUri = file.uri;
      const fileName = file.name || sourceUri.split('/').pop();
      const destinationUri =
        (FileSystem.documentDirectory &&
          FileSystem.documentDirectory + fileName) ||
        'not-found';

      const alreadyExists = await isFileAlreadySaved(fileName || '');
      if (alreadyExists) {
        Alert.alert(langs[selectedLang].alerts.file_uploaded);
        return;
      }

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri,
      });

      setUrisForShow([...(userTask?.fileUris || []), destinationUri]);
      const editedTasks = userTasks.map((task) => {
        if (task.id === id) {
          task.fileUris = [...task.fileUris, destinationUri];
          task.updatedAt = Date.now();
          return task;
        } else {
          return task;
        }
      });
      setUserTasks(editedTasks);
      setWidgetData('CalendarWidget', {
        tasks: serializeTasksForUserDefaults(editedTasks),
      });
      if (isNotificationsActive)
        updateTasksNotifications(editedTasks, selectedLang);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openFile = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not working on the device');
      return;
    }

    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const removeFile = async (uri: string) => {
    let confirm: (value: unknown) => void = () => {};
    const confirmationPromise = new Promise<unknown>((resolve) => {
      confirm = resolve;
    });

    openModal('ConfirmationOfDeletionModal', {
      description:
        langs[selectedLang].modals.confirmation_of_deletion_modal
          .attached_files,
      resolve: confirm,
    });

    const action = await confirmationPromise;

    closeModal('ConfirmationOfDeletionModal');

    if (action === 'later') return;

    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      setUrisForShow((prev) => {
        if (prev) {
          const newUris = prev.filter((fileUri) => fileUri !== uri);
          prev = newUris;
        }
        return prev;
      });
      const editedTasks = userTasks.map((task) => {
        if (task.id === id) {
          const newUris = task.fileUris.filter((fileUri) => fileUri !== uri);
          task.fileUris = newUris;
          return task;
        } else {
          return task;
        }
      });
      setUserTasks(editedTasks);
      if (isNotificationsActive)
        updateTasksNotifications(editedTasks, selectedLang);
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.edit_task}
          rightButtonLabel={langs[selectedLang].page_names.delete}
          rightButtonHandler={() => userTask && handleDelete(userTask.id)}
          rightButtonColor="#F76363"
          customBack={'/task-manager' as RelativePathString}
        />
        <ScrollView className="mb-10 mt-2.5">
          <View className="gap-y-4 mt-2.5">
            <TextInput
              className="text-2xl font-bold color-white px-1"
              value={taskName}
              onChangeText={setTaskName}
              placeholder={
                langs[selectedLang].pages.task_manager.enter_task_name
              }
            />
            <View className="rounded-2xl bg-white/10 gap-y-3 p-3 mt-2">
              <TaskSettingTypeItem
                Icon={PriorityIcon}
                label={langs[selectedLang].pages.task_manager.priority}
                handler={() =>
                  router.navigate({
                    pathname: '/task-manager/select-priority',
                    params: { taskId: userTask?.id },
                  })
                }
              >
                {priorityToShow ? (
                  <PriorityItem priority={priorityToShow} />
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
              <TaskSettingTypeItem
                Icon={TagIcon}
                label={langs[selectedLang].pages.task_manager.task_tag}
                handler={() =>
                  router.navigate({
                    pathname: '/task-manager/select-tag',
                    params: { taskId: userTask?.id },
                  })
                }
              >
                {tagToShow ? (
                  <TagItem name={tagToShow.name} color={tagToShow.color} />
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
              <TaskSettingTypeItem
                Icon={StatusIcon}
                label={langs[selectedLang].pages.task_manager.status}
                handler={() =>
                  router.navigate({
                    pathname: '/task-manager/select-status',
                    params: { taskId: userTask?.id },
                  })
                }
              >
                {statusToShow ? (
                  <TaskStatusItem
                    label={statusToShow.name}
                    color={statusToShow.color}
                  />
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
              <TaskSettingTypeItem
                Icon={StartIcon}
                label={langs[selectedLang].pages.task_manager.date_start}
                handler={() =>
                  router.navigate({
                    pathname: '/task-manager/select-date-start',
                    params: { taskId: userTask?.id },
                  })
                }
              >
                {startTimeToShow ? (
                  <UiText className="text-sm">
                    {new Date(startTimeToShow).toLocaleDateString(
                      createLangStringForDate(selectedLang),
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </UiText>
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
              <TaskSettingTypeItem
                Icon={DeadlineIcon}
                label={langs[selectedLang].pages.task_manager.deadline}
                handler={() =>
                  router.navigate({
                    pathname: '/task-manager/select-deadline',
                    params: { taskId: userTask?.id },
                  })
                }
              >
                {endTimeToShow ? (
                  <UiText className="text-sm">
                    {new Date(endTimeToShow).toLocaleDateString(
                      createLangStringForDate(selectedLang),
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </UiText>
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
            </View>
            <View className="rounded-2xl bg-white/10 gap-y-2.5 p-3">
              <View className="flex-row gap-x-2">
                <DescriptionIcon />
                <UiText className="font-medium color-gray">
                  {langs[selectedLang].pages.task_manager.task_description}
                </UiText>
              </View>
              <TextInput
                className="rounded-xl bg-white/10 text-sm color-white p-2"
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder={
                  langs[selectedLang].pages.task_manager.add_description
                }
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View className="rounded-2xl bg-white/10 gap-y-2.5 p-3">
              <View className="flex-row gap-x-2">
                <AttachIcon />
                <UiText className="font-medium color-gray">
                  {langs[selectedLang].pages.task_manager.attach_files}
                </UiText>
              </View>
              {urisForShow && urisForShow.length > 0 && (
                <View className="gap-y-2.5">
                  {urisForShow.map((uri) => {
                    const arr = uri.split('/');
                    const fileName = arr[arr.length - 1];
                    const fileNameArr = fileName.split('.');
                    const extension = fileNameArr[fileNameArr.length - 1];
                    return imageExtensions.includes(extension) ? (
                      <TouchableOpacity key={uri} onPress={() => openFile(uri)}>
                        <Image
                          source={uri}
                          className="rounded-2xl h-80 w-full"
                        />
                        <Pressable
                          className="absolute rounded-full bg-[#171717] right-2.5 p-1 top-2.5"
                          onPress={() => removeFile(uri)}
                        >
                          <TrashIcon />
                        </Pressable>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={uri}
                        className="flex-row items-center justify-between rounded-2xl bg-white/10 gap-x-2 p-2"
                        onPress={() => openFile(uri)}
                      >
                        <View className="flex-1 flex-row items-center gap-x-2">
                          <AttachedIcon />
                          <UiText
                            numberOfLines={1}
                            className="text-xs font-medium"
                          >
                            {fileName}
                          </UiText>
                        </View>
                        <Pressable
                          className="items-end w-10"
                          onPress={() => removeFile(uri)}
                        >
                          <TrashIcon />
                        </Pressable>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <Btn
                label={langs[selectedLang].buttons.add_file}
                handler={handleAddFile}
              />
            </View>
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
