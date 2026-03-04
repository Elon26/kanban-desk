import { View } from 'react-native';

import BackIcon from '@/svg/back.svg';
import FingerIcon from '@/svg/finger.svg';
import KeyIcon from '@/svg/key-big.svg';
import SystemInfoIcon from '@/svg/system-info.svg';
import { UiText } from '@/ui/ui-text';
import { scaleY } from '@kirz/nativewind-scale';
import { Pressable } from '@/ui/pressable';
import { router } from 'expo-router';
import { usePinSettings } from 'expo-with-pincode';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function HandLinksArea() {
  const selectedLang = useStorageValue('selectedLang');
  const { isPincodeSet } = usePinSettings();

  return (
    <View className="flex-row items-center">
      <Pressable
        className="flex-1 items-center justify-center rounded-2xl bg-white/10"
        style={{ height: scaleY(116) }}
        onPress={() => router.navigate('/system-info')}
      >
        <SystemInfoIcon className="mb-3" />
        <UiText className="text-sm mb-1">
          {langs[selectedLang].pages.secret_folder.check_system}
        </UiText>
        <UiText className="text-xs text-gray">
          {langs[selectedLang].pages.secret_folder.in_system_info}
        </UiText>
      </Pressable>
      <View>
        <View className="z-20 flex-row items-center rounded-full bg-[#160519] gap-x-0.5 -mx-4 px-1 py-4">
          <View>
            <BackIcon />
          </View>
          <View className="items-center justify-center rounded-full bg-white size-9">
            <FingerIcon />
          </View>
          <View>
            <View className="rotate-180">
              <BackIcon />
            </View>
          </View>
        </View>
      </View>
      {isPincodeSet ? (
        <Pressable
          className="flex-1 items-center justify-center rounded-2xl bg-white/10"
          style={{ height: scaleY(116) }}
          onPress={() => router.navigate('/set-pin')}
        >
          <KeyIcon className="mb-3" />
          <UiText className="text-sm mb-1">
            {langs[selectedLang].pages.secret_folder.change_password}
          </UiText>
          <UiText className="text-xs text-gray">
            {langs[selectedLang].pages.secret_folder.enhance_protection}
          </UiText>
        </Pressable>
      ) : (
        <Pressable
          className="flex-1 items-center justify-center rounded-2xl bg-white/10"
          style={{ height: scaleY(116) }}
          onPress={() => router.navigate('/set-pin')}
        >
          <KeyIcon className="mb-3" />
          <UiText className="text-sm mb-1">
            {langs[selectedLang].pages.secret_folder.add_password}
          </UiText>
          <UiText className="text-xs text-gray">
            {langs[selectedLang].pages.secret_folder.use_autofill}
          </UiText>
        </Pressable>
      )}
    </View>
  );
}
