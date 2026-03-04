import { useAnalytics, usePurchases } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PressableCard } from '@/components/pressable-card';
import { PressableCardSmall } from '@/components/pressable-card-small';
import { useConfig } from '@/hooks/use-config';
import {
  registerForPushNotificationsAsync,
  updateTasksNotifications,
} from '@/hooks/use-notifications';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import SpeedIcon from '@/svg/round-graph.svg';
import SettingsIcon from '@/svg/settings-alt.svg';
import ShieldIcon from '@/svg/shield.svg';
import { PulseBtn } from '@/ui/pulse-button';

import CleanersArea from './components/cleaners-area';
import CleanersAreaWithOnlyContacts from './components/cleaners-area-with-only-contacts';
import CleanersAreaWithOnlyPhotos from './components/cleaners-area-with-only-photos';
import CleanersAreaWithoutData from './components/cleaners-area-without-data';
import InfoArea from './components/info-area';
import MainHeader from './components/main-header';
import MainPageTaskTracker from './components/main-page-task-tracker';
import MainSlider from './components/main-slider';

export default function MainScreen() {
  const { newMainScreenActive } = useConfig();
  const selectedLang = useStorageValue('selectedLang');
  const isPhotosPermissionAsked = useStorageValue('isPhotosPermissionAsked');
  const isContactsPermissionAsked = useStorageValue(
    'isContactsPermissionAsked'
  );
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;
  const lastSmartClean = useStorageValue('lastSmartClean');
  const smartCleanTimeLimit = Date.now() - 1000 * 60 * 60 * 24 * 5;
  const isButtonInSmartCleaner =
    !hasPremium || lastSmartClean < smartCleanTimeLimit;

  const insets = useSafeAreaInsets();
  const { logEvent } = useAnalytics();
  const isReadyToShowNotification = useStorageValue(
    'isReadyToShowNotification'
  );
  const isNotificationsActive = useStorageValue('isNotificationsActive');
  const userTasks = useStorageValue('userTasks');

  useEffect(() => {
    logEvent('af_mainscreen_show');

    if (isReadyToShowNotification) {
      registerForPushNotificationsAsync();
      if (isNotificationsActive) {
        updateTasksNotifications(userTasks, selectedLang);
      }
    }
  }, [isReadyToShowNotification]);

  return (
    <Page>
      <PageBackground />
      <View className="flex-1 gap-y-3">
        <View
          className="rounded-3xl bg-secondary px-5 pb-3"
          style={{ paddingTop: insets.top + scaleY(4) }}
        >
          <MainHeader hasPremium={hasPremium || false} />
          <MainPageTaskTracker />
        </View>
        <ScrollView>
          <View className="gap-y-3 px-4 pb-5">
            {newMainScreenActive && <MainSlider />}
            {isPhotosPermissionAsked && isContactsPermissionAsked && (
              <CleanersArea
                hasPremium={hasPremium || false}
                hasButton={!newMainScreenActive || isButtonInSmartCleaner}
                hasNewButton={newMainScreenActive}
              />
            )}
            {!isPhotosPermissionAsked && !isContactsPermissionAsked && (
              <CleanersAreaWithoutData
                hasPremium={hasPremium || false}
                hasButton={!newMainScreenActive || isButtonInSmartCleaner}
                hasNewButton={newMainScreenActive}
              />
            )}
            {isPhotosPermissionAsked && !isContactsPermissionAsked && (
              <CleanersAreaWithOnlyPhotos
                hasPremium={hasPremium || false}
                hasButton={!newMainScreenActive || isButtonInSmartCleaner}
                hasNewButton={newMainScreenActive}
              />
            )}
            {!isPhotosPermissionAsked && isContactsPermissionAsked && (
              <CleanersAreaWithOnlyContacts
                hasPremium={hasPremium || false}
                hasButton={!newMainScreenActive || isButtonInSmartCleaner}
                hasNewButton={newMainScreenActive}
              />
            )}
            {newMainScreenActive && <InfoArea />}
            <PressableCard
              title={langs[selectedLang].page_names.secret_folder}
              subtitle={langs[selectedLang].page_names.private_files}
              Icon={ShieldIcon}
              handler={() => router.navigate('/secret-folder')}
            />
            <View className="flex-row gap-x-3">
              <PressableCardSmall
                Icon={SpeedIcon}
                iconColor="#A3C9FA"
                title={langs[selectedLang].page_names.speed_test}
                handler={() => {
                  router.navigate('/speed-test');
                }}
              />
              <PressableCardSmall
                Icon={SettingsIcon}
                iconColor="#CDF5E7"
                title={langs[selectedLang].page_names.system_info}
                handler={() => {
                  router.navigate('/system-info');
                }}
              />
            </View>
          </View>
        </ScrollView>
        {newMainScreenActive && !isButtonInSmartCleaner && (
          <View
            className="px-edge"
            style={{ marginBottom: insets.bottom + scaleY(8) }}
          >
            <PulseBtn
              label={langs[selectedLang].buttons.start_cleaning}
              handler={() => router.navigate('/smart-cleaner')}
              color="#83E86447"
            />
          </View>
        )}
      </View>
    </Page>
  );
}
