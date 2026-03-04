import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

import TaskCardCalendarView from './task-card-calendar-view';

type Props = {
  date: Date;
  isFirst: boolean;
};

export default function CalendarDayItem({ date, isFirst }: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const userTasks = useStorageValue('userTasks');

  const weekDays = [
    langs[selectedLang].weekdays.sunday,
    langs[selectedLang].weekdays.monday,
    langs[selectedLang].weekdays.tuesday,
    langs[selectedLang].weekdays.wednesday,
    langs[selectedLang].weekdays.thursday,
    langs[selectedLang].weekdays.friday,
    langs[selectedLang].weekdays.saturday,
  ];

  const endDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59
  );
  const todaysUserTasks = userTasks.filter(
    (task) =>
      date < new Date(task.endTime as Date) &&
      endDay > new Date(task.startTime as Date)
  );

  return todaysUserTasks.length > 0 ? (
    <View
      className="flex-row gap-x-4"
      style={{
        marginTop: isFirst ? 0 : 16,
      }}
    >
      <View
        className="gap-y-1"
        style={{
          marginTop: isFirst ? 0 : -24,
        }}
      >
        <View className="items-center justify-center rounded-full bg-white/10 size-9">
          <UiText className="text-lg font-medium">{date.getDate()}</UiText>
        </View>
        <UiText className="text-center text-sm text-gray">
          {weekDays[date.getDay()]}
        </UiText>
      </View>
      <View className="flex-1 gap-y-4">
        {todaysUserTasks.map((task) => (
          <TaskCardCalendarView key={task.id} task={task} />
        ))}
      </View>
    </View>
  ) : (
    <View />
  );
}
