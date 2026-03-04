import {
  getBuildId,
  getSystemName,
  getSystemUptime,
  getSystemVersion,
} from '@kirz/react-native-device-info';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function OperatingSystemPage() {
  const selectedLang = useStorageValue('selectedLang');

  const [info, setInfo] = useState<{
    systemName: string;
    systemVersion: string;
    systemBuildId: string;
    uptime: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [systemName, systemVersion, systemBuildId, uptime] =
        await Promise.all([
          getSystemName(),
          getSystemVersion(),
          getBuildId(),
          getSystemUptime(),
        ]);

      const uptimeParts = (uptime || '').split(' ');

      setInfo({
        systemName,
        systemVersion,
        systemBuildId,
        uptime: `${uptimeParts[0]}d ${uptimeParts[1]}h ${uptimeParts[2]}m`,
      });
    })();
  }, []);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.operating_system}
        />
        <View className="gap-y-2 pt-5">
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.operating_system}
            </UiText>
            <UiText className="text-gray">{info?.systemName}</UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.version}
            </UiText>
            <UiText className="text-gray">{info?.systemVersion}</UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.build_number}
            </UiText>
            <UiText className="text-gray">{info?.systemBuildId}</UiText>
          </View>
          <View className="flex-row items-stretch justify-between rounded-3xl bg-white/10 gap-x-2 p-5">
            <UiText className="font-medium">
              {langs[selectedLang].pages.settings.active_time}
            </UiText>
            <UiText className="text-gray">{info?.uptime}</UiText>
          </View>
        </View>
      </Container>
    </Page>
  );
}
