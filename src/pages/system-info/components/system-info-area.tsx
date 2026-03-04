import { useMemoryUsage } from '@kirz/react-native-device-info';
import { getNetworkStateAsync, NetworkStateType } from 'expo-network';
import { View } from 'react-native';

import { useConfig } from '@/hooks/use-config';
import { useStorageValue } from '@/hooks/use-storage';
import { useStorage } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import SystemItem from '@/pages/secret-folder/components/system-item';
import RamIcon from '@/svg/ram.svg';
import SecretFolder from '@/svg/secret-folder.svg';
import WifiIcon from '@/svg/wi-fi.svg';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';

export function SystemInfoArea() {
  const { moderation_mode } = useConfig();
  const selectedLang = useStorageValue('selectedLang');
  const nwState = usePromise(getNetworkStateAsync());
  const ramUsage = useMemoryUsage();
  const [securedDataPercent] = useStorage('securedDataPercent');

  return (
    <View className="rounded-4xl bg-white/10 gap-y-2 px-4 py-3">
      <View className="flex-row justify-between">
        <UiText className="text-xs font-medium">
          {langs[selectedLang].pages.settings.system_information}
        </UiText>
      </View>
      <View className="flex-row justify-between">
        <SystemItem
          Icon={WifiIcon}
          label={langs[selectedLang].wi_fi}
          percentage={
            nwState?.type === NetworkStateType.WIFI && nwState.isConnected
              ? 100
              : 0
          }
        />
        {!moderation_mode && (
          <SystemItem
            Icon={RamIcon}
            label={langs[selectedLang].pages.settings.ram}
            percentage={(ramUsage.free / ramUsage.total) * 100}
          />
        )}
        <SystemItem
          Icon={SecretFolder}
          label={langs[selectedLang].pages.settings.secure}
          percentage={securedDataPercent}
        />
      </View>
    </View>
  );
}
