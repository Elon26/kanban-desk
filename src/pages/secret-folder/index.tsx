import { usePinSettings } from 'expo-with-pincode';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useModal } from 'react-native-modalfy';

import { Container } from '@/components/container';
import { ModalStackParams } from '@/components/modals';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

import { FoldersArea } from './components/folders-area';
import { HandLinksArea } from './components/hand-links-area';
import { PinCodeArea } from './components/pin-code-area';
import { SecuredDataArea } from './components/secured-data-area';
import { SystemInfoArea } from './components/system-info-area';
import { useSecretContacts } from './hooks/use-secret-contacts';
import { useSecretFolderGallery } from './hooks/use-secret-folder-gallery';
import { useSecretPasswords } from './hooks/use-secret-passwords';

export function SecretFolderPage() {
  const selectedLang = useStorageValue('selectedLang');
  const [isFirstLaunchSecretFolder, setIsFirstLaunchSecretFolder] = useStorage(
    'isFirstLaunchSecretFolder'
  );
  const { isPincodeSet } = usePinSettings();
  const { openModal } = useModal<ModalStackParams>();
  const { assets } = useSecretFolderGallery();
  const { all } = useSecretContacts();
  const { passwords } = useSecretPasswords();

  useEffect(() => {
    if (!isPincodeSet && isFirstLaunchSecretFolder) {
      openModal('SetPinRequestModal');
      setIsFirstLaunchSecretFolder(false);
    }
  }, [
    openModal,
    isPincodeSet,
    isFirstLaunchSecretFolder,
    setIsFirstLaunchSecretFolder,
  ]);

  const [securedDataPercent, setSecuredDataPercent] =
    useStorage('securedDataPercent');

  useEffect(() => {
    if (securedDataPercent > 100) {
      setSecuredDataPercent(100);
    }
  }, []);

  useEffect(() => {
    if (assets.length + all.length + (passwords?.length || 0) === 0) {
      setSecuredDataPercent(0);
    }
  }, [assets, all, passwords]);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.secret_folder} />
        <View className="gap-y-10 pt-5">
          <View className="flex-row items-stretch gap-x-3">
            <SecuredDataArea />
            <View className="flex-1 gap-y-3">
              <FoldersArea />
              <SystemInfoArea />
            </View>
          </View>
          <HandLinksArea />
          <PinCodeArea />
        </View>
      </Container>
    </Page>
  );
}
