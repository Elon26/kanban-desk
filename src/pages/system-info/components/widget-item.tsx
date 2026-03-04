import { Image, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

export function WidgetItem({
  label,
  text,
  img,
}: {
  label: string;
  text: string;
  img: any;
}) {
  return (
    <View className="rounded-3xl bg-white/10 gap-y-4 px-6 py-4">
      <UiText className="text-center text-lg font-bold">{label}</UiText>
      <Image source={img} className="self-center" />
      <UiText className="text-sm text-white">{text}</UiText>
    </View>
  );
}
