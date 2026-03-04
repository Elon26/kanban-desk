import { scaleX } from '@kirz/nativewind-scale';
import { prettyBytes } from '@kirz/react-native-device-info';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { View } from 'react-native';

import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { historyAtom } from '@/pages/speed-test';
import { Btn } from '@/ui/button';
import { ModalWrapper } from '@/ui/modal-wrapper';
import { UiText } from '@/ui/ui-text';

export function SpeedResultsModal() {
  const selectedLang = useStorageValue('selectedLang');
  const modal = useModals();
  const [history] = useAtom(historyAtom);
  const lastResult =
    history.length > 0
      ? history[history.length - 1]
      : { download: 0, upload: 0, timestamp: 0 };

  const formatNumber = (value: string) => value.replace(',', '.');

  return (
    <ModalWrapper className="gap-9 -mb-4 pt-24">
      <View style={{ width: 400 }} className="absolute bottom-0 top-0 h-60">
        <LinearGradient
          style={{ flex: 1, zIndex: 100 }}
          colors={['rgba(61, 147, 242, 0)', 'rgba(61, 147, 242, 0.5)']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </View>

      <UiText className="self-center text-2xl font-medium">
        {langs[selectedLang].pages.speed_test.results}
      </UiText>
      <View className="flex-row items-center justify-evenly px-10">
        <LinearGradient
          colors={['#3D93F2', '#3D93F2']}
          style={{
            width: scaleX(85),
            height: scaleX(85),
            borderRadius: scaleX(100),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        >
          <UiText className="text-2xs font-medium">
            {langs[selectedLang].pages.speed_test.download}
          </UiText>
          <UiText className="text-xl font-semibold">
            {formatNumber(
              prettyBytes(lastResult.download ?? 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                formatter: ({ value }) => value,
              })
            )}
          </UiText>
          <UiText className="text-sm">mb/s</UiText>
        </LinearGradient>
        <View
          style={{
            width: scaleX(85),
            height: scaleX(85),
            borderRadius: scaleX(100),

            backgroundColor: '#b3b3b3',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UiText className="text-2xs font-medium color-black">
            {langs[selectedLang].pages.speed_test.upload}
          </UiText>
          <UiText className="text-xl font-semibold color-black">
            {formatNumber(
              prettyBytes(lastResult.upload ?? 0, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                formatter: ({ value }) => value,
              })
            )}
          </UiText>
          <UiText className="text-sm color-black">mb/s</UiText>
        </View>
      </View>
      <Btn
        size="big"
        label={langs[selectedLang].buttons.continue}
        handler={() => modal.closeAllModals()}
      />
    </ModalWrapper>
  );
}
