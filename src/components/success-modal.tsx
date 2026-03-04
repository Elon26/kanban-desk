import { Image } from 'expo-image';
import { useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';

import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BowlsImage from '@/images/bowls.png';
import { useContactsCleaner } from '@/pages/contacts-cleaner/hooks/use-contacts-cleaner';
import { Btn } from '@/ui/button';
import { UiText } from '@/ui/ui-text';

import { ModalStackParams } from './modals';
import { PageBackground } from './page-background';

export function SuccessModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SuccessModal'>) {
  const { closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const { isScanningForSimilarContacts } = useContactsCleaner();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View
      className="items-center justify-center bg-black py-8"
      style={{ width, height }}
    >
      <PageBackground />
      <View className="items-center -mt-10">
        <Image className="size-64" source={BowlsImage} style={{}} />
      </View>
      <View className="gap-y-3 mb-8">
        <UiText className="text-center text-3xl font-bold">
          {langs[selectedLang].modals.success_modal.congratulations}
        </UiText>
        <UiText className="text-center text-gray">
          {langs[selectedLang].modals.success_modal.better}
        </UiText>
      </View>
      <UiText className="text-center text-xl font-medium mb-3">
        {langs[selectedLang].modals.success_modal.able}
      </UiText>
      <View className="rounded-2xl bg-white/10 mx-10 mb-15 py-3">
        <View className="flex-row justify-center gap-x-1 mx-10">
          <UiText className="font-semibold color-[#81F763]">
            {params?.filesQuantity || '0'}
            {params?.filesQuantity === 1
              ? langs[selectedLang].file
              : langs[selectedLang].files}
          </UiText>
          <UiText className="text-gray">
            {langs[selectedLang].modals.success_modal.taking}
          </UiText>
        </View>
        <View className="h-[1px] bg-white/10 my-2" />
        <View className="flex-row justify-center gap-x-1 mx-10">
          <UiText className="font-semibold color-[#81F763]">
            {params?.freedSpace || `0 ${langs[selectedLang].bytes}`}
          </UiText>
          <UiText className="text-gray">
            {langs[selectedLang].modals.success_modal.space}
          </UiText>
        </View>
      </View>
      <View className="px-10 w-full">
        {isScanningForSimilarContacts ? (
          <Btn
            size="big"
            label={langs[selectedLang].buttons.updating}
            handler={() => {}}
            disabled
          />
        ) : (
          <Btn
            size="big"
            label={langs[selectedLang].buttons.continue}
            handler={() => closeModal('SuccessModal')}
          />
        )}
      </View>
    </View>
  );
}
