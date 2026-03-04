import { UiText } from '@/ui/ui-text';
import { View } from 'react-native';
import UnlockIcon from '@/svg/paywall/unlock.svg';
import RingIcon from '@/svg/paywall/ring.svg';
import MedalIcon from '@/svg/paywall/medal.svg';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function TariffDiagram() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="flex-row gap-x-1 px-2 my-6">
      <View className="gap-y-2">
        <View className="items-center justify-center rounded-full bg-[#533866] size-11">
          <UnlockIcon />
        </View>
        <UiText className="font-medium color-[#81F763]">
          {langs[selectedLang].pages.paywall.trial_descriptions.first.title}
        </UiText>
      </View>
      <View className="flex-1 rounded-full bg-[#81F763] mt-4.5 h-2" />
      <View className="gap-y-2">
        <View className="items-center justify-center rounded-full bg-[#533866] size-11">
          <RingIcon />
        </View>
        <UiText className="font-medium color-[#81F763]">
          {langs[selectedLang].pages.paywall.trial_descriptions.second.title}
        </UiText>
      </View>
      <View className="flex-1 rounded-full bg-[#81F763] mt-4.5 h-2" />
      <View className="gap-y-2">
        <View className="items-center justify-center rounded-full bg-[#533866] size-11">
          <MedalIcon />
        </View>
        <UiText className="font-medium color-[#81F763]">
          {langs[selectedLang].pages.paywall.trial_descriptions.third.title}
        </UiText>
      </View>
    </View>
  );
}
