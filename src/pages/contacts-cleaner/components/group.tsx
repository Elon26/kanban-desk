import { Contact } from 'expo-contacts';
import { View } from 'react-native';

import { Anagram } from '@/components/anagram';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';

import { GroupItem } from './group-item';

type Props = {
  group: Contact[];
  groupIsSelected: boolean;
  itemIsSelected: (groupItem: Contact) => boolean;
  toggleGroupSelection: (group: Contact[]) => void;
  toggleItemSelection: (groupItem: Contact) => void;
};

export function Group({
  group,
  groupIsSelected,
  itemIsSelected,
  toggleGroupSelection,
  toggleItemSelection,
}: Props) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="rounded-3xl bg-white/10 p-3">
      <View className="flex-row items-center justify-between gap-x-4 px-2 mb-3 w-full">
        <View className="flex-1 flex-row gap-x-2">
          <Anagram contact={group[0]} />
          <View className="flex-1 gap-y-1">
            <UiText className="font-medium" numberOfLines={1}>
              {group[0].name}
            </UiText>
            <UiText className="text-xs font-medium text-gray">
              {group[0].phoneNumbers && group[0].phoneNumbers[0].digits}
            </UiText>
          </View>
        </View>
        <View className="flex-none w-24">
          <Checkbox
            label={langs[selectedLang].page_names.select_all}
            checked={groupIsSelected}
            onChange={() => toggleGroupSelection(group)}
          />
        </View>
      </View>
      <View className="rounded-3xl bg-white/10 px-4 py-3">
        {group.map((groupItem, index) => (
          <GroupItem
            key={groupItem.id}
            groupItem={groupItem}
            itemIsSelected={itemIsSelected(groupItem)}
            toggleItemSelection={toggleItemSelection}
            isLastItem={index === group.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
