import 'react-native-url-polyfill/auto';
import '../global.css';
import '../i18n/i18n';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Env } from '@kirz/expo-env';
import { createApp } from '@kirz/expo-toolkit';
import { ApphudModule } from '@kirz/expo-toolkit/apphud';
import { AppsFlyerModule } from '@kirz/expo-toolkit/appsflyer';
import { FacebookModule } from '@kirz/expo-toolkit/facebook';
import { FirebaseModule } from '@kirz/expo-toolkit/firebase';
import { IdfaModule } from '@kirz/expo-toolkit/idfa';
import { IdfvModule } from '@kirz/expo-toolkit/idfv';
import { LocalizationModule } from '@kirz/expo-toolkit/localization';
import { PNLightModule } from '@kirz/expo-toolkit/pnlight';
import { SentryModule } from '@kirz/expo-toolkit/sentry';
import { SmartLookModule } from '@kirz/expo-toolkit/smartlook';
import { UserIdentityModule } from '@kirz/expo-toolkit/user-identity';
import { NativewindWrapper } from '@kirz/nativewind-scale';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import { setPincodeConfig } from 'expo-with-pincode';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ModalProvider } from 'react-native-modalfy';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import langs from '@/i18n/langs.json';

import tailwindConfig from '../tailwind.config';
import { modalsStack } from './components/modals';
import { storage } from './hooks/use-storage';
import { AuthScreen, SetPinScreen } from './pages/pincode';
import { getLocale } from './utils/get-locale';

const selectedLang = getLocale();

setPincodeConfig({
  AuthScreen,
  SetPinScreen,
  requireSetPincode: false,
  onSuccessfulAuth: () => notificationAsync(NotificationFeedbackType.Success),
  onFailedAuth: () => notificationAsync(NotificationFeedbackType.Error),
  messages: {
    create: langs[selectedLang].root_messages.create,
    confirm: langs[selectedLang].root_messages.confirm,
    set: langs[selectedLang].root_messages.set,
    nomatch: langs[selectedLang].root_messages.nomatch,
    check: langs[selectedLang].root_messages.check,
    correct: langs[selectedLang].root_messages.correct,
    incorrect: langs[selectedLang].root_messages.incorrect,
    reset: langs[selectedLang].root_messages.reset,
    isreset: langs[selectedLang].root_messages.isreset,
  },
  animationDuration: 500,
  submitTimeout: 1000,
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default createApp({
  env: Env,
  storage: storage,
  providers: ({ withProps }) => [
    GestureHandlerRootView,
    withProps(KeyboardProvider, {}),
    withProps(NativewindWrapper, { config: tailwindConfig }),
    withProps(ModalProvider, { stack: modalsStack }),
    withProps(BottomSheetModalProvider, {}),
  ],
  modules: [
    new SentryModule(),
    new SmartLookModule(),
    new IdfaModule(),
    new IdfvModule(),
    new LocalizationModule(),
    new UserIdentityModule(),
    new ApphudModule(),
    new FirebaseModule(),
    new AppsFlyerModule(),
    new FacebookModule(),
    new PNLightModule(),
  ],
});
