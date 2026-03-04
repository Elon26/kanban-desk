/* eslint-disable tailwindcss/no-custom-classname */
import { LinearGradient } from 'expo-linear-gradient';
import { requestReview } from 'expo-store-review';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Container } from '@/components/container';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import StarIcon from '@/svg/about/star.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  closeModal: () => void;
};

export default function RateModal({ closeModal }: Props) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut}
      className="fade absolute h-screen w-screen items-center justify-center bg-black/30"
    >
      <Container>
        <View className="items-center justify-center h-full w-full">
          <View className="overflow-hidden rounded-3xl -top-8">
            <LinearGradient
              colors={['#1d171d', '#3f3541']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <View className="gap-y-3 p-3">
                <UiText className="text-center font-medium">
                  {langs[selectedLang].modals.rate_modal.rate_us}
                </UiText>
                <View className="items-center rounded-3xl bg-white/10 gap-y-4 p-4">
                  <StarIcon />
                  <UiText className="text-center text-sm font-medium">
                    {langs[selectedLang].modals.rate_modal.thanks}
                  </UiText>
                </View>
                <View className="flex-row gap-x-3">
                  <Pressable
                    className="w-[97px] items-center capitalize py-3"
                    onPress={closeModal}
                  >
                    <UiText>{langs[selectedLang].cancel}</UiText>
                  </Pressable>
                  <Pressable
                    className="flex-1 items-center rounded-3xl bg-blue py-3"
                    onPress={requestReview}
                  >
                    <UiText>
                      {langs[selectedLang].modals.rate_modal.rate}
                    </UiText>
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Container>
    </Animated.View>
  );
}
