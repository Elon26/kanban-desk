import { Env } from '@kirz/expo-env';
import { usePurchases } from '@kirz/expo-toolkit';
import { useCallback, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

import { useWebViewModal } from './hooks/use-web-view-modal';

export function PaywallExtendedButtons() {
  const selectedLang = useStorageValue('selectedLang');
  const modal = useModal<ModalStackParams>();
  const closeModal = useCallback(() => modal.closeModal('Paywall'), [modal]);
  const { openModal: openWebViewModal } = useWebViewModal();

  const { restorePurchases } = usePurchases();

  const [isRestoring, setIsRestoring] = useState(false);
  return (
    <View className="flex-row flex-wrap gap-4">
      <TouchableOpacity
        className="flex-[.5] basis-1/3 flex-row items-center justify-between px-4 py-6"
        onPress={() => openWebViewModal(Env.PRIVACY_POLICY)}
      >
        <UiText className="font-semibold">Privacy Policy</UiText>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-[.5] basis-1/3 flex-row items-center justify-between px-4 py-6"
        onPress={() => openWebViewModal(Env.TERMS_OF_USE)}
      >
        <UiText className="font-semibold">Terms of Use</UiText>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 basis-full flex-row items-center justify-between px-4 py-6"
        onPress={async () => {
          setIsRestoring(true);
          const result = await restorePurchases();
          if (result) {
            Alert.alert(
              langs[selectedLang].alerts.success,
              langs[selectedLang].alerts.purchase_restored
            );
            closeModal();
          } else {
            Alert.alert(
              langs[selectedLang].alerts.error,
              langs[selectedLang].alerts.nothing_to_restore
            );
          }
          setIsRestoring(false);
        }}
        disabled={isRestoring}
        style={{ opacity: isRestoring ? 0.5 : 1 }}
      >
        <UiText className="font-semibold">
          {isRestoring ? 'Restoring...' : 'Restore Purchases'}
        </UiText>
      </TouchableOpacity>
    </View>
  );
}
