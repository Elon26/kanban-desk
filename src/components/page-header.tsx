import { RelativePathString, router } from 'expo-router';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackIcon from '@/svg/back.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  pageName: string;
  rightButtonLabel?: string;
  rightButtonHandler?: () => void;
  rightButtonColor?: string;
  bigRightButton?: boolean;
  customBack?: RelativePathString;
};

export function PageHeader({
  pageName,
  rightButtonLabel,
  rightButtonHandler,
  rightButtonColor,
  bigRightButton,
  customBack,
}: Props) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="z-30 flex-row items-center justify-between h-7.5">
      <Pressable
        className="flex-row items-center rounded-2xl bg-white/10"
        onPress={() => router.back()}
      >
        <View className="items-center justify-center rounded-full bg-white/15 size-7.5">
          <BackIcon />
        </View>
        <UiText className="text-sm capitalize px-2">
          {langs[selectedLang].back}
        </UiText>
      </Pressable>
      <UiText className="text-lg font-semibold">{pageName}</UiText>
      {rightButtonLabel && rightButtonHandler ? (
        <Pressable
          className="flex-row items-center justify-center rounded-2xl h-full"
          style={{
            backgroundColor: rightButtonColor || '#ffffff15',
            width: bigRightButton ? 115 : 85,
          }}
          onPress={rightButtonHandler}
        >
          <UiText className="text-sm">{rightButtonLabel}</UiText>
        </Pressable>
      ) : (
        <View className="w-[75px]" />
      )}
    </View>
  );
}
