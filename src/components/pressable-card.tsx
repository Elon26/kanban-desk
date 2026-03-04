import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import BackIcon from '@/svg/back.svg';
import LockIcon from '@/svg/lock-small.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type Props = {
  title: string;
  subtitle?: string;
  Icon?: React.FC;
  handler: () => void;
  locked?: boolean;
  classes?: string;
};

export function PressableCard({
  title,
  subtitle,
  Icon,
  handler,
  locked = false,
  classes = '',
}: Props) {
  return (
    <Pressable
      className={twMerge(
        'flex-row items-center rounded-3xl bg-white/10 gap-x-2 p-3',
        classes
      )}
      onPress={handler}
    >
      {Icon && (
        <View className="items-center justify-center rounded-full bg-pink size-9">
          <Icon />
        </View>
      )}
      <View className="flex-1">
        <UiText className="font-medium">{title}</UiText>
        {subtitle && (
          <UiText className="text-xs font-medium color-gray">{subtitle}</UiText>
        )}
      </View>
      {locked ? (
        <View className="items-center justify-center rounded-full bg-white/10 size-9">
          <LockIcon />
        </View>
      ) : (
        <View className="rotate-180 items-center justify-center rounded-full bg-white/10 size-9">
          <BackIcon />
        </View>
      )}
    </Pressable>
  );
}
