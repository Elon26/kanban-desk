import type * as Contacts from 'expo-contacts';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const selectedContactsAtom = atom<Contacts.Contact[]>([]);

export function useContactsSelector() {
  const [selectedContacts, setSelectedContacts] = useAtom(selectedContactsAtom);

  const isSomeUnchecked = useCallback(
    (currentAssets: Contacts.Contact[][]) => {
      return currentAssets.some((group: Contacts.Contact[]) =>
        group.some(
          (contact) => !selectedContacts.find((s) => s.id === contact.id)
        )
      );
    },
    [selectedContacts]
  );

  const onSelectAll = useCallback(
    (currentAssets: Contacts.Contact[][]) => {
      if (currentAssets.length > 0 && isSomeUnchecked(currentAssets)) {
        setSelectedContacts((prev) => [
          ...prev,
          ...currentAssets
            .flat()
            .filter((contact) => !prev.find((s) => s.id === contact.id)),
        ]);
      } else {
        setSelectedContacts((prev) =>
          prev.filter(
            (selectedContact) =>
              !currentAssets
                .flat()
                .some((contact) => contact.id === selectedContact.id)
          )
        );
      }
    },
    [setSelectedContacts, isSomeUnchecked]
  );

  const handleSelect = useCallback(
    (contact: Contacts.Contact) => {
      setSelectedContacts((prev) => {
        if (prev.includes(contact)) {
          return prev.filter((c) => c.id !== contact.id);
        }
        return [...prev, contact];
      });
    },
    [setSelectedContacts]
  );

  const checkSelection = useCallback(
    (item: Contacts.Contact) => {
      return selectedContacts.includes(item);
    },
    [selectedContacts]
  );

  const allSelectedGroup = useCallback(
    (contacts: Contacts.Contact[]) =>
      contacts.length > 0 &&
      contacts.every((c) => selectedContacts.includes(c)),
    [selectedContacts]
  );

  const handleSelectAllGroup = useCallback(
    (contacts: Contacts.Contact[], allSelectedGroup: boolean) => {
      setSelectedContacts((prev) => {
        if (allSelectedGroup) {
          return prev.filter((c) => !contacts.includes(c));
        }
        return [...prev, ...contacts];
      });
    },
    [setSelectedContacts]
  );

  return {
    isSomeUnchecked,
    onSelectAll,
    checkSelection,
    handleSelectAllGroup,
    allSelectedGroup,
    handleSelect,
    setSelectedContacts,
    selectedContacts,
  };
}
