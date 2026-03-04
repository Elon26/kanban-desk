import type * as Contacts from 'expo-contacts';
import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type AnagramProps = {
  contact: Contacts.Contact;
};

export function Anagram({ contact }: AnagramProps) {
  const hasFirstAndLastName = contact.firstName && contact.lastName;
  const hasTwoWords = contact.name?.split(' ').length === 2;
  const hasName = contact.name;
  const hasFirstName = contact.firstName;

  const anagram = hasFirstAndLastName
    ? `${contact.firstName?.[0]}${contact.lastName?.[0]}`
    : hasTwoWords
      ? `${contact.name?.split(' ')[0][0]}${contact.name?.split(' ')[1][0]}`
      : `${(hasName ?? hasFirstName ?? 'U')[0]}`;

  return (
    <View className="items-center justify-center rounded-full bg-[#A3C9FA] size-9">
      <UiText
        className="text-center font-semibold uppercase text-black"
        numberOfLines={1}
      >
        {anagram}
      </UiText>
    </View>
  );
}
