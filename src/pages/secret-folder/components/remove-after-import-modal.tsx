import { scaleX } from '@kirz/nativewind-scale';
import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function RemoveAfterImportModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'RemoveAfterImportModal'>) {
  const selectedLang = useStorageValue('selectedLang');
  const { width } = useWindowDimensions();
  const deleteImported = () => params?.resolve('delete');
  const later = () => params?.resolve('later');

  return (
    <View
      className="rounded-3xl bg-[#2d2532] gap-y-3 p-3"
      style={{ width: width - scaleX(40) }}
    >
      <UiText className="text-center font-medium">
        {
          langs[selectedLang].modals.remove_after_import_modal
            .remove_after_import
        }
      </UiText>
      <View className="rounded-3xl bg-white/15 gap-y-4 p-4">
        <UiText className="text-sm font-medium">
          {langs[selectedLang].modals.remove_after_import_modal.files_deleted}
        </UiText>
      </View>
      <View className="flex-row gap-x-3">
        <Pressable className="w-[97px] items-center py-3" onPress={later}>
          <UiText className="capitalize">{langs[selectedLang].later}</UiText>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-3xl bg-blue py-3"
          onPress={deleteImported}
        >
          <UiText className="capitalize">{langs[selectedLang].remove}</UiText>
        </Pressable>
      </View>
    </View>
  );
}
