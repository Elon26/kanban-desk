import { Pressable, Switch, View } from 'react-native';

import NotificationsIcon from '@/svg/system-info/notifications.svg';
import { UiText } from '@/ui/ui-text';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import {
  cancelAllNotifications,
  updateTasksNotifications,
} from '@/hooks/use-notifications';
import langs from '@/i18n/langs.json';

export function NotificationPressableCard() {
  const selectedLang = useStorageValue('selectedLang');

  const [isNotificationsActive, setIsNotificationsActive] = useStorage(
    'isNotificationsActive'
  );
  const userTasks = useStorageValue('userTasks');

  function toggleSetNotifications() {
    if (isNotificationsActive) {
      setIsNotificationsActive(false);
      cancelAllNotifications();
    } else {
      setIsNotificationsActive(true);
      updateTasksNotifications(userTasks, selectedLang);
    }
  }

  return (
    <Pressable
      className="flex-row items-center rounded-3xl bg-white/10 gap-x-2 p-3"
      onPress={toggleSetNotifications}
    >
      <View className="items-center justify-center rounded-full bg-[#A3C9FA] size-9">
        <NotificationsIcon />
      </View>
      <View className="flex-1">
        <UiText className="font-medium">
          {langs[selectedLang].pages.settings.notifications}
        </UiText>
      </View>
      <Switch
        value={isNotificationsActive}
        trackColor={{ false: '#767577', true: '#3D93F2' }}
        onChange={toggleSetNotifications}
      />
    </Pressable>
  );
}
