import type * as Contacts from 'expo-contacts';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { UiText } from '@/ui/ui-text';

type AnagramProps = {
  contact: Contacts.Contact;
  className?: string;
};

export function Anagram({ contact, className }: AnagramProps) {
  const hasFirstAndLastName = contact.firstName && contact.lastName;
  const hasTwoWords = contact.name?.split(' ').length === 2;
  const hasName = contact.name;
  const hasFirstName = contact.firstName;

  const anagram = hasFirstAndLastName
    ? `${contact.firstName?.[0]}.${contact.lastName?.[0]}.`
    : hasTwoWords
      ? `${contact.name?.split(' ')[0][0]}.${contact.name?.split(' ')[1][0]}.`
      : `${(hasName ?? hasFirstName ?? 'U')[0]}.`;

  return (
    <View
      className={twMerge(
        'items-center justify-center rounded-full bg-gray p-2 size-10',
        className
      )}
    >
      <UiText
        className="text-center text-4xl uppercase text-primary/50"
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {anagram}
      </UiText>
    </View>
  );
}
