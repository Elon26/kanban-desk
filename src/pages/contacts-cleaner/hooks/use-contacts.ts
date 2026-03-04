import { useQuery } from '@tanstack/react-query';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';

import { queryClient } from '@/config/legacy/query-client';
import { usePermissions } from '@/hooks/use-permissions';

export type ContactsFetchStatus = 'unknown' | 'fetching' | 'error' | 'blocked' | 'fetched';

const fetchContacts = async () => {
  try {
    const fields = Object.values(Contacts.Fields).filter((f) => f !== 'note');
    const { data } = await Contacts.getContactsAsync({
      fields,
    });
    return data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

/**
 * Hook to manage contacts fetching. May be called in any component.
 * Contacts are cached in global state by react-query.
 * @returns Contacts data and refetch function
 **/
export function useContacts() {
  const { checkPermissionStatus } = usePermissions();
  const [contactsStatus, setContactsStatus] = useState<ContactsFetchStatus>('unknown');

  const contactsQuery = useQuery(
    {
      queryKey: ['contacts'],
      queryFn: fetchContacts,
      enabled: false,
    },
    queryClient
  );

  const { refetch: refetchContacts } = contactsQuery;

  useEffect(() => {
    checkPermissionStatus('ios.permission.CONTACTS').then(({ status }) => {
      if (status === 'granted') {
        refetchContacts();
        setContactsStatus('fetched');
        return;
      }
      if (status === 'blocked') {
        setContactsStatus('blocked');
      }
    });
  }, [checkPermissionStatus, refetchContacts]);

  return {
    contacts: contactsQuery.data,
    contactsStatus,
    refetchContacts: contactsQuery.refetch,
  };
}
