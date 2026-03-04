import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  PincodeInputField,
  PincodeScreen,
  usePinInputState,
  usePinSettings,
} from 'expo-with-pincode';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import { useStorage } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import PinLock from '@/images/pin-lock.png';
import { UiText } from '@/ui/ui-text';

import { Char } from './components/char';
import { PincodeButton } from './components/pincode-button';

/**
 * Authentication
 */
export const AuthScreen = () => <Screen mode="check" />;
/**
 * Setting (if not set) or changing pin
 */
export const SetPinScreen = () => <Screen mode="set-or-change" />;
/**
 * Resetting pin (without setting a new one)
 */
export const ResetPinScreen = () => <Screen mode="reset" />;

type ScreenProps = {
  mode: 'check' | 'set-or-change' | 'reset';
};

function Screen({ mode }: ScreenProps) {
  const selectedLang = useStorageValue('selectedLang');
  const [isFirstLaunchSecretFolder] = useStorage('isFirstLaunchSecretFolder');
  const { message, cursor } = usePinInputState();
  const { isPincodeSet, isBiometricsAvailable, isFaceIdEnabled } =
    usePinSettings();
  let initialMode: 'reset' | 'create' | 'check';
  if (mode !== 'check') {
    initialMode = isPincodeSet ? 'reset' : 'create';
  } else {
    initialMode = 'check';
  }

  const [screenMode, setScreenMode] = useState<'reset' | 'create' | 'check'>(
    initialMode
  );

  const faceIdButtonEnabled =
    !isFirstLaunchSecretFolder && isBiometricsAvailable && isFaceIdEnabled;
  const backspaceButtonEnabled = cursor > 0;

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.pin_code} />
        <SafeAreaView className="flex-1">
          <PincodeScreen
            mode={screenMode}
            onSuccessfulSetPincode={router.back}
            onSuccessfulResetPincode={() => {
              if (mode === 'set-or-change') {
                setScreenMode('create');
              } else {
                router.back();
              }
            }}
            className="flex-1"
          >
            <View className="items-center -mt-12">
              <Image
                source={PinLock}
                className="h-[165px] w-[121px]"
                style={{ transform: [{ scale: 1.5 }] }}
              />
              <UiText className="text-xl font-medium mb-5">
                {message || langs[selectedLang].pages.pincode.enter_pin}
              </UiText>
              <PincodeInputField
                className="flex-row gap-x-3 mb-7"
                characterElement={Char}
              />
            </View>
            <View className="flex-row flex-wrap items-center justify-center gap-4 px-10">
              {(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 'faceid', 0, 'backspace'] as const
              ).map((value) => (
                <PincodeButton
                  value={value}
                  key={value}
                  disabled={
                    (value === 'faceid' && !faceIdButtonEnabled) ||
                    (value === 'backspace' && !backspaceButtonEnabled)
                  }
                  isNotNumber={value === 'faceid' || value === 'backspace'}
                />
              ))}
            </View>
          </PincodeScreen>
        </SafeAreaView>
      </Container>
    </Page>
  );
}
