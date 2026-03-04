import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useModals } from '@/hooks/use-modals';
import {
  useSetStorage,
  useStorage,
  useStorageValue,
} from '@/hooks/use-storage';
import AttachIcon from '@/svg/task-tracker/attach.svg';
import AttachedIcon from '@/svg/task-tracker/attached.svg';
import DeadlineIcon from '@/svg/task-tracker/deadline.svg';
import DescriptionIcon from '@/svg/task-tracker/description.svg';
import PriorityIcon from '@/svg/task-tracker/priority.svg';
import StartIcon from '@/svg/task-tracker/start.svg';
import StatusIcon from '@/svg/task-tracker/status.svg';
import TagIcon from '@/svg/task-tracker/tag.svg';
import TrashIcon from '@/svg/task-tracker/trash.svg';
import { Btn } from '@/ui/button';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import langs from '@/i18n/langs.json';
import PriorityItem from '../components/priority-item';
import TagItem from '../components/tag-item';
import TaskSettingTypeItem from '../components/task-setting-type-item';
import TaskStatusItem from '../components/task-status-item';
import { defaultTaskItem } from '../constants/default-task-item';
import { usePurchases } from '@kirz/expo-toolkit';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import { updateTasksNotifications } from '@/hooks/use-notifications';
import { useWidgetBridge } from '@/hooks/use-widget-bridge';
import { serializeTasksForUserDefaults } from '../types/task-item';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'JPG',
  'JPEG',
  'PNG',
  'GIF',
  'WEBP',
  'SVG',
];

export default function CreateTaskPage() {
  const selectedLang = useStorageValue('selectedLang');
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { openModal, closeModal } = useModals();
  const { showPaywall } = usePaywall();
  const { setWidgetData } = useWidgetBridge();

  const newTask = useStorageValue('newTask');
  const setNewTask = useSetStorage('newTask');
  const userTags = useStorageValue('userTags');
  const taskStatuses = useStorageValue('taskStatuses');
  const [userTasks, setUserTasks] = useStorage('userTasks');
  const isNotificationsActive = useStorageValue('isNotificationsActive');
  const [currentPriority, setCurrentPriority] = useState(newTask.priority);
  const [tagToShow, setTagToShow] = useState(
    userTags.find((tag) => tag.id === newTask.tagId)
  );
  const [statusToShow, setStatusToShow] = useState(
    taskStatuses.find((status) => status.id === newTask.statusId)
  );
  const [startTimeToShow, setStartTimeToShow] = useState(newTask.startTime);
  const [endTimeToShow, setEndTimeToShow] = useState(newTask.endTime);
  const [taskName, setTaskName] = useState(newTask.name);
  const [taskDescription, setTaskDescription] = useState(newTask.description);
  const [urisForShow, setUrisForShow] = useState<string[]>(newTask.fileUris);
  const [error, setError] = useState('');

  function deleteTask() {
    newTask.fileUris.forEach(
      async (uri) => await FileSystem.deleteAsync(uri, { idempotent: true })
    );
    setNewTask({ ...defaultTaskItem });
    router.back();
  }

  function createTask() {
    if (!newTask.name) {
      setError(langs[selectedLang].pages.task_manager.enter_task_name);
      return;
    }

    if (!newTask.statusId) {
      setError(langs[selectedLang].pages.task_manager.set_status);
      return;
    }

    if (!newTask.startTime) {
      setError(langs[selectedLang].pages.task_manager.set_start);
      return;
    }

    if (!newTask.endTime) {
      setError(langs[selectedLang].pages.task_manager.set_deadline);
      return;
    }

    const taskToSet = { ...newTask };
    taskToSet.id = uuid();
    taskToSet.updatedAt = Date.now();

    const updatedTasks = [...userTasks, taskToSet];

    setUserTasks((prev) => updatedTasks);
    setWidgetData('CalendarWidget', {
      tasks: serializeTasksForUserDefaults(updatedTasks),
    });

    if (isNotificationsActive)
      updateTasksNotifications(updatedTasks, selectedLang);
    setNewTask({ ...defaultTaskItem });

    router.back();
  }

  useEffect(() => {
    setNewTask((prev) => {
      prev.name = taskName;
      return prev;
    });
  }, [taskName]);

  useEffect(() => {
    setNewTask((prev) => {
      prev.description = taskDescription;
      return prev;
    });
  }, [taskDescription]);

  useEffect(() => {
    setError('');
  }, [taskName, newTask.statusId, newTask.startTime, newTask.endTime]);

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

      setUrisForShow([...newTask.fileUris, destinationUri]);
      setNewTask((prev) => {
        const newUris = [...prev.fileUris, destinationUri];
        prev.fileUris = newUris;
        return prev;
      });
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
        const newUris = prev.filter((fileUri) => fileUri !== uri);
        prev = newUris;
        return prev;
      });
      setNewTask((prev) => {
        const newUris = prev.fileUris.filter((fileUri) => fileUri !== uri);
        prev.fileUris = newUris;
        return prev;
      });
    } catch (error) {
      console.error('error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCurrentPriority(newTask.priority);
      setTagToShow(userTags.find((tag) => tag.id === newTask.tagId));
      setStatusToShow(
        taskStatuses.find((status) => status.id === newTask.statusId)
      );
      setStartTimeToShow(newTask.startTime);
      setEndTimeToShow(newTask.endTime);
    }, [])
  );

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.new_task}
          rightButtonLabel={langs[selectedLang].page_names.delete}
          rightButtonHandler={deleteTask}
          rightButtonColor="#F76363"
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
                handler={() => router.navigate('/task-manager/select-priority')}
              >
                {currentPriority ? (
                  <PriorityItem priority={currentPriority} />
                ) : (
                  <UiText className="text-sm text-gray/50">
                    {langs[selectedLang].pages.task_manager.not_added}
                  </UiText>
                )}
              </TaskSettingTypeItem>
              <TaskSettingTypeItem
                Icon={TagIcon}
                label={langs[selectedLang].pages.task_manager.task_tag}
                handler={() => router.navigate('/task-manager/select-tag')}
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
                handler={() => router.navigate('/task-manager/select-status')}
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
                  router.navigate('/task-manager/select-date-start')
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
                handler={() => router.navigate('/task-manager/select-deadline')}
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
                            className="text-xs font-medium"
                            numberOfLines={1}
                          >
                            {fileName.length > 15
                              ? fileName.slice(0, 15) + '...'
                              : fileName}
                          </UiText>
                        </View>
                        <Pressable
                          onPress={() => removeFile(uri)}
                          className="items-end w-10"
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
            {error && (
              <UiText className="text-center font-bold text-red">
                {error}
              </UiText>
            )}
            <Btn
              size="big"
              label={langs[selectedLang].buttons.create_task}
              handler={createTask}
            />
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
