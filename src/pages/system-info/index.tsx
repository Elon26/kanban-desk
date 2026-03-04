import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { PressableCard } from '@/components/pressable-card';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import DeviceIcon from '@/svg/system-info/device.svg';
import ScreenTestIcon from '@/svg/system-info/screen-test.svg';
import SecretFolderIcon from '@/svg/system-info/secret-folder.svg';
import SensorsIcon from '@/svg/system-info/sensors.svg';
import WidgetsIcon from '@/svg/system-info/widgets.svg';

import { BatteryArea } from './components/battery-area';
import { IosArea } from './components/ios-area';
import { NotificationPressableCard } from './components/notification-pressable-card';
import { SystemInfoArea } from './components/system-info-area';

export function SystemInfoPage() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.system_info} />
        <ScrollView className="my-5">
          <View className="gap-y-3">
            <View className="flex-row items-stretch gap-x-3">
              <BatteryArea />
              <View className="flex-1 gap-y-3">
                <IosArea />
                <SystemInfoArea />
              </View>
            </View>
            <PressableCard
              title={langs[selectedLang].page_names.secret_folder}
              subtitle={langs[selectedLang].page_names.protect}
              Icon={SecretFolderIcon}
              handler={() => {
                router.navigate('/system-info/sf-settings');
              }}
            />
            <NotificationPressableCard />
            <PressableCard
              title={langs[selectedLang].page_names.screen_test}
              subtitle={langs[selectedLang].page_names.bad_pixels}
              Icon={ScreenTestIcon}
              handler={() => {
                router.navigate('/system-info/screen-test');
              }}
            />
            <PressableCard
              title={langs[selectedLang].page_names.device_info}
              subtitle={langs[selectedLang].page_names.basic_properties}
              Icon={DeviceIcon}
              handler={() => {
                router.navigate('/system-info/device-info');
              }}
            />
            <PressableCard
              title={langs[selectedLang].page_names.sensors}
              subtitle={langs[selectedLang].page_names.rotation_acceleration}
              Icon={SensorsIcon}
              handler={() => {
                router.navigate('/system-info/sensors');
              }}
            />
            <PressableCard
              title={langs[selectedLang].page_names.widgets}
              subtitle={langs[selectedLang].files}
              Icon={WidgetsIcon}
              handler={() => {
                router.navigate('/system-info/widgets');
              }}
            />
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
