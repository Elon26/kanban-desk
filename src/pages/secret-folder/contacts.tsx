import { usePurchases } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiButton } from '@/ui/ui-button';
import { isNotNullOrUndefined } from '@/utils/array';
import { uuid } from '@/utils/uuid';

import { usePaywall } from '../paywall/hooks/use-paywall';
import { ContactListItem } from './components/contact-list-item';
import { EmptyComponent } from './components/empty';
import { FlatListSeparator } from './components/flatlist-separator';
import {
  type SecretContact,
  useSecretContacts,
} from './hooks/use-secret-contacts';

export function SecretContacts() {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const selectedLang = useStorageValue('selectedLang');
  const insets = useSafeAreaInsets();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<SecretContact[]>([]);
  const { all, importOrCreate, handleDelete } = useSecretContacts();
  const [adding, setAdding] = useState(false);

  const toggleSelection = (contact: SecretContact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((x) => x.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const isSelected = (contact: SecretContact) =>
    selectedContacts.includes(contact);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.secret_contacts}
          rightButtonLabel={
            selectionMode
              ? langs[selectedLang].page_names.cancel
              : langs[selectedLang].page_names.select
          }
          rightButtonHandler={
            selectionMode
              ? () => {
                  setSelectionMode(false);
                  setSelectedContacts([]);
                }
              : () => {
                  setSelectionMode(true);
                }
          }
        />
        {!all.length ? (
          <EmptyComponent />
        ) : (
          <View className="pt-4">
            <FlatList
              data={all}
              keyExtractor={(item) => item.id ?? uuid()}
              renderItem={({ item }) => (
                <ContactListItem
                  item={item}
                  isSelected={isSelected(item)}
                  toggleSelection={toggleSelection}
                  selectionMode={selectionMode}
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
          {selectedContacts.length ? (
            <UiButton
              className="flex-1 bg-blue"
              onPress={async () => {
                await handleDelete(
                  selectedContacts.map((x) => x.id).filter(isNotNullOrUndefined)
                );
                setSelectionMode(false);
                setSelectedContacts([]);
              }}
              loading={adding}
            >
              {langs[selectedLang].buttons.delete}
            </UiButton>
          ) : (
            <UiButton
              className="flex-1 bg-blue"
              onPress={
                !hasPremium && all.length
                  ? () => showPaywall()
                  : () => {
                      setAdding(true);
                      importOrCreate().finally(() => setAdding(false));
                    }
              }
            >
              {langs[selectedLang].buttons.add_new}
            </UiButton>
          )}
        </View>
      </Container>
    </Page>
  );
}
