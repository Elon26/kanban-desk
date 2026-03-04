import { Env } from '@kirz/expo-env';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { ReactNode } from 'react';
import { Platform } from 'react-native';

import LangCode from '@/i18n/lang-code';
import langs from '@/i18n/langs.json';
import { TaskItem } from '@/pages/task-manager/types/task-item';

type NotificationObject = {
  text: string;
  date: Date;
};

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function schedulePushNotification(
  title: string,
  body: string,
  date: Date,
  data?: Record<string, string>
) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data || {},
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: date,
    },
  });
  return notificationId;
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function generateText(type: 'enter' | 'tasks', selectedLang: LangCode) {
  const random = Math.round(Math.random() * 100);
  if (random < 33) {
    return type === 'enter'
      ? langs[selectedLang].notifications.couple_tasks
      : langs[selectedLang].notifications.planned_task;
  }
  if (random >= 33 && random < 66) {
    return type === 'enter'
      ? langs[selectedLang].notifications.things_quiet
      : langs[selectedLang].notifications.heads_up;
  }
  if (random >= 66) {
    return type === 'enter'
      ? langs[selectedLang].notifications.everything
      : langs[selectedLang].notifications.reminder;
  }
  return langs[selectedLang].notifications.couple_tasks;
}

export function handleApplicationEnterReminderNotification(
  selectedLang: LangCode
) {
  const notificationText = generateText('enter', selectedLang);

  const today = new Date();
  const afterTomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 2,
    12
  );

  schedulePushNotification(Env.APP_NAME, notificationText, afterTomorrow);
}

export function handleTasksReminderNotifications(
  startDate: Date,
  endDate: Date,
  selectedLang: LangCode
) {
  const notificationObjects: NotificationObject[] = [
    { date: startDate, text: generateText('tasks', selectedLang) },
  ];

  let counter = 0;
  let currentTimeStamp = startDate.getTime();

  while (currentTimeStamp < endDate.getTime() && counter < 9) {
    counter++;
    currentTimeStamp += 1000 * 60 * 60 * 24;
    notificationObjects.push({
      date: new Date(currentTimeStamp),
      text: generateText('tasks', selectedLang),
    });
  }

  notificationObjects.forEach((notification) => {
    schedulePushNotification(
      Env.APP_NAME,
      notification.text,
      notification.date
    );
  });
}

export function updateTasksNotifications(
  userTasks: TaskItem[],
  selectedLang: LangCode
) {
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
    startDate.getDate(),
    13
  );
  const validEndDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    13
  );

  cancelAllNotifications();
  handleApplicationEnterReminderNotification(selectedLang);
  handleTasksReminderNotifications(validStartDate, validEndDate, selectedLang);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
