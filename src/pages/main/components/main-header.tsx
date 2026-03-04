import { Env } from '@kirz/expo-env';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import BurgerIcon from '@/svg/burger.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  hasPremium: boolean;
};

export default function MainHeader({ hasPremium }: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const { showPaywall } = usePaywall();

  return (
    <View className="flex-row items-center justify-between mb-3">
      <Pressable
        className="size-[34px] items-center justify-center rounded-full bg-white/10"
        onPress={() => router.navigate('/about')}
      >
        <BurgerIcon />
      </Pressable>
      <UiText className="text-xl font-bold">{Env.APP_NAME}</UiText>
      {hasPremium ? (
        <View className="h-[21px] w-[49px] items-center justify-center overflow-hidden rounded-full">
          <LinearGradient
            colors={['#2265B2', '#ED26EA']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UiText className="text-2xs font-bold">
              {langs[selectedLang].pro}
            </UiText>
          </LinearGradient>
        </View>
      ) : (
        <Pressable
          className="h-[21px] w-[49px] items-center justify-center rounded-full bg-white/10"
          onPress={() => showPaywall()}
        >
          <UiText className="text-2xs font-bold">
            {langs[selectedLang].free}
          </UiText>
        </Pressable>
      )}
    </View>
  );
}
