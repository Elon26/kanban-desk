import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

export function Feature({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <View className="flex-row items-center gap-x-4">
      <Icon />
      <UiText className="flex-1">
        <UiText className="font-semibold">{title}</UiText>
        <UiText className="text-sm text-gray">{description}</UiText>
      </UiText>
    </View>
  );
}
