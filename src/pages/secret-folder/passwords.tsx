import { usePurchases } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import type { ModalStackParams } from '@/components/modals';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiButton } from '@/ui/ui-button';
import { uuid } from '@/utils/uuid';

import { usePaywall } from '../paywall/hooks/use-paywall';
import { EmptyComponent } from './components/empty';
import { FlatListSeparator } from './components/flatlist-separator';
import { PasswordListItem } from './components/password-list-item';
import {
  deletePassword,
  useSecretPasswords,
} from './hooks/use-secret-passwords';
import { Password } from './hooks/use-secret-passwords/types';

export function SecretPasswords() {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const selectedLang = useStorageValue('selectedLang');
  const insets = useSafeAreaInsets();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPasswords, setSelectedPasswords] = useState<Password[]>([]);
  const { passwords, autofillEnabled } = useSecretPasswords();
  const { openModal, closeModal } = useModal<ModalStackParams>();
  const [autofillGuideShown, setAutofillGuideShown] =
    useStorage('autofillGuideShown');

  useEffect(() => {
    if (autofillEnabled === false && !autofillGuideShown) {
      setAutofillGuideShown(true);
      router.navigate('/secret-folder/passwords/enable-autofill');
    }
  }, [autofillEnabled, autofillGuideShown, setAutofillGuideShown]);

  function toggleCheckPassword(password: Password) {
    if (
      selectedPasswords.find(
        (selectedPassword) => selectedPassword.id === password.id
      )
    ) {
      const newSelectedPasswords = selectedPasswords.filter(
        (selectedPassword) => selectedPassword.id !== password.id
      );
      setSelectedPasswords(newSelectedPasswords);
    } else {
      setSelectedPasswords((prev) => [...prev, password]);
    }
  }

  async function deletePasswords() {
    let confirm: (value: unknown) => void = () => {};
    const confirmationPromise = new Promise<unknown>((resolve) => {
      confirm = resolve;
    });

    openModal('ConfirmationOfDeletionModal', {
      description:
        langs[selectedLang].modals.confirmation_of_deletion_modal.deleted_files,
      resolve: confirm,
    });

    const action = await confirmationPromise;

    closeModal('ConfirmationOfDeletionModal');

    if (action === 'later') {
      return;
    }

    selectedPasswords.forEach((password) => {
      deletePassword(password);
    });
    setSelectionMode(false);
    setSelectedPasswords([]);
  }

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.secret_passwords}
          rightButtonLabel={
            selectionMode
              ? langs[selectedLang].page_names.cancel
              : langs[selectedLang].page_names.select
          }
          rightButtonHandler={
            selectionMode
              ? () => {
                  setSelectionMode(false);
                  setSelectedPasswords([]);
                }
              : () => {
                  setSelectionMode(true);
                }
          }
        />
        {!passwords?.length ? (
          <EmptyComponent />
        ) : (
          <View className="pt-4">
            <FlatList
              data={passwords}
              keyExtractor={(item) => item.id ?? uuid()}
              renderItem={({ item }) => (
                <PasswordListItem
                  item={item}
                  selectionMode={selectionMode}
                  toggleCheckPassword={toggleCheckPassword}
                  isChecked={
                    !!selectedPasswords.find(
                      (selectedPassword) => selectedPassword.id === item.id
                    )
                  }
                />
              )}
              contentContainerStyle={{
                paddingTop: scaleY(6),
                paddingBottom: insets.bottom + scaleY(110),
              }}
              ItemSeparatorComponent={FlatListSeparator}
            />
          </View>
        )}
        <View
          className="absolute flex-row items-stretch gap-2.5 left-edge right-edge px-edge"
          style={{ bottom: insets.bottom + scaleY(12) || scaleY(52) }}
        >
          {selectedPasswords.length > 0 ? (
            <UiButton className="flex-1 bg-blue" onPress={deletePasswords}>
              {langs[selectedLang].buttons.delete}
            </UiButton>
          ) : (
            <UiButton
              className="flex-1 bg-blue"
              onPress={() => {
                !hasPremium && passwords?.length
                  ? showPaywall()
                  : openModal('SecretPasswordModal');
              }}
            >
              {langs[selectedLang].buttons.add_new}
            </UiButton>
          )}
        </View>
      </Container>
    </Page>
  );
}
