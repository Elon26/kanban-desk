import { Contact } from 'expo-contacts';
import { Pressable, View } from 'react-native';

import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';

type Props = {
  groupItem: Contact;
  itemIsSelected: boolean;
  isLastItem: boolean;
  toggleItemSelection: (groupItem: Contact) => void;
};

export function GroupItem({
  groupItem,
  itemIsSelected,
  isLastItem,
  toggleItemSelection,
}: Props) {
  return (
    <View>
      <Pressable
        className="flex-row items-center justify-between"
        onPress={() => toggleItemSelection(groupItem)}
      >
        <View className="gap-y-1">
          <UiText className="font-medium">{groupItem.name}</UiText>
          <UiText className="text-xs font-medium text-gray">
            {groupItem.phoneNumbers && groupItem.phoneNumbers[0].digits}
          </UiText>
        </View>
        <Checkbox
          checked={itemIsSelected}
          onChange={() => toggleItemSelection(groupItem)}
        />
      </Pressable>
      {!isLastItem && <View className="h-[1px] bg-white/10 my-2" />}
    </View>
  );
}
