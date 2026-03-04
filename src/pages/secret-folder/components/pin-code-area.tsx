import { router } from 'expo-router';
import { usePinSettings } from 'expo-with-pincode';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import AttentionIcon from '@/svg/attention.svg';
import BackIcon from '@/svg/back.svg';
import SecuredIcon from '@/svg/secured.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function PinCodeArea() {
  const { isPincodeSet } = usePinSettings();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <Pressable
      className="rounded-2xl bg-white/10 gap-y-3 p-3"
      onPress={() => router.navigate('/set-pin')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-x-2">
          <View
            className="items-center justify-center rounded-full size-9"
            style={{ backgroundColor: isPincodeSet ? '#81F763' : '#F76363' }}
          >
            {isPincodeSet ? <SecuredIcon /> : <AttentionIcon />}
          </View>
          <View>
            <UiText className="text-sm font-medium mb-1">
              {isPincodeSet
                ? langs[selectedLang].pages.secret_folder.data_safe
                : langs[selectedLang].pages.secret_folder.add_pin}
            </UiText>
            <UiText className="text-xs font-medium text-gray">
              {isPincodeSet
                ? langs[selectedLang].pages.secret_folder.change_pin
                : langs[selectedLang].pages.secret_folder.secure_secret_folder}
            </UiText>
          </View>
        </View>
        <View>
          <View className="rotate-180 items-center justify-center rounded-full bg-white/10 size-7.5">
            <BackIcon />
          </View>
        </View>
      </View>
      <View className="rounded-2xl bg-white/10 p-2">
        <UiText className="text-xs">
          {isPincodeSet
            ? langs[selectedLang].pages.secret_folder.data_protected
            : langs[selectedLang].pages.secret_folder.setting_password}
        </UiText>
      </View>
    </Pressable>
  );
}
