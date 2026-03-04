import { usePurchases } from '@kirz/expo-toolkit';
import type { Contact } from 'expo-contacts';
import { openSettings } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, Alert, FlatList, View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useModals } from '@/hooks/use-modals';
import { usePermissions } from '@/hooks/use-permissions';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { BottomFloat } from '@/ui/bottom-float';
import { FadeGradient } from '@/ui/fade-gradient';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import { usePaywall } from '../paywall/hooks/use-paywall';
import { Group } from './components/group';
import { useContactsCleaner } from './hooks/use-contacts-cleaner';
import { useContactsSelector } from './hooks/use-contacts-selector';

export function ContactsCleaner() {
  const { showPaywall } = usePaywall();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');
  const buttonPressAction =
    (
      useLocalSearchParams() as {
        buttonPressAction: 'back' | 'clean';
      }
    )?.buttonPressAction ?? 'clean';

  const {
    groupsSimilarBy,
    mergeAndDeleteSimilarContacts,
    isScanningForSimilarContacts,
  } = useContactsCleaner();
  const { selectedContacts, setSelectedContacts } = useContactsSelector();
  const similarGroups = groupsSimilarBy.any;

  const groupIsSelected = (group: Contact[]) =>
    group.every((contact) => selectedContacts.some((c) => c.id === contact.id));
  const itemIsSelected = (groupItem: Contact) =>
    selectedContacts.some((c) => c.id === groupItem.id);

  const toggleGroupSelection = (group: Contact[]) => {
    if (groupIsSelected(group)) {
      setSelectedContacts(
        selectedContacts.filter(
          (contact) => !group.some((g) => g.id === contact.id)
        )
      );
    } else {
      const arrayForSet: Contact[] = [];
      group.forEach((groupItem) => {
        if (!selectedContacts.some((c) => c.id === groupItem.id)) {
          arrayForSet.push(groupItem);
        }
      });
      setSelectedContacts([...selectedContacts, ...arrayForSet]);
    }
  };

  const toggleItemSelection = (groupItem: Contact) => {
    if (itemIsSelected(groupItem)) {
      setSelectedContacts(
        selectedContacts.filter((contact) => contact.id !== groupItem.id)
      );
    } else {
      setSelectedContacts([...selectedContacts, groupItem]);
    }
  };

  const { openModal, closeAllModals } = useModals();

  const handleClean = async () => {
    if (!hasPremium) {
      showPaywall();
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          langs[selectedLang].alerts.cancel,
          t(
            selectedContacts.length === 1
              ? 'mergeContacts_one'
              : 'mergeContacts_plural',
            {
              count: selectedContacts.length,
            }
          ),
        ],
        cancelButtonIndex: 0,
        title: langs[selectedLang].alerts.action_cannot_be_undone,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          openModal('LoaderModal');
          await mergeAndDeleteSimilarContacts(selectedContacts, similarGroups);
          setSelectedContacts([]);
          closeAllModals(() => {
            openModal('SuccessModal', {
              filesQuantity: selectedContacts.length,
              freedSpace: '50 Kb',
            });
          });
        }
      }
    );
  };

  useEffect(
    () => () => {
      if (buttonPressAction === 'clean') {
        setSelectedContacts([]);
      }
    },
    [buttonPressAction, setSelectedContacts]
  );

  const { checkPermissionStatus } = usePermissions();
  useEffect(() => {
    (async () => {
      const { status } = await checkPermissionStatus('ios.permission.CONTACTS');

      if (status === 'blocked') {
        Alert.alert(
          langs[selectedLang].alerts.access_denied,
          langs[selectedLang].alerts.access_to_contacts,
          [
            {
              text: langs[selectedLang].alerts.open_settings,
              onPress: openSettings,
            },
            {
              text: langs[selectedLang].alerts.cancel,
              style: 'cancel',
            },
          ]
        );
        return [];
      }
    })();
  }, [checkPermissionStatus]);

  useEffect(() => {
    if (isScanningForSimilarContacts) {
      openModal('LoaderModal');
    } else {
      closeAllModals();
    }
  }, [isScanningForSimilarContacts]);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.duplicate_contacts}
          rightButtonLabel={
            selectedContacts.length
              ? langs[selectedLang].page_names.cancel
              : langs[selectedLang].page_names.select_all
          }
          rightButtonHandler={() =>
            setSelectedContacts(
              selectedContacts.length ? [] : similarGroups.flat()
            )
          }
        />
        <View className="mt-8 pb-32">
          {similarGroups.length === 0 && !isScanningForSimilarContacts && (
            <UiText className="text-center text-lg font-bold">
              {langs[selectedLang].pages.contacts_cleaner.duplicate}
            </UiText>
          )}
          {similarGroups.length !== 0 && !isScanningForSimilarContacts && (
            <View>
              <FlatList
                data={similarGroups}
                keyExtractor={(similarGroup) => similarGroup[1].id ?? uuid()}
                renderItem={({ item }) => {
                  return (
                    <Group
                      key={item[0].id}
                      group={item}
                      groupIsSelected={groupIsSelected(item)}
                      itemIsSelected={itemIsSelected}
                      toggleGroupSelection={toggleGroupSelection}
                      toggleItemSelection={toggleItemSelection}
                    />
                  );
                }}
                ItemSeparatorComponent={() => <View className="h-4" />}
              />
            </View>
          )}
        </View>
        {selectedContacts.length !== 0 && (
          <>
            <FadeGradient />
            <BottomFloat
              title={langs[selectedLang].buttons.merge_contacts}
              subtitle={t('quantity', {
                selectedQuantity: selectedContacts.length,
                totalQuantity: similarGroups.flat().length,
              })}
              handler={handleClean}
            />
          </>
        )}
      </Container>
    </Page>
  );
}
