import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { usePowerState } from '@kirz/react-native-device-info';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function BatteryArea() {
  const selectedLang = useStorageValue('selectedLang');

  const { batteryLevel, batteryState } = usePowerState();

  const [currentBatteryLevel, setCurrentBatteryLevel] = useState(
    batteryState === 'unknown' || !batteryLevel
      ? 0
      : Math.round((batteryLevel ?? 0) * 100)
  );

  useEffect(() => {
    setCurrentBatteryLevel(
      batteryState === 'unknown' || !batteryLevel
        ? 0
        : Math.round((batteryLevel ?? 0) * 100)
    );
  }, [batteryLevel]);

  const viewRef = useRef<View>(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const measureHeight = () => {
    viewRef.current?.measure((x, y, width, height) => {
      setCurrentHeight(height);
    });
  };

  useEffect(() => {
    measureHeight();
  }, []);

  return (
    <TouchableOpacity
      className="justify-end rounded-4xl bg-white/10 p-2"
      style={{ width: scaleX(116) }}
      ref={viewRef}
      onPress={() => router.navigate('/system-info/battery-info')}
    >
      <View
        className="justify-center rounded-4xl bg-blue"
        style={{
          height: (currentHeight - scaleY(20)) * (currentBatteryLevel / 100),
        }}
      >
        {currentBatteryLevel >= 30 && (
          <View className="items-center gap-y-1 w-full">
            <View className="flex-row items-end">
              <UiText className="text-3xl font-semibold">
                {currentBatteryLevel}
              </UiText>
              <UiText className="text-lg font-medium pb-1">%</UiText>
            </View>
            <UiText className="text-sm">
              {langs[selectedLang].pages.settings.battery}
            </UiText>
          </View>
        )}
      </View>
      {currentBatteryLevel < 30 && (
        <View className="absolute items-center gap-y-1 left-2 top-2 w-full">
          <View className="flex-row items-end">
            <UiText className="text-3xl font-semibold">
              {currentBatteryLevel}
            </UiText>
            <UiText className="text-lg font-medium pb-1">%</UiText>
          </View>
          <UiText className="text-sm">
            {langs[selectedLang].pages.settings.battery}
          </UiText>
        </View>
      )}
    </TouchableOpacity>
  );
}
