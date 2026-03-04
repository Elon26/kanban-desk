import { usePurchases } from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import { Btn } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Pressable } from '@/ui/pressable';

import PriorityItem from '../components/priority-item';
import { priorities, Priority } from '../types/priority';

export default function SelectPriorityPage({
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
  const userTasks = useStorageValue('userTasks');
  const setUserTasks = useSetStorage('userTasks');
  const userTask = userTasks.find((task) => task.id === taskId);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    taskId && userTask ? userTask.priority : newTask.priority
  );
  const { showPaywall } = usePaywall();

  function selectPriority(priority: Priority) {
    if (selectedPriority === priority) {
      setSelectedPriority(null);
    } else {
      setSelectedPriority(priority);
    }
  }

  function handleSaveTask() {
    if (taskId) {
      setUserTasks((prev) => {
        const editedTasks = prev.map((task) => {
          if (task.id === taskId) {
            task.priority = selectedPriority;
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
        prev.priority = selectedPriority;
        return prev;
      });
    }
    router.back();
  }

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.select_priority}
          rightButtonLabel={langs[selectedLang].page_names.save}
          rightButtonHandler={handleSaveTask}
          rightButtonColor="#3D93F2"
        />
        <View className="rounded-3xl bg-white/10 gap-y-3 p-3 mt-5">
          <View className="self-center">
            <PriorityItem priority={selectedPriority} />
          </View>
          <View className="rounded-3xl bg-white/10 px-4 py-1">
            {hasPremium ? (
              priorities.map((priority) => (
                <View key={priority}>
                  <Pressable
                    className="flex-row justify-between py-4"
                    onPress={() => selectPriority(priority)}
                  >
                    <PriorityItem priority={priority} />
                    <Checkbox
                      checked={selectedPriority === priority}
                      onChange={() => selectPriority(priority)}
                    />
                  </Pressable>
                  {priority !== 'Low' && (
                    <View className="bg-white/10 height-[1px]" />
                  )}
                </View>
              ))
            ) : (
              <Btn
                label={langs[selectedLang].buttons.get_premium_for_prioritizing}
                handler={() => showPaywall()}
              />
            )}
          </View>
        </View>
      </Container>
    </Page>
  );
}
