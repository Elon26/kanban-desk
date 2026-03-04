import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import CircleDiagram from '@/pages/main/components/circle-diagram';
import { UiText } from '@/ui/ui-text';

type Props = {
  Icon: React.FC<SvgProps>;
  label: string;
  percentage: number;
};

export default function SystemItem({ Icon, label, percentage }: Props) {
  return (
    <View className="-mx-2">
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
    </View>
  );
}
