import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

export function TitleArea({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="pb-10 pt-5">
      <UiText className="text-center text-4xl font-bold text-primary mb-2.5">
        {title}
      </UiText>
      {subtitle && (
        <UiText className="text-center font-medium text-primary">
          {subtitle}
        </UiText>
      )}
    </View>
  );
}
