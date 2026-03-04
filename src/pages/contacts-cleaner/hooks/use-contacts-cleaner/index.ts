import uFuzzy from '@leeoniya/ufuzzy';
import { useQuery } from '@tanstack/react-query';
import * as Contacts from 'expo-contacts';
import { useAtom } from 'jotai';
import debounce from 'lodash.debounce';
import { useState } from 'react';

import { queryClient } from '@/config/legacy/query-client';
import { useStorage } from '@/hooks/use-storage';

import { useContacts } from '../use-contacts';
import { queryEnabledAtom } from './atom';
import { mutex } from './mutex';

/**
 * Merge similar contacts
 * @param selectedContacts array of contacts to merge within their groups
 * @param similarContactsGroups array of groups of similar contacts
 * @returns array of groups that contsins merged contact and ids of contacts to delete
 * */
export function getMergedContacts(
  selectedContacts: Contacts.Contact[],
  similarContactsGroups: Contacts.Contact[][]
) {
  let mutable = [...selectedContacts];
  const result: {
    merged: Contacts.Contact | null;
    deleteIds: (string | undefined)[];
  }[] = [];

  while (mutable.length > 0) {
    const contact = mutable.pop();
    if (!contact) {
      continue;
    }
    const activeGroup = similarContactsGroups.find((g) =>
      g.some((c) => c.id === contact.id)
    );
    if (!activeGroup) {
      continue;
    }
    const groupToMerge = activeGroup.filter((c) =>
      selectedContacts.some((cc) => cc.id === c.id)
    );

    // If there is only one contact in the group, we don't need to merge it, just delete
    if (groupToMerge.length === 1) {
      result.push({ merged: null, deleteIds: [groupToMerge[0].id] });
      continue;
    }

    const phoneNumbersMap: Record<string, Contacts.PhoneNumber> = {};
    const flatPhoneNumbers = groupToMerge.flatMap((c) => c.phoneNumbers ?? []);

    for (const phoneNumber of flatPhoneNumbers) {
      const index = phoneNumber.number ?? phoneNumber.digits;
      if (index) {
        phoneNumbersMap[index] = phoneNumber;
      }
    }

    const newPhoneNumbers = Object.values(phoneNumbersMap) ?? undefined;

    const newAddresses =
      groupToMerge.flatMap((c) => c.addresses ?? []) ?? undefined;
    const newDates = groupToMerge.flatMap((c) => c.dates ?? []) ?? undefined;

    const emailsMap: Record<string, Contacts.Email> = {};
    const flatEmails = groupToMerge.flatMap((c) => c.emails ?? []);
    for (const email of flatEmails) {
      const index = email.email;
      if (index) {
        emailsMap[index] = email;
      }
    }
    const newEmails = Object.values(emailsMap) ?? undefined;

    const instantMessageAddressesMap: Record<
      string,
      Contacts.InstantMessageAddress
    > = {};
    const flatInstantMessageAddresses = groupToMerge.flatMap(
      (c) => c.instantMessageAddresses ?? []
    );
    for (const instantMessageAddress of flatInstantMessageAddresses) {
      const index = `${instantMessageAddress.service}/${instantMessageAddress.username}`;
      if (index) {
        instantMessageAddressesMap[index] = instantMessageAddress;
      }
    }
    const newInstantMessageAddresses =
      Object.values(instantMessageAddressesMap) ?? undefined;

    const relationshipsMap: Record<string, Contacts.Relationship> = {};
    const flatRelationships = groupToMerge.flatMap(
      (c) => c.relationships ?? []
    );
    for (const relationship of flatRelationships) {
      const index = relationship.name;
      if (index) {
        relationshipsMap[index] = relationship;
      }
    }
    const newRelationships = Object.values(relationshipsMap) ?? undefined;

    const socialProfilesMap: Record<string, Contacts.SocialProfile> = {};
    const flatSocialProfiles = groupToMerge.flatMap(
      (c) => c.socialProfiles ?? []
    );
    for (const socialProfile of flatSocialProfiles) {
      const index =
        (socialProfile.url ??
          socialProfile.username ??
          socialProfile.userId ??
          '') + socialProfile.service;
      if (index) {
        socialProfilesMap[index] = socialProfile;
      }
    }
    const newSocialProfiles = Object.values(socialProfilesMap) ?? undefined;

    const urlAddressesMap: Record<string, Contacts.UrlAddress> = {};
    const flatUrlAddresses = groupToMerge.flatMap((c) => c.urlAddresses ?? []);
    for (const urlAddress of flatUrlAddresses) {
      const index = urlAddress.url;
      if (index) {
        urlAddressesMap[index] = urlAddress;
      }
    }
    const newUrlAddresses = Object.values(urlAddressesMap) ?? undefined;

    const newContact: Contacts.Contact = {
      id: contact.id,
      birthday: groupToMerge.find((c) => c.birthday)?.birthday,
      company: groupToMerge.find((c) => c.company)?.company,
      contactType:
        groupToMerge.find((c) => c.contactType)?.contactType ??
        Contacts.ContactTypes.Person,
      department: groupToMerge.find((c) => c.department)?.department,
      firstName: groupToMerge.find((c) => c.firstName)?.firstName,
      image: groupToMerge.find((c) => c.image)?.image,
      jobTitle: groupToMerge.find((c) => c.jobTitle)?.jobTitle,
      lastName: groupToMerge.find((c) => c.lastName)?.lastName,
      maidenName: groupToMerge.find((c) => c.maidenName)?.maidenName,
      middleName: groupToMerge.find((c) => c.middleName)?.middleName,
      name: groupToMerge.find((c) => c.name)?.name ?? 'Unknown',
      namePrefix: groupToMerge.find((c) => c.namePrefix)?.namePrefix,
      nameSuffix: groupToMerge.find((c) => c.nameSuffix)?.nameSuffix,
      nickname: groupToMerge.find((c) => c.nickname)?.nickname,
      nonGregorianBirthday: groupToMerge.find((c) => c.nonGregorianBirthday)
        ?.nonGregorianBirthday,
      note: groupToMerge.find((c) => c.note)?.note,
      phoneticFirstName: groupToMerge.find((c) => c.phoneticFirstName)
        ?.phoneticFirstName,
      phoneticLastName: groupToMerge.find((c) => c.phoneticLastName)
        ?.phoneticLastName,
      phoneticMiddleName: groupToMerge.find((c) => c.phoneticMiddleName)
        ?.phoneticMiddleName,
      rawImage: groupToMerge.find((c) => c.rawImage)?.rawImage,

      phoneNumbers: newPhoneNumbers.length ? newPhoneNumbers : undefined,
      addresses: newAddresses.length ? newAddresses : undefined,
      dates: newDates.length ? newDates : undefined,
      emails: newEmails.length ? newEmails : undefined,
      instantMessageAddresses: newInstantMessageAddresses.length
        ? newInstantMessageAddresses
        : undefined,
      relationships: newRelationships.length ? newRelationships : undefined,
      socialProfiles: newSocialProfiles.length ? newSocialProfiles : undefined,
      urlAddresses: newUrlAddresses.length ? newUrlAddresses : undefined,
    };

    const idsToDelete = groupToMerge
      .map((c) => c.id)
      .filter((id) => id !== contact.id && id !== undefined);

    result.push({ merged: newContact, deleteIds: idsToDelete });
    mutable = mutable.filter((c) => !groupToMerge.some((gc) => gc.id === c.id));
  }
  return result;
}
/**
 * Find similar contacts
 * @param searchIn array of contacts to search in
 * @param similarTo contact to find similar to
 * @param similarBy field to search by (name/number/any(name and number))
 * @returns group (array) of similar contacts ids (including the original one)
 * */
const findSimilarContacts = async (
  searchIn: Contacts.Contact[],
  similarTo: Contacts.Contact,
  similarBy: 'any' | 'number' | 'name' = 'any'
) => {
  const group = new Set<Contacts.Contact>();
  group.add(similarTo);

  const uf = new uFuzzy({ unicode: true });

  const numbersHaystack: string[] = [];
  const namesHaystack: string[] = [];
  for (const contact of searchIn) {
    let numbersStr = '';
    for (const number of contact.phoneNumbers ?? ['']) {
      if (typeof number === 'string') {
        numbersStr += `${number} `;
      } else {
        numbersStr += `${number.digits} `;
      }
    }
    numbersHaystack.push(numbersStr);
    namesHaystack.push(contact.name ?? '');
  }

  const getSimilarNumbers = (contact: Contacts.Contact) =>
    new Promise<Contacts.Contact[]>((resolve, reject) => {
      setTimeout(() => {
        try {
          const similarContacts: Contacts.Contact[] = [];
          for (const number of contact.phoneNumbers ?? []) {
            const needle = typeof number === 'string' ? number : number.digits;
            if (!needle) {
              resolve([]);
              continue;
            }
            const results = uf.search(numbersHaystack, needle);
            const idxs = results[0]?.slice(1);
            for (const idx of idxs ?? []) {
              similarContacts.push(searchIn[idx]);
            }
          }
          resolve(similarContacts);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

  const getSimilarNames = (contact: Contacts.Contact) =>
    new Promise<Contacts.Contact[]>((resolve, reject) => {
      setTimeout(() => {
        try {
          const needle = contact.name;
          if (!needle) {
            resolve([]);
            return;
          }
          const results = uf.search(namesHaystack, needle);
          const idxs = results[0]?.slice(1);
          const similarContacts = idxs?.map((idx) => searchIn[idx]);
          resolve(similarContacts ?? []);
          resolve([]);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

  for (const contact of group) {
    const promises = [];
    if (similarBy === 'any' || similarBy === 'number') {
      promises.push(getSimilarNumbers(contact));
    }
    if (similarBy === 'any' || similarBy === 'name') {
      promises.push(getSimilarNames(contact));
    }
    await Promise.all(promises).then((results) => {
      for (const result of results.flat()) {
        group.add(result);
      }
    });
  }

  return Array.from(group).map((contact) => contact.id);
};

/**
 * Hook to manage contacts cleaning
 * @returns functions to scan for similar contacts and merge them
 * */
export function useContactsCleaner() {
  const [isContactsPermissionAsked, setIsContactsPermissionAsked] = useStorage(
    'isContactsPermissionAsked'
  );
  if (!isContactsPermissionAsked) setIsContactsPermissionAsked(true);
  const [percentCompleted, setPercentCompleted] = useState(0);
  const { contacts, contactsStatus, refetchContacts } = useContacts();

  const scan = async (
    contacts: Contacts.Contact[],
    similarBy: 'any' | 'number' | 'name' = 'any'
  ) => {
    return mutex.runExclusive(async () => {
      const start = Date.now();
      setPercentCompleted(0);
      const primaryLength = contacts?.length ?? 0;
      const groups: (string | undefined)[][] = [];
      let mutable = [...(contacts ?? [])].filter(
        (c) => c.phoneNumbers?.length && c.name
      );

      const setPercentCompletedDebounced = debounce(() => {
        const p = Math.round(
          ((primaryLength - mutable.length) / primaryLength) * 100
        );
        setPercentCompleted(p);
      }, 100);

      while (mutable.length > 0) {
        const group =
          (await findSimilarContacts(mutable, mutable[0], similarBy)) ?? [];
        if (group.length > 1) {
          groups.push(group);
        }
        mutable = mutable.filter((c) => !group.includes(c.id));
        setPercentCompletedDebounced();
      }
      setPercentCompleted(100);
      return groups.map((group) => {
        return group
          .map((id) => (contacts ?? []).find((c) => c.id === id))
          .filter((c) => c !== undefined);
      });
    });
  };

  const [queryEnabled, setQueryEnabled] = useAtom(queryEnabledAtom);

  const similarByAny = useQuery(
    {
      queryKey: ['contacts-similar', 'similarBy:any', JSON.stringify(contacts)],
      // biome-ignore lint/style/noNonNullAssertion: contacts are set in the enabled condition
      queryFn: () => scan(contacts!, 'any'),
      enabled:
        queryEnabled.any &&
        contacts !== undefined &&
        contactsStatus === 'fetched',
      experimental_prefetchInRender: true,
      placeholderData: [],
    },
    queryClient
  );
  const { data: similarByAnyData } = similarByAny;

  const similarByNumber = useQuery(
    {
      queryKey: [
        'contacts-similar',
        'similarBy:number',
        JSON.stringify(contacts),
      ],
      // biome-ignore lint/style/noNonNullAssertion: contacts are set in the enabled condition
      queryFn: () => scan(contacts!, 'number'),
      enabled:
        queryEnabled.number &&
        contacts !== undefined &&
        contactsStatus === 'fetched',
      experimental_prefetchInRender: true,
      placeholderData: [],
    },
    queryClient
  );
  const { data: similarByNumberData } = similarByNumber;

  const similarByName = useQuery(
    {
      queryKey: [
        'contacts-similar',
        'similarBy:name',
        JSON.stringify(contacts),
      ],
      // biome-ignore lint/style/noNonNullAssertion: contacts are set in the enabled condition
      queryFn: () => scan(contacts!, 'name'),
      enabled:
        queryEnabled.name &&
        contacts !== undefined &&
        contactsStatus === 'fetched',
      experimental_prefetchInRender: true,
      placeholderData: [],
    },
    queryClient
  );
  const { data: similarByNameData } = similarByName;

  const groupsSimilarBy = {
    get any() {
      if (!queryEnabled.any) {
        setQueryEnabled((prev) => ({ ...prev, any: true }));
      }
      return similarByAnyData as Contacts.Contact[][];
    },
    get number() {
      if (!queryEnabled.number) {
        setQueryEnabled((prev) => ({ ...prev, number: true }));
      }
      return similarByNumberData as Contacts.Contact[][];
    },
    get name() {
      if (!queryEnabled.name) {
        setQueryEnabled((prev) => ({ ...prev, name: true }));
      }
      return similarByNameData as Contacts.Contact[][];
    },
  };

  const cleanUp = async (
    selectedContacts: Contacts.Contact[],
    similarGroups: Contacts.Contact[][]
  ) => {
    const processed = getMergedContacts(selectedContacts, similarGroups);
    try {
      for (const c of processed) {
        if (c?.merged?.id) {
          await Contacts.updateContactAsync(
            c.merged as Contacts.Contact & { id: string }
          );
        }
        for (const id of c.deleteIds) {
          if (id) {
            await Contacts.removeContactAsync(id);
          }
        }
      }
    } catch (error) {
      console.error('Error merging contacts', error);
    } finally {
      await refetchContacts();
    }
  };

  return {
    groupsSimilarBy,
    isScanningForSimilarContacts:
      similarByAny.isFetching ||
      similarByNumber.isFetching ||
      similarByName.isFetching,
    similarContactsScanProgress: percentCompleted,
    mergeAndDeleteSimilarContacts: cleanUp,
    getMergedContacts,
  };
}
