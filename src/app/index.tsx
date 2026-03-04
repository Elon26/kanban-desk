import { useAnalytics } from '@kirz/expo-toolkit';
import type { CommonActions, NavigationRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { AnimationLoader } from '@/components/animation-loader';
import { useSetStorage, useStorage } from '@/hooks/use-storage';
import { getLocale } from '@/utils/get-locale';

import { NotificationProvider } from '../hooks/use-notifications';

type ResetState = Parameters<(typeof CommonActions)['reset']>['0'];

type ResetExpected = Readonly<{
  key: string;
  index: number;
  routeNames: never[];
  history?: unknown[] | undefined;
  routes: NavigationRoute<never, never>[];
  type: string;
  stale: false;
}>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  const { logEvent } = useAnalytics();
  const navigation = useNavigation();
  const [isOnboardingFinished, setIsOnboardingFinished] = useStorage(
    'isOnboardingFinished'
  );
  const [isFirstLaunch, setIsFirstLaunch] = useStorage('isFirstLaunch');
  const setSelectedLang = useSetStorage('selectedLang');

  const initialNavigationState = useMemo<ResetState>(() => {
    if (isFirstLaunch) {
      logEvent('af_1st_launch');
      setIsFirstLaunch(false);
    }

    logEvent('af_app_launch');

    const languageCodeToSet = getLocale();
    setSelectedLang(languageCodeToSet);

    if (!isOnboardingFinished) {
      return { routes: [{ name: 'onboarding' }] };
    }

    return { routes: [{ name: 'main' }] };
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.reset(initialNavigationState as ResetExpected);
    }, [navigation, initialNavigationState])
  );

  return (
    <NotificationProvider>
      <AnimationLoader />
    </NotificationProvider>
  );
}
