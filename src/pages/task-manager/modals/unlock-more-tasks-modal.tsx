import { scaleX } from '@kirz/nativewind-scale';
import { useWindowDimensions, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import { useModals } from '@/hooks/use-modals';

export function UnlockMoreTasksModal() {
  const selectedLang = useStorageValue('selectedLang');
  const { width } = useWindowDimensions();
  const { showPaywall } = usePaywall();
  const { closeModal } = useModals();

  return (
    <View
      className="rounded-3xl bg-[#2d2532] gap-y-3 p-3"
      style={{ width: width - scaleX(20) }}
    >
      <UiText className="text-center font-medium">
        {langs[selectedLang].modals.unlock_more_tasks_modal.unlock}
      </UiText>
      <View className="rounded-3xl bg-white/15 gap-y-4 p-4">
        <UiText className="text-sm font-medium">
          {langs[selectedLang].modals.unlock_more_tasks_modal.limit}
        </UiText>
      </View>
      <View className="flex-row gap-x-3">
        <Pressable
          className="w-[97px] items-center capitalize py-3"
          onPress={() => closeModal('UnlockMoreTasksModal')}
        >
          <UiText>{langs[selectedLang].cancel}</UiText>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-3xl bg-blue py-3"
          onPress={() => showPaywall()}
        >
          <UiText>{langs[selectedLang].get_premium}</UiText>
        </Pressable>
      </View>
    </View>
  );
}
