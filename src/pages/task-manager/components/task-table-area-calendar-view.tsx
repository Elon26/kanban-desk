import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import CalendarDayItem from './calendar-day-item';

export default function TaskTableAreaCalendarView() {
  const selectedLang = useStorageValue('selectedLang');
  const userTasks = useStorageValue('userTasks');
  const startDate = new Date();
  const endDate = new Date(
    userTasks.length > 0
      ? userTasks.sort(
          (x, y) =>
            new Date(y.endTime || '').getTime() -
            new Date(x.endTime || '').getTime()
        )[0].endTime || 0
      : 0
  );

  const validStartDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const validEndDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const [dateArr, setDateArr] = useState<Date[]>([]);

  function createDateArr(startDate: Date, endDate: Date) {
    const arrToSet = [startDate];

    let currentTimeStamp = startDate.getTime();

    while (currentTimeStamp < endDate.getTime()) {
      currentTimeStamp += 1000 * 60 * 60 * 24;
      arrToSet.push(new Date(currentTimeStamp));
    }

    setDateArr(arrToSet);
  }

  useEffect(() => {
    createDateArr(validStartDate, validEndDate);
  }, []);

  return (
    <View className="flex-1 pb-4">
      {userTasks.length > 0 ? (
        <FlatList
          data={dateArr}
          keyExtractor={() => uuid()}
          renderItem={({ item, index }) => (
            <CalendarDayItem date={item} isFirst={index === 0} />
          )}
        />
      ) : (
        <UiText className="text-center text-2xl font-bold">
          {langs[selectedLang].pages.task_manager.no_tasks}
        </UiText>
      )}
    </View>
  );
}
