import { ActivityIndicator, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackIcon from '@/svg/back.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { numberInnerWrapper } from '@/utils/number-inner-wrapper';

type Props = {
  Icon: React.FC;
  handler: () => void;
  quantity: number | null;
  color: 'purple' | 'yellow';
  hasPremium: boolean;
  isLoading: boolean;
};

export default function CleanerItem({
  handler,
  Icon,
  quantity,
  color = 'purple',
  hasPremium,
  isLoading,
}: Props) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <Pressable
      className="flex-row items-center justify-between"
      onPress={isLoading ? () => {} : handler}
    >
      <View className="flex-row items-center gap-x-2">
        <View
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={twMerge(
            'size-[31px] items-center justify-center rounded-full',
            color === 'purple' ? 'bg-[#BBB8ED]' : 'bg-[#FAD1A3]'
          )}
        >
          <Icon />
        </View>
        <View className="flex-row items-end">
          {isLoading && (
            <View className="absolute z-10 items-center justify-center rounded-3xl bg-black/80 -bottom-1 h-full w-full">
              <ActivityIndicator />
            </View>
          )}
          <UiText className="font-medium">
            {quantity
              ? numberInnerWrapper(quantity)
              : quantity === 0
                ? '0'
                : 'N/A'}
          </UiText>
          <UiText className="text-xs color-gray">
            {' '}
            {quantity !== 1
              ? langs[selectedLang].files
              : langs[selectedLang].file}
          </UiText>
        </View>
      </View>

      <View className="size-[30px] items-center justify-center rounded-full bg-white/10">
        <View>
          <View className="rotate-180">
            <BackIcon />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
