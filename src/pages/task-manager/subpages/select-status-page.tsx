import { usePurchases } from '@kirz/expo-toolkit';
import { useNavigationState } from '@react-navigation/native';
import { RelativePathString, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import StatusColorIcon from '@/svg/task-tracker/tag-color.svg';
import StatusNameIcon from '@/svg/task-tracker/tag-name.svg';
import TrashIcon from '@/svg/task-tracker/trash.svg';
import { Btn } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import TaskStatusItem from '../components/task-status-item';
import { TaskColor, taskColors } from '../types/task-color';
import { TaskStatus } from '../types/task-status';

export default function SelectStatusPage({
  taskId,
}: {
  taskId: string | string[];
}) {
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const selectedLang = useStorageValue('selectedLang');

  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { openModal, closeModal } = useModals();
  const newTask = useStorageValue('newTask');
  const setNewTask = useSetStorage('newTask');
  const taskStatuses = useStorageValue('taskStatuses');
  const setTaskStatuses = useSetStorage('taskStatuses');
  const userTasks = useStorageValue('userTasks');
  const setUserTasks = useSetStorage('userTasks');
  const userTask = userTasks.find((task) => task.id === taskId);
  const [selectedTaskStatus, setSelectedTaskStatus] =
    useState<TaskStatus | null>(
      taskStatuses.find(
        (taskStatus) =>
          taskStatus.id === (taskId ? userTask?.statusId : newTask.statusId)
      ) || null
    );
  const [isCreateStatusMode, setIsCreateStatusMode] = useState(false);
  const [selectedStatusName, setSelectedStatusName] = useState('');
  const [selectedStatusColor, setSelectedStatusColor] =
    useState<TaskColor | null>(null);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const { showPaywall } = usePaywall();

  function selectTaskStatus(taskStatus: TaskStatus) {
    if (selectedTaskStatus?.id === taskStatus.id) {
      setSelectedTaskStatus(null);
    } else {
      setSelectedTaskStatus(taskStatus);
    }
  }

  function selectStatusColor(statusColor: TaskColor) {
    if (selectedStatusColor === statusColor) {
      setSelectedStatusColor(null);
    } else {
      setSelectedStatusColor(statusColor);
    }
  }

  function handleSaveStatus() {
    if (!selectedStatusName) {
      setError(langs[selectedLang].pages.task_manager.enter_name);
      return;
    }
    if (!selectedStatusColor) {
      setError(langs[selectedLang].pages.task_manager.choose_color);
      return;
    }

    const newId = uuid();

    const newStatus: TaskStatus = {
      id: newId,
      name: selectedStatusName,
      color: selectedStatusColor,
      isCustom: true,
    };
    setTaskStatuses((prev) => {
      prev.push(newStatus);
      return prev;
    });
    setSelectedStatusName('');
    setSelectedStatusColor(null);
    setIsCreateStatusMode(false);
  }

  function handleSaveTask() {
    if (taskId) {
      if (selectedTaskStatus) {
        setUserTasks((prev) => {
          const editedTasks = prev.map((task) => {
            if (task.id === taskId) {
              task.statusId = selectedTaskStatus?.id || null;
              task.updatedAt = Date.now();
              return task;
            } else {
              return task;
            }
          });
          return editedTasks;
        });
      } else {
        setSaveError(langs[selectedLang].pages.task_manager.select_status);
      }
    } else {
      setNewTask((prev) => {
        prev.statusId = selectedTaskStatus?.id || null;
        return prev;
      });
    }
    router.back();
  }

  const handleDelete = async (taskStatusId: string) => {
    let confirm: (value: unknown) => void = () => {};
    const confirmationPromise = new Promise<unknown>((resolve) => {
      confirm = resolve;
    });

    openModal('ConfirmationOfDeletionModal', {
      description:
        langs[selectedLang].modals.confirmation_of_deletion_modal
          .action_irreversible,
      resolve: confirm,
    });

    const action = await confirmationPromise;

    closeModal('ConfirmationOfDeletionModal');

    if (action === 'later') return;

    const tagsToSet = taskStatuses.filter(
      (taskStatus) => taskStatus.id !== taskStatusId
    );
    setTaskStatuses(tagsToSet);
  };

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [selectedStatusName, selectedStatusColor]);

  useEffect(() => {
    if (saveError) {
      setSaveError('');
    }
  }, [selectedTaskStatus]);

  const previousRouteName = useNavigationState((state) => {
    const routes = state.routes;
    if (routes.length > 1) {
      return routes[routes.length - 2].name;
    }
    return null;
  });

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.select_status}
          rightButtonLabel={langs[selectedLang].page_names.save}
          rightButtonHandler={
            isCreateStatusMode ? handleSaveStatus : handleSaveTask
          }
          rightButtonColor="#3D93F2"
          customBack={
            previousRouteName === 'task-manager/index'
              ? ('/task-manager' as RelativePathString)
              : undefined
          }
        />
        {isCreateStatusMode ? (
          <ScrollView className="mt-5">
            <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mb-10 mt-2.5">
              {error && (
                <UiText className="text-center font-bold text-red">
                  {error}
                </UiText>
              )}
              <View className="self-center">
                <TaskStatusItem
                  label={
                    selectedStatusName ||
                    langs[selectedLang].pages.task_manager.preview
                  }
                  color={selectedStatusColor || '#ffffff'}
                />
              </View>
              <View className="rounded-3xl bg-white/10 gap-y-2.5 p-3">
                <View className="flex-row gap-x-2">
                  <StatusNameIcon />
                  <UiText className="font-medium color-gray">
                    {langs[selectedLang].pages.task_manager.name_of_status}
                  </UiText>
                </View>
                <TextInput
                  className="rounded-3xl bg-white/10 text-sm color-white p-2"
                  value={selectedStatusName}
                  onChangeText={setSelectedStatusName}
                  placeholder={
                    langs[selectedLang].pages.task_manager.enter_group_name
                  }
                />
              </View>
              <View className="rounded-3xl bg-white/10 p-3">
                <View className="flex-row gap-x-2 mb-2.5">
                  <StatusColorIcon />
                  <UiText className="font-medium color-gray">
                    {langs[selectedLang].pages.task_manager.group_color}
                  </UiText>
                </View>
                {taskColors.map((taskColor, index) => (
                  <View key={taskColor}>
                    <Pressable
                      className="items-end rounded-3xl p-2"
                      onPress={() => selectStatusColor(taskColor)}
                      style={{ backgroundColor: taskColor }}
                    >
                      <Checkbox
                        checked={selectedStatusColor === taskColor}
                        onChange={() => selectStatusColor(taskColor)}
                      />
                    </Pressable>
                    {index !== taskColors.length - 1 && (
                      <View className="bg-white/10 height-[1px] my-2.5" />
                    )}
                  </View>
                ))}
              </View>
              {error && (
                <UiText className="text-center font-bold text-red">
                  {error}
                </UiText>
              )}
            </View>
          </ScrollView>
        ) : (
          <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mt-5">
            <View className="self-center">
              <TaskStatusItem
                label={
                  selectedTaskStatus
                    ? selectedTaskStatus.name
                    : langs[selectedLang].pages.task_manager.not_selected
                }
                color={
                  selectedTaskStatus ? selectedTaskStatus.color : '#BFBFBF'
                }
              />
            </View>
            {saveError && (
              <UiText className="text-center font-bold text-red">
                {saveError}
              </UiText>
            )}
            <View className="rounded-3xl bg-white/10 p-4">
              <DraggableFlatList
                data={taskStatuses}
                onDragEnd={({ data }) => setTaskStatuses(data)}
                keyExtractor={(taskStatus) => taskStatus.id}
                renderItem={({ item, drag }) => (
                  <TouchableOpacity
                    onLongPress={drag}
                    className="flex-row justify-between"
                    onPress={() => selectTaskStatus(item)}
                  >
                    <View className="flex-row items-center gap-x-3">
                      {item.isCustom && (
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                          <TrashIcon />
                        </TouchableOpacity>
                      )}
                      <TaskStatusItem label={item.name} color={item.color} />
                    </View>
                    <Checkbox
                      checked={item.id === selectedTaskStatus?.id}
                      onChange={() => selectTaskStatus(item)}
                    />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View className="h-[1px] bg-white/10 my-4" />
                )}
              />
              {hasPremium ? (
                taskStatuses.length >= 7 ? (
                  <UiText className="text-center text-sm text-gray/50 mt-6">
                    {langs[selectedLang].pages.task_manager.status_group_limit}
                  </UiText>
                ) : (
                  <Btn
                    size="big"
                    classes="mt-6"
                    label={langs[selectedLang].buttons.create_group}
                    handler={() => setIsCreateStatusMode(true)}
                  />
                )
              ) : (
                <Btn
                  size="big"
                  classes="mt-6"
                  label={langs[selectedLang].buttons.get_premium_to_add_more}
                  handler={() => showPaywall()}
                />
              )}
            </View>
          </View>
        )}
      </Container>
    </Page>
  );
}
