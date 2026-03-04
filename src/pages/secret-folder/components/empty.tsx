import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import FolderCrossIcon from '@/svg/folder-cross.svg';
import { UiText } from '@/ui/ui-text';

export function EmptyComponent() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="flex-1 items-center justify-center gap-y-2 bottom-10">
      <FolderCrossIcon />
      <UiText className="text-center color-gray">
        {langs[selectedLang].nothing_found}
      </UiText>
    </View>
  );
}
