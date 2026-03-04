import { router } from 'expo-router';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { PressableCard } from '@/components/pressable-card';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function WidgetsPage() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.widgets} />

        <View className="gap-y-4 mt-5">
          <PressableCard
            title={langs[selectedLang].page_names.home_widget}
            handler={() => {
              router.navigate({
                pathname: '/system-info/widgets/[type]',
                params: {
                  type: 'home',
                },
              });
            }}
          />
          <PressableCard
            title={langs[selectedLang].page_names.aod_widget}
            handler={() => {
              router.navigate({
                pathname: '/system-info/widgets/[type]',
                params: {
                  type: 'aod',
                },
              });
            }}
          />
        </View>
      </Container>
    </Page>
  );
}
