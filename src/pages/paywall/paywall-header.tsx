import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import type { ModalStackParams } from '@/components/modals';
import CloseIcon from '@/svg/back.svg';
import { usePurchases } from '@kirz/expo-toolkit';
import { UiText } from '@/ui/ui-text';
import { usePaywall } from './hooks/use-paywall';

export function PaywallHeader({
  onRestore,
  isLoading,
}: {
  onRestore?: () => void;
  isLoading?: boolean;
}) {
  const { hidePaywall } = usePaywall();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="flex-row items-center justify-between mb-2">
      <TouchableOpacity disabled={isLoading} onPress={onRestore}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <UiText className="text-sm text-[#64656D]">
            {langs[selectedLang].pages.paywall.restore_purchase}
          </UiText>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={hidePaywall}>
        <CloseIcon />
      </TouchableOpacity>
    </View>
  );
}
