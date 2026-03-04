import { scaleX } from '@kirz/nativewind-scale';
import { useWindowDimensions, View } from 'react-native';
import { useModal } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import FaceIdIcon from '@/svg/set-pin-request-modal-face-id.svg';
import LockIcon from '@/svg/set-pin-request-modal-lock.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { router } from 'expo-router';
import langs from '@/i18n/langs.json';
import { useStorageValue } from '@/hooks/use-storage';

export function SetPinRequestModal() {
  const { width } = useWindowDimensions();
  const modal = useModal<ModalStackParams>();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View
      className="rounded-3xl bg-[#2d2532] gap-y-3 p-3"
      style={{ width: width - scaleX(40) }}
    >
      <UiText className="text-center font-medium">
        {langs[selectedLang].pages.secret_folder.protect_secret_folder}
      </UiText>
      <View className="rounded-3xl bg-white/15 gap-y-4 p-4">
        <View className="flex-row justify-center gap-x-4">
          <View className="items-center justify-center rounded-2xl bg-white/20 size-13">
            <FaceIdIcon />
          </View>
          <View className="items-center justify-center rounded-2xl bg-white/20 size-13">
            <LockIcon />
          </View>
        </View>
        <UiText className="text-sm font-medium">
          {langs[selectedLang].pages.secret_folder.folder_delivers}
        </UiText>
      </View>
      <View className="flex-row gap-x-3">
        <Pressable
          className="w-[97px] items-center capitalize py-3"
          onPress={() => modal.closeModal('SetPinRequestModal')}
        >
          <UiText>{langs[selectedLang].later}</UiText>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-3xl bg-blue py-3"
          onPress={() => {
            modal.closeModal('SetPinRequestModal');
            router.navigate('/set-pin');
          }}
        >
          <UiText>
            {langs[selectedLang].pages.secret_folder.add_protection}
          </UiText>
        </Pressable>
      </View>
    </View>
  );
}
