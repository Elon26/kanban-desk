import type { Image } from 'expo-contacts';
import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionSheetIOS, Alert } from 'react-native';
import { useModal } from 'react-native-modalfy';

import { ModalStackParams } from '@/components/modals';
import { usePermissions } from '@/hooks/use-permissions';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { uuid } from '@/utils/uuid';

export type SecretContact = Contacts.Contact;

const SECRET_CONTACTS_IMAGE_DIR = `${FileSystem.documentDirectory}secret_contacts/images`;

export function useSecretContacts() {
  const selectedLang = useStorageValue('selectedLang');
  const [secretContacts, setSecretContacts] = useStorage('secretContacts');
  const [secretContactsSorted, setSecretContactsSorted] =
    useState(secretContacts);
  const { checkPermissionStatus } = usePermissions();

  useEffect(() => {
    setSecretContactsSorted(
      secretContacts.sort((a, b) => {
        if (a.firstName && b.firstName) {
          return a.firstName.localeCompare(b.firstName);
        }
        return 0;
      })
    );
  }, [secretContacts]);

  const addSecretContact = useCallback(
    (contact: Omit<SecretContact, 'id'>) => {
      const newContact = {
        id: uuid(),
        ...contact,
      };
      setSecretContacts((contacts) => {
        if (contacts.some((c) => c.id === newContact.id)) {
          newContact.id = uuid();
        }
        return [...contacts, newContact];
      });
    },
    [setSecretContacts]
  );

  const showAddingActionSheet = async () => {
    const acion = await new Promise<'cancel' | 'import' | 'new'>((res) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            langs[selectedLang].alerts.cancel,
            langs[selectedLang].alerts.add_new_contact,
            langs[selectedLang].alerts.import_from_device,
          ],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            res('cancel');
          } else if (buttonIndex === 2) {
            res('import');
          } else if (buttonIndex === 1) {
            res('new');
          }
          res('cancel');
        }
      );
    });

    switch (acion) {
      case 'new':
        await handleCreate();
        break;
      case 'import':
        await handleImport();
        break;
    }
  };

  const removeSecretContacts = useCallback(
    (contactIds: string | string[]) => {
      const ids = Array.isArray(contactIds) ? contactIds : [contactIds];
      const imagesToDelete = ids.map(
        (id) => secretContacts.find((c) => c.id === id)?.image?.uri
      );

      setSecretContacts((contacts) =>
        contacts.filter((contact) => !ids.includes(contact.id as string))
      );

      for (const image of imagesToDelete) {
        if (image) {
          FileSystem.deleteAsync(image).catch((e) => {
            console.error(e);
          });
        }
      }
    },
    [secretContacts, setSecretContacts]
  );

  const updateSecretContact = useCallback(
    (contactId: string, contact: SecretContact) => {
      setSecretContacts((contacts) =>
        contacts.map((c) => {
          if (c.id === contactId) {
            return contact;
          }
          return c;
        })
      );
    },
    [setSecretContacts]
  );

  const restoreSecretContacts = useCallback(
    async (contactIds: string[]) => {
      const newContacts = [...secretContacts];
      for (const id of contactIds) {
        const contact = secretContacts.find((c) => c.id === id);
        if (contact) {
          try {
            await Contacts.addContactAsync(contact);
            newContacts.splice(newContacts.indexOf(contact), 1);
            if (contact.image?.uri) {
              await FileSystem.deleteAsync(contact.image.uri);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      setSecretContacts(newContacts);
    },
    [secretContacts, setSecretContacts]
  );

  const getSecretContactById = useCallback(
    (contactId: string) => {
      return secretContacts.find((contact) => contact.id === contactId);
    },
    [secretContacts]
  );

  const fuse = useMemo(
    () =>
      new Fuse(secretContacts, {
        includeScore: true,
        threshold: 0.0,
        keys: ['firstName', 'lastName', 'phoneNumber', 'name'],
      }),
    [secretContacts]
  );

  const querySecretContacts = useCallback(
    (query: string) => fuse.search(query).map((result) => result.item),
    [fuse]
  );

  const copyImage = useCallback(async (img: Image) => {
    if (!img.uri) {
      throw new Error('Image URI is missing');
    }
    const filename = img.uri.split('/').pop();
    try {
      await FileSystem.makeDirectoryAsync(SECRET_CONTACTS_IMAGE_DIR, {
        intermediates: true,
      });
    } catch (e) {
      console.error(e);
      throw new Error('Failed to create directory');
    }
    try {
      await FileSystem.copyAsync({
        from: img.uri,
        to: `${SECRET_CONTACTS_IMAGE_DIR}/${filename}`,
      });
      return `${SECRET_CONTACTS_IMAGE_DIR}/${filename}`;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to copy image');
    }
  }, []);

  const [lastSecureAction, setLastSecureAction] =
    useStorage('lastSecureAction');
  const [securedDataPercent, setSecuredDataPercent] =
    useStorage('securedDataPercent');
  let updatedSecuredDataPercent = securedDataPercent;

  const handleCreate = useCallback(async () => {
    const { status } = await checkPermissionStatus('ios.permission.CONTACTS');
    if (status === 'blocked') {
      Alert.alert(
        langs[selectedLang].alerts.permission_denied,
        langs[selectedLang].alerts.enable_contacts
      );
      return;
    }

    // presentFormAsync does not return the contact object so we need to create contact,
    // then pass it to presentFormAsync, then get updated contact by id, then delete it
    const id = await Contacts.addContactAsync({
      name: '',
      contactType: Contacts.ContactTypes.Person,
    });

    await Contacts.presentFormAsync(id, null, {});
    const contact = await Contacts.getContactByIdAsync(id);
    // we can't know if a form was dismissed or filled other way
    const isCreated =
      Object.keys(contact ?? {}).filter(
        (key) =>
          key !== 'id' && key !== 'contactType' && key !== 'imageAvailable'
      ).length > 0;
    if (isCreated) {
      if (contact?.imageAvailable && contact.image?.uri) {
        try {
          const copiedImageUri = await copyImage(contact.image);
          contact.image.uri = copiedImageUri;
          contact.rawImage = undefined;
        } catch (e) {
          console.error('Failed to copy image:', (e as Error).message);
        }
      }
      if (contact) {
        addSecretContact(contact);
        if (updatedSecuredDataPercent < 100) {
          updatedSecuredDataPercent += 10;
          setSecuredDataPercent(updatedSecuredDataPercent);
          setLastSecureAction(Date.now());
        }
      } else {
        console.error('Failed to create contact');
      }
    }
    Contacts.removeContactAsync(id);
  }, [addSecretContact, checkPermissionStatus, copyImage]);

  const handleImport = useCallback(async () => {
    const { status } = await checkPermissionStatus('ios.permission.CONTACTS');
    if (status === 'blocked') {
      Alert.alert(
        langs[selectedLang].alerts.permission_denied,
        langs[selectedLang].alerts.enable_contacts
      );
      return;
    }

    const c = await Contacts.presentContactPickerAsync();
    if (!c?.id) {
      return;
    }
    // we need to get contact by id to get image
    const contact = await Contacts.getContactByIdAsync(c.id);
    if (!contact) {
      return;
    }

    if (updatedSecuredDataPercent < 100) {
      updatedSecuredDataPercent += 10;
      setSecuredDataPercent(updatedSecuredDataPercent);
      setLastSecureAction(Date.now());
    }

    Alert.alert(
      langs[selectedLang].alerts.copy_or_move,
      langs[selectedLang].alerts.want_copy,
      [
        {
          text: langs[selectedLang].alerts.cancel,
          style: 'cancel',
        },
        {
          text: langs[selectedLang].alerts.copy,
          onPress: async () => {
            if (contact.imageAvailable && contact.image?.uri) {
              try {
                const copiedImageUri = await copyImage(contact.image);
                contact.image.uri = copiedImageUri;
                contact.rawImage = undefined;
              } catch (e) {
                console.error('Failed to copy image:', (e as Error).message);
              }
            }
            addSecretContact(contact);
          },
        },
        {
          text: langs[selectedLang].alerts.move,
          style: 'destructive',
          onPress: async () => {
            if (contact.imageAvailable && contact.image?.uri) {
              try {
                const copiedImageUri = await copyImage(contact.image);
                contact.image.uri = copiedImageUri;
                contact.rawImage = undefined;
              } catch (e) {
                console.error('Failed to copy image:', (e as Error).message);
              }
            }
            addSecretContact(contact);
            try {
              await Contacts.removeContactAsync(contact.id as string);
            } catch (e) {
              console.error('Failed to remove contact:', (e as Error).message);
            }
          },
        },
      ]
    );
  }, [addSecretContact, checkPermissionStatus, copyImage]);

  const { openModal, closeModal } = useModal<ModalStackParams>();

  const handleDelete = async (contactIds: string | string[]) => {
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

    removeSecretContacts(contactIds);
  };

  const handleRestore = (contactIds: string[]) => {
    return new Promise<void>((res, rej) => {
      Alert.alert(
        langs[selectedLang].alerts.restore_contact,
        langs[selectedLang].alerts.contact_will_restore,
        [
          {
            text: langs[selectedLang].alerts.cancel,
            style: 'cancel',
            onPress: () => rej(),
          },
          {
            text: langs[selectedLang].alerts.restore,
            style: 'default',
            onPress: () => res(restoreSecretContacts(contactIds)),
          },
        ]
      );
    });
  };

  const handleEdit = async (contactId: string) => {
    const contact = secretContactsSorted.find((c) => c.id === contactId);
    if (!contact) {
      return;
    }
    const id = await Contacts.addContactAsync(contact);
    await Contacts.presentFormAsync(id, null, {});
    const updatedContact = await Contacts.getContactByIdAsync(id);
    if (updatedContact) {
      // iOS copies image to cache anyways, so we need to grab it and delete previous one
      if (updatedContact.imageAvailable && updatedContact.image?.uri) {
        try {
          const copiedImageUri = await copyImage(updatedContact.image);
          updatedContact.image.uri = copiedImageUri;
          updatedContact.rawImage = undefined;
        } catch (e) {
          console.error('Failed to copy image:', (e as Error).message);
        }
      }
      if (contact.image?.uri) {
        try {
          await FileSystem.deleteAsync(contact.image?.uri);
        } catch (e) {
          console.error(
            'Failed to delete previous image:',
            (e as Error).message
          );
        }
      }
      updateSecretContact(contactId, updatedContact);
    }
    Contacts.removeContactAsync(id);
    return updatedContact;
  };

  return {
    all: secretContactsSorted,
    getById: getSecretContactById,
    query: querySecretContacts,
    importOrCreate: showAddingActionSheet,
    update: updateSecretContact,
    handleDelete,
    handleRestore,
    handleEdit,
  };
}
