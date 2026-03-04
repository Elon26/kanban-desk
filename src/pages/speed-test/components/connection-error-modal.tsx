import { scaleX } from '@kirz/nativewind-scale';
import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import type { ModalStackParams } from '@/components/modals';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function ConnectionErrorModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'ConnectionErrorModal'>) {
  const selectedLang = useStorageValue('selectedLang');

  const { width } = useWindowDimensions();
  const retry = () => params?.resolve('retry');
  const back = () => params?.resolve('back');

  return (
    <View
      className="rounded-3xl bg-[#2d2522] gap-y-3 p-2"
      style={{ width: width - scaleX(40) }}
    >
      <UiText className="text-center font-medium">
        {langs[selectedLang].pages.speed_test.connection_error}
      </UiText>
      <View className="rounded-3xl bg-white/15 gap-y-4 p-4">
        <UiText className="text-center text-sm font-medium">
          {langs[selectedLang].pages.speed_test.something_wrong}
        </UiText>
      </View>
      <View className="flex-row gap-x-3">
        <Pressable
          className="w-[97px] items-center capitalize py-3"
          onPress={back}
        >
          <UiText>{langs[selectedLang].back}</UiText>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-3xl bg-blue py-3"
          onPress={retry}
        >
          <UiText>{langs[selectedLang].retry}</UiText>
        </Pressable>
      </View>
    </View>
  );
}
