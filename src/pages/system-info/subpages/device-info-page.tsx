import {
  getDeviceId,
  getDeviceName,
  getSystemVersion,
} from '@kirz/react-native-device-info';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';

export function DeviceInfoPage() {
  const selectedLang = useStorageValue('selectedLang');
  const deviceName = usePromise(getDeviceName());
  const deviceID = getDeviceId();
  const systemVersion = getSystemVersion();

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.device_info} />
        <View className="gap-y-2 pt-5">
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.device}
            </UiText>
            <UiText className="text-gray">{deviceName}</UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.device_id}
            </UiText>
            <UiText className="text-gray">{deviceID}</UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.operating_system}
            </UiText>
            <UiText className="text-gray">IOS v.{systemVersion}</UiText>
          </View>
        </View>
      </Container>
    </Page>
  );
}
