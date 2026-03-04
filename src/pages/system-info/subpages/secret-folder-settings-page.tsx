import { router } from 'expo-router';
import { usePinSettings } from 'expo-with-pincode';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { PressableCard } from '@/components/pressable-card';
import { ToggleCard } from '@/components/toggle-card';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function SecretFolderSettingsPage() {
  const selectedLang = useStorageValue('selectedLang');
  const { isPincodeSet, isFaceIdEnabled, setUseFaceId } = usePinSettings();
  const handleUsePinChange = () => {
    router.navigate(isPincodeSet ? '/reset-pin' : '/set-pin');
  };

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.sf_settings} />
        <View className="gap-y-2 pt-5">
          <ToggleCard
            title={langs[selectedLang].page_names.use_face}
            value={isFaceIdEnabled}
            toggleValue={() => {
              setUseFaceId(!isFaceIdEnabled);
            }}
          />
          <ToggleCard
            title={langs[selectedLang].page_names.use_pin}
            value={isPincodeSet || false}
            toggleValue={() => {
              handleUsePinChange();
            }}
          />
          {isPincodeSet && (
            <PressableCard
              title={langs[selectedLang].page_names.change_code}
              handler={() => router.navigate('/set-pin')}
              classes="px-3 py-2"
            />
          )}
          <PressableCard
            title={langs[selectedLang].page_names.autofill_guide}
            handler={() =>
              router.navigate('/secret-folder/passwords/enable-autofill')
            }
            classes="px-3 py-2"
          />
        </View>
      </Container>
    </Page>
  );
}
