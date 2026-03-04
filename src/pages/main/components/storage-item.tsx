import { Route, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import CircleDiagram from './circle-diagram';

type Props = {
  Icon: React.FC<SvgProps>;
  label: string;
  hasPremium: boolean;
  percentage: number;
  link: Route;
  isLoading: boolean;
};

export default function StorageItem({
  Icon,
  label,
  hasPremium,
  percentage,
  link,
  isLoading,
}: Props) {
  return (
    <Pressable onPress={() => (isLoading ? {} : router.navigate(link))}>
      <View className="size-[60px] justify-center">
        <CircleDiagram
          size={60}
          numDots={20}
          dotRadius={1}
          percentage={percentage}
        />
        <View className="absolute items-center justify-center h-full w-full">
          <Icon />
        </View>
      </View>
      <UiText className="text-center text-xs text-gray">{label}</UiText>
      {isLoading && (
        <View className="absolute items-center justify-center rounded-xl bg-black/20 inset-0 h-full w-full">
          <ActivityIndicator />
        </View>
      )}
    </Pressable>
  );
}
