import { usePurchases } from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { Btn } from '@/ui/button';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

export default function ResumeArea() {
  const selectedLang = useStorageValue('selectedLang');

  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { openModal } = useModals();

  const userTasks = useStorageValue('userTasks');
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  const todaysUserTasks = userTasks.filter(
    (task) =>
      todayStart < new Date(task.endTime as Date) &&
      todayEnd > new Date(task.startTime as Date)
  );

  function handleAddNewTasks() {
    if (!hasPremium && userTasks.length >= 3) {
      openModal('UnlockMoreTasksModal');
    } else {
      router.navigate('/task-manager/create-task');
    }
  }

  return (
    <View className="flex-row items-center gap-x-3">
      <View>
        <UiText className="text-center text-6xl font-bold">
          {today.getDate()}
        </UiText>
        <UiText className="text-center text-xs -mt-2">
          {today.toLocaleString(createLangStringForDate(selectedLang), {
            month: 'long',
            year: 'numeric',
          })}
        </UiText>
      </View>
      <View className="flex-1 gap-y-1">
        {todaysUserTasks.length === 0 ? (
          <View className="gap-y-1">
            <UiText className="text-lg font-semibold">
              {langs[selectedLang].pages.task_manager.advice}
            </UiText>
            <UiText className="text-sm mb-2">
              {langs[selectedLang].pages.task_manager.set_up_task}
            </UiText>
          </View>
        ) : (
          <View className="gap-y-1">
            <UiText className="text-lg font-semibold">
              {langs[selectedLang].pages.task_manager.heads_up}
            </UiText>
            <UiText className="text-sm mb-2">
              {langs[selectedLang].pages.task_manager.assignments}
            </UiText>
          </View>
        )}
        <Btn
          label={langs[selectedLang].buttons.add_task}
          handler={handleAddNewTasks}
        />
      </View>
    </View>
  );
}
