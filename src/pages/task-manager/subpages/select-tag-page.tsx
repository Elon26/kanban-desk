import { usePurchases } from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';

import { Container } from '@/components/container';
import { ModalStackParams } from '@/components/modals';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import TagColorIcon from '@/svg/task-tracker/tag-color.svg';
import TagNameIcon from '@/svg/task-tracker/tag-name.svg';
import TrashIcon from '@/svg/task-tracker/trash.svg';
import { Btn } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import TagItem from '../components/tag-item';
import { Tag } from '../types/tag';
import { TaskColor, taskColors } from '../types/task-color';

export default function SelectTagPage({
  taskId,
}: {
  taskId: string | string[];
}) {
  const selectedLang = useStorageValue('selectedLang');

  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const newTask = useStorageValue('newTask');
  const setNewTask = useSetStorage('newTask');
  const userTags = useStorageValue('userTags');
  const setUserTags = useSetStorage('userTags');
  const userTasks = useStorageValue('userTasks');
  const setUserTasks = useSetStorage('userTasks');
  const userTask = userTasks.find((task) => task.id === taskId);
  const currentTag = userTags.find((tag) => tag.id === userTask?.tagId);
  const [selectedTagName, setSelectedTagName] = useState(
    currentTag?.name || ''
  );
  const [selectedTagColor, setSelectedTagColor] = useState<TaskColor | null>(
    currentTag?.color || null
  );
  const [error, setError] = useState('');
  const { showPaywall } = usePaywall();
  const { openModal, closeModal } = useModal<ModalStackParams>();

  const [selectedTagId, setSelectedTagId] = useState<string | null>(
    taskId && userTask ? userTask.tagId : newTask.tagId
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isCreateTagMode, setIsCreateTagMode] = useState(false);

  useEffect(() => {
    const tagToSelect = userTags.find((tag) => tag.id === selectedTagId);
    setSelectedTag(tagToSelect || null);
  }, [selectedTagId]);

  function selectTagId(tagId: string) {
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
    } else {
      setSelectedTagId(tagId);
    }
  }

  function selectTagColor(tagColor: TaskColor) {
    if (selectedTagColor === tagColor) {
      setSelectedTagColor(null);
    } else {
      setSelectedTagColor(tagColor);
    }
  }

  function handleSaveTag() {
    if (!selectedTagName) {
      setError(langs[selectedLang].pages.task_manager.enter_tag_name);
      return;
    }
    if (!selectedTagColor) {
      setError(langs[selectedLang].pages.task_manager.choose_color);
      return;
    }

    const newId = uuid();

    const newTag: Tag = {
      id: newId,
      name: selectedTagName,
      color: selectedTagColor,
    };
    setUserTags((prev) => {
      prev.push(newTag);
      return prev;
    });
    setSelectedTagName('');
    setSelectedTagColor(null);
    setIsCreateTagMode(false);
  }

  function handleSaveTask() {
    if (taskId) {
      setUserTasks((prev) => {
        const editedTasks = prev.map((task) => {
          if (task.id === taskId) {
            task.tagId = selectedTagId;
            task.updatedAt = Date.now();
            return task;
          } else {
            return task;
          }
        });
        return editedTasks;
      });
    } else {
      setNewTask((prev) => {
        prev.tagId = selectedTagId;
        return prev;
      });
    }
    router.back();
  }

  const handleDelete = async (tagId: string) => {
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

    const tagsToSet = userTags.filter((userTag) => userTag.id !== tagId);
    setUserTags(tagsToSet);
  };

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [selectedTagName, selectedTagColor]);

  useEffect(() => {
    if (userTags.length === 0) setIsCreateTagMode(true);
  }, [userTags]);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.select_tag}
          rightButtonLabel={langs[selectedLang].page_names.save}
          rightButtonHandler={isCreateTagMode ? handleSaveTag : handleSaveTask}
          rightButtonColor="#3D93F2"
        />
        {hasPremium ? (
          <ScrollView className="mt-2.5">
            {isCreateTagMode ? (
              <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mb-10 mt-2.5">
                {error && (
                  <UiText className="text-center font-bold text-red">
                    {error}
                  </UiText>
                )}
                <TagItem
                  name={
                    selectedTagName ||
                    langs[selectedLang].pages.task_manager.preview
                  }
                  color={selectedTagColor}
                />
                <View className="rounded-3xl bg-white/10 gap-y-2.5 p-3">
                  <View className="flex-row gap-x-2">
                    <TagNameIcon />
                    <UiText className="font-medium color-gray">
                      {langs[selectedLang].pages.task_manager.tag_name}
                    </UiText>
                  </View>
                  <TextInput
                    className="rounded-3xl bg-white/10 text-sm color-white p-2"
                    value={selectedTagName}
                    onChangeText={setSelectedTagName}
                    placeholder={
                      langs[selectedLang].pages.task_manager.enter_tag_name
                    }
                  />
                </View>
                <View className="rounded-3xl bg-white/10 p-3">
                  <View className="flex-row gap-x-2 mb-2.5">
                    <TagColorIcon />
                    <UiText className="font-medium color-gray">
                      {langs[selectedLang].pages.task_manager.tag_color}
                    </UiText>
                  </View>
                  {taskColors.map((tagColor, index) => (
                    <View key={tagColor}>
                      <Pressable
                        className="items-end rounded-3xl p-2"
                        onPress={() => selectTagColor(tagColor)}
                        style={{ backgroundColor: tagColor }}
                      >
                        <Checkbox
                          checked={selectedTagColor === tagColor}
                          onChange={() => selectTagColor(tagColor)}
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
            ) : (
              <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mt-2.5">
                <TagItem
                  name={
                    selectedTag
                      ? selectedTag.name
                      : langs[selectedLang].pages.task_manager.not_selected
                  }
                  color={selectedTag ? selectedTag.color : null}
                />
                <View className="rounded-3xl bg-white/10 px-4 py-1">
                  {userTags.map((userTag) => (
                    <View key={userTag.id}>
                      <Pressable
                        className="flex-row justify-between"
                        onPress={() => selectTagId(userTag.id)}
                      >
                        <View className="flex-row gap-x-3 py-3">
                          <TouchableOpacity
                            onPress={() => handleDelete(userTag.id)}
                          >
                            <TrashIcon />
                          </TouchableOpacity>
                          <TagItem name={userTag.name} color={userTag.color} />
                        </View>
                        <Checkbox
                          checked={userTag.id === selectedTag?.id}
                          onChange={() => selectTagId(userTag.id)}
                        />
                      </Pressable>
                      <View className="bg-white/10 height-[1px]" />
                    </View>
                  ))}
                  <Btn
                    classes="my-2"
                    label={langs[selectedLang].buttons.create_tag}
                    handler={() => setIsCreateTagMode(true)}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mt-5">
            <View className="self-center rounded-3xl bg-white/10 p-2">
              <UiText>
                # {langs[selectedLang].pages.task_manager.not_selected}
              </UiText>
            </View>
            <View className="rounded-3xl bg-white/10 px-4 py-3">
              <Btn
                label={langs[selectedLang].buttons.get_premium_for_tag_creation}
                handler={() => showPaywall()}
              />
            </View>
          </View>
        )}
      </Container>
    </Page>
  );
}
