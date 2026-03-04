import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import XDate from 'xdate';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import CalendarIcon from '@/svg/task-tracker/calendar.svg';
import ClockIcon from '@/svg/task-tracker/clock.svg';
import StartIcon from '@/svg/task-tracker/start.svg';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

import { createLocalConfig } from '../../../utils/create-local-config';

export default function SelectDateStartPage({
  taskId,
}: {
  taskId: string | string[];
}) {
  const selectedLang = useStorageValue('selectedLang');

  const newTask = useStorageValue('newTask');
  const setNewTask = useSetStorage('newTask');
  const userTasks = useStorageValue('userTasks');
  const userTask = userTasks.find((task) => task.id === taskId);
  const setUserTasks = useSetStorage('userTasks');

  const [selectedDate, setSelectedDate] = useState<DateData | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedFullDate, setSelectedFullDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const handleChangeTime = (
    e: DateTimePickerEvent,
    timeToSet: Date | undefined
  ) => {
    if (timeToSet) {
      setSelectedTime(timeToSet);
    }
  };

  function handleSaveTask() {
    if (!selectedFullDate) {
      setError(langs[selectedLang].pages.task_manager.select_date);
      return;
    }

    if (taskId) {
      if (
        userTask &&
        userTask.endTime &&
        new Date(userTask.endTime) < selectedFullDate
      ) {
        setError(langs[selectedLang].pages.task_manager.start_time);
        return;
      }

      const editedTasks = userTasks.map((task) => {
        if (task.id === taskId) {
          task.startTime = selectedFullDate || null;
          task.updatedAt = Date.now();
          return task;
        } else {
          return task;
        }
      });

      setUserTasks(editedTasks);
    } else {
      if (newTask.endTime && new Date(newTask.endTime) < selectedFullDate) {
        setError(langs[selectedLang].pages.task_manager.start_time);
        return;
      }

      setNewTask((prev) => {
        prev.startTime = selectedFullDate;
        return prev;
      });
    }
    router.back();
  }

  useEffect(() => {
    setError('');
    if (selectedDate && selectedTime) {
      const fullDate: Date = new Date(
        selectedDate.year,
        selectedDate.month - 1,
        selectedDate.day,
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setSelectedFullDate(fullDate);
    }
  }, [selectedDate, selectedTime]);

  if (selectedLang !== 'en') {
    LocaleConfig.locales[selectedLang] = createLocalConfig(selectedLang);
    LocaleConfig.defaultLocale = selectedLang;
  }

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.date_start}
          rightButtonLabel={langs[selectedLang].page_names.save}
          rightButtonHandler={handleSaveTask}
          rightButtonColor="#3D93F2"
        />
        <ScrollView className="mt-2.5">
          <View className="rounded-3xl bg-white/10 gap-y-3 px-3 mb-10 mt-2.5 py-4">
            {error && (
              <UiText className="text-center font-bold text-red">
                {error}
              </UiText>
            )}
            <View className="flex-row items-center self-center gap-x-2 mb-2.5">
              <StartIcon />
              <UiText className="text-sm font-medium color-gray">
                {selectedFullDate
                  ? selectedFullDate.toLocaleDateString(
                      createLangStringForDate(selectedLang),
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )
                  : langs[selectedLang].pages.task_manager.not_selected}
              </UiText>
            </View>
            <View className="rounded-3xl bg-white/10 p-4">
              <View className="flex-row gap-x-2 mb-2.5">
                <CalendarIcon />
                <UiText className="font-medium color-gray">
                  {langs[selectedLang].pages.task_manager.select_start_date}
                </UiText>
              </View>
              <Calendar
                style={{
                  marginTop: -10,
                  marginBottom: -10,
                  marginLeft: -20,
                  marginRight: -20,
                }}
                locale={selectedLang}
                firstDay={1}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: '#transparent',
                  textSectionTitleColor: '#787878',
                  selectedDayBackgroundColor: '#3D93F2',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#34C759',
                  dayTextColor: '#ffffff',
                  textDisabledColor: '#787878',
                }}
                onDayPress={(day: DateData) => {
                  setSelectedDate(day);
                }}
                markedDates={{
                  [selectedDate?.dateString || '']: {
                    selected: true,
                    disableTouchEvent: true,
                  },
                }}
                renderHeader={(date: XDate | undefined) => {
                  const month = date?.toString('MMMM');
                  const year = date?.toString('yyyy');

                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        padding: 10,
                      }}
                    >
                      <UiText style={{ fontSize: 18, fontWeight: 'medium' }}>
                        {month} {year}
                      </UiText>
                    </View>
                  );
                }}
              />
            </View>

            <View className="rounded-3xl bg-white/10 p-4">
              <View className="flex-row gap-x-2">
                <ClockIcon />
                <UiText className="font-medium color-gray">
                  {langs[selectedLang].pages.task_manager.set_start_time}
                </UiText>
              </View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleChangeTime}
              />
            </View>
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
