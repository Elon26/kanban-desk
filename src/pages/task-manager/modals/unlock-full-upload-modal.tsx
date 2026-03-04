import { scaleX } from '@kirz/nativewind-scale';
import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import type { ModalStackParams } from '@/components/modals';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function UnlockFullUploadModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'UnlockFullUploadModal'>) {
  const selectedLang = useStorageValue('selectedLang');
  const { width } = useWindowDimensions();
  const getPremium = () => params?.resolve('getPremium');
  const continueFunc = () => params?.resolve('continue');

  return (
    <View
      className="rounded-3xl bg-[#2d2532] gap-y-3 p-3"
      style={{ width: width - scaleX(40) }}
    >
      <UiText className="text-center font-medium">
        {langs[selectedLang].get_premium}
      </UiText>
      <View className="rounded-3xl bg-white/15 gap-y-4 p-4">
        <UiText className="text-sm font-medium">
          {langs[selectedLang].modals.unlock_full_upload_modal.limit}
        </UiText>
      </View>
      <View className="flex-row gap-x-3">
        <Pressable
          className="w-[97px] items-center py-3"
          onPress={continueFunc}
        >
          <UiText>
            {langs[selectedLang].modals.unlock_full_upload_modal.continue}
          </UiText>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-3xl bg-blue py-3"
          onPress={getPremium}
        >
          <UiText>{langs[selectedLang].get_premium}</UiText>
        </Pressable>
      </View>
    </View>
  );
}
