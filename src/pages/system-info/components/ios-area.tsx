import { getDeviceName } from '@kirz/react-native-device-info';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import AppleIcon from '@/svg/apple.svg';
import BackIcon from '@/svg/back.svg';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';

export function IosArea() {
  const deviceName = usePromise(getDeviceName());

  return (
    <View className="flex-1 rounded-4xl bg-white/10">
      <View className="flex-1 overflow-hidden mx-3">
        <TouchableOpacity
          onPress={() => {
            router.navigate('/system-info/operating-system');
          }}
        >
          <View className="flex-1 flex-row items-center justify-between gap-x-3 py-3">
            <View className="flex-1 flex-row items-center gap-x-2">
              <View
                className="items-center justify-center rounded-full size-8"
                style={{ backgroundColor: '#BBB8ED' }}
              >
                <AppleIcon />
              </View>
              <UiText className="flex-1 text-lg font-medium" numberOfLines={1}>
                {deviceName}
              </UiText>
            </View>
            <View className="items-center justify-center rounded-full bg-white/15 size-7.5">
              <BackIcon className="rotate-180" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
