import { usePurchases } from '@kirz/expo-toolkit';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import AlarmIcon from '@/svg/alarm.svg';
import { Btn } from '@/ui/button';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

import TodayTaskItem from '../../task-manager/components/today-task-item';

export default function MainPageTaskTracker() {
  const { newMainScreenActive } = useConfig();
  const selectedLang = useStorageValue('selectedLang');
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const lastSmartClean = useStorageValue('lastSmartClean');
  const smartCleanTimeLimit = Date.now() - 1000 * 60 * 60 * 24 * 5;
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

  const todaysUserTasks = userTasks
    .filter(
      (task) =>
        todayStart < new Date(task.endTime as Date) &&
        todayEnd > new Date(task.startTime as Date)
    )
    .slice(0, 2);

  function handleAddNewTasks() {
    if (!hasPremium && userTasks.length >= 3) {
      openModal('UnlockMoreTasksModal');
    } else {
      router.navigate('/task-manager/create-task');
    }
  }

  return (
    <TouchableOpacity
      onPress={() => router.navigate('/task-manager')}
      disabled={
        newMainScreenActive &&
        (!hasPremium || lastSmartClean < smartCleanTimeLimit)
      }
    >
      <View className="gap-y-3">
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
            {todaysUserTasks.length === 0 ||
            lastSmartClean < smartCleanTimeLimit ? (
              <View className="gap-y-1">
                <UiText className="text-lg font-semibold">
                  {langs[selectedLang].pages.main.advice}
                </UiText>
                <UiText className="text-sm mb-2">
                  {langs[selectedLang].pages.main.set_up_tasks}
                </UiText>
              </View>
            ) : (
              <View className="gap-y-3 mb-2">
                {todaysUserTasks.map((task) => (
                  <TodayTaskItem key={task.id + '_small'} task={task} />
                ))}
              </View>
            )}
            <Btn
              label={langs[selectedLang].buttons.add_task}
              handler={handleAddNewTasks}
            />
          </View>
        </View>
        <UiText className="text-center text-xs text-gray">
          {langs[selectedLang].pages.main.tap_to_open}
        </UiText>
      </View>

      {newMainScreenActive &&
        (!hasPremium || lastSmartClean < smartCleanTimeLimit) && (
          <BlurView
            className="absolute overflow-hidden rounded-3xl left-0 top-4 h-20 w-full"
            intensity={30}
            tint="dark"
          >
            <View className="flex-row items-center bg-[#F81D1D82] gap-x-5 px-3 h-full w-full">
              <AlarmIcon />
              <View className="gap-y-0.5">
                <UiText className="text-xl font-semibold">
                  {lastSmartClean === 0
                    ? langs[selectedLang].pages.main.no_cleaning
                    : langs[selectedLang].pages.main.need_cleaning}
                </UiText>
                <UiText className="text-lg text-gray">
                  {lastSmartClean === 0
                    ? langs[selectedLang].pages.main.clean_your_phone
                    : langs[selectedLang].pages.main.last_clean_a_while}
                </UiText>
              </View>
            </View>
          </BlurView>
        )}
    </TouchableOpacity>
  );
}
