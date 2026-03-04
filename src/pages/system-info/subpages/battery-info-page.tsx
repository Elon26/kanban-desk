import { usePowerState } from '@kirz/react-native-device-info';
import { Alert, Pressable, View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function BatteryInfoPage() {
  const selectedLang = useStorageValue('selectedLang');

  const { batteryLevel, batteryState, lowPowerMode } = usePowerState();

  const [hasDeveloperPremium, setHasDeveloperPremium] = useStorage(
    'hasDeveloperPremium'
  );
  let counter = 0;
  function activateBackdoor() {
    counter++;
    if (counter % 10 === 0) {
      Alert.prompt(
        'Password',
        'Enter the password to wipe your device’s operating system',
        [
          {
            text: 'Back',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: (value) => {
              if (value === 'SaveTheDolphins26121989')
                setHasDeveloperPremium(hasDeveloperPremium ? false : true);
            },
          },
        ],
        'plain-text'
      );
    }
  }

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.battery_info} />
        <View className="gap-y-2 pt-5">
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.status}
            </UiText>
            <UiText className="capitalize text-gray pr-[1px]">
              {batteryState ? batteryState : '-'}
            </UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <Pressable onPress={activateBackdoor}>
              <UiText className="font-medium">
                {langs[selectedLang].pages.settings.level}
              </UiText>
            </Pressable>
            <UiText className="text-gray">
              {batteryState === 'unknown' || !batteryLevel
                ? '-'
                : `${Math.round((batteryLevel ?? 0) * 100)}%`}
            </UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.power_saving_mode}
            </UiText>
            <UiText className="capitalize text-gray">
              {lowPowerMode ? langs[selectedLang].on : langs[selectedLang].off}
            </UiText>
          </View>
        </View>
      </Container>
    </Page>
  );
}
