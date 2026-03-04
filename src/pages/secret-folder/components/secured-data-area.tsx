import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import { useStorage } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function SecuredDataArea() {
  const selectedLang = useStorageValue('selectedLang');
  const [securedDataPercent, setSecuredDataPercent] =
    useStorage('securedDataPercent');
  const [lastSecureAction, setLastSecureAction] =
    useStorage('lastSecureAction');

  useEffect(() => {
    measureHeight();
    if (securedDataPercent > 0) {
      const isLastSmartCleanWasTooLongAgo =
        Date.now() - lastSecureAction > 1000 * 60 * 60 * 24 * 7;
      if (isLastSmartCleanWasTooLongAgo) {
        setSecuredDataPercent((prev) => prev - 10);
        setLastSecureAction(Date.now());
      }
    }
  }, []);

  const viewRef = useRef<View>(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const measureHeight = () => {
    viewRef.current?.measure((x, y, width, height) => {
      setCurrentHeight(height);
    });
  };

  return (
    <View
      className="justify-end rounded-4xl bg-white/10 p-2"
      style={{ width: scaleX(116) }}
      ref={viewRef}
    >
      <View
        className="justify-center rounded-4xl bg-blue"
        style={{
          height: ((currentHeight - scaleY(20)) * securedDataPercent) / 100,
        }}
      >
        {securedDataPercent >= 30 && (
          <View className="items-center gap-y-1 w-full">
            <View className="flex-row items-end">
              <UiText className="text-3xl font-semibold">
                {securedDataPercent}
              </UiText>
              <UiText className="text-lg font-medium pb-1">%</UiText>
            </View>
            <UiText className="text-sm">
              {langs[selectedLang].pages.secret_folder.secured_data}
            </UiText>
          </View>
        )}
      </View>
      {securedDataPercent < 30 && (
        <View className="absolute items-center gap-y-1 left-2 top-2 w-full">
          <View className="flex-row items-end">
            <UiText className="text-3xl font-semibold">
              {securedDataPercent}
            </UiText>
            <UiText className="text-lg font-medium pb-1">%</UiText>
          </View>
          <UiText className="text-sm">
            {langs[selectedLang].pages.secret_folder.secured_data}
          </UiText>
        </View>
      )}
    </View>
  );
}
