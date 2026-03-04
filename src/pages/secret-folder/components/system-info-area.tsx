import { useMemoryUsage, usePowerState } from '@kirz/react-native-device-info';
import { getNetworkStateAsync, NetworkStateType } from 'expo-network';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BatteryIcon from '@/svg/battery.svg';
import RamIcon from '@/svg/ram.svg';
import WifiIcon from '@/svg/wi-fi.svg';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';

import SystemItem from './system-item';

export function SystemInfoArea() {
  const nwState = usePromise(getNetworkStateAsync());
  const ramUsage = useMemoryUsage();
  const { batteryLevel, batteryState } = usePowerState();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="rounded-4xl bg-white/10 gap-y-2 px-4 py-3">
      <View className="flex-row justify-between">
        <UiText className="text-xs font-medium">
          {langs[selectedLang].pages.secret_folder.phone_system}
        </UiText>
      </View>
      <View className="flex-row justify-between">
        <SystemItem
          Icon={WifiIcon}
          label={langs[selectedLang].pages.secret_folder.wi_fi}
          percentage={
            nwState?.type === NetworkStateType.WIFI && nwState.isConnected
              ? 100
              : 0
          }
        />
        <SystemItem
          Icon={RamIcon}
          label={langs[selectedLang].pages.secret_folder.ram}
          percentage={(ramUsage.free / ramUsage.total) * 100}
        />
        <SystemItem
          Icon={BatteryIcon}
          label={langs[selectedLang].pages.secret_folder.battery}
          percentage={
            batteryState === 'unknown' || !batteryLevel
              ? 0
              : Math.round((batteryLevel ?? 0) * 100)
          }
        />
      </View>
    </View>
  );
}
