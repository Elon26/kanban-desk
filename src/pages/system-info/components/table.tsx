import { scaleY } from '@kirz/nativewind-scale';
import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/config/theme';
import { UiText } from '@/ui/ui-text';

type TableProps = ViewProps;

export function Table({ children, ...props }: TableProps) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollView
        alwaysBounceVertical={false}
        {...props}
        className="flex-1 overflow-visible"
        contentContainerClassName="px-2.5 pt-6 gap-2"
        contentContainerStyle={{
          paddingBottom: insets.bottom || scaleY(24),
        }}
      >
        {children}
      </ScrollView>
    </>
  );
}

type RowGroupProps = PropsWithChildren<{
  label?: string;
}>;

export function RowGroup({ label, children }: RowGroupProps) {
  return (
    <View className="rounded-3xl bg-white/10 gap-y-4 p-5">
      {label && (
        <UiText className="text-sm font-medium text-gray">{label}</UiText>
      )}
      {children}
    </View>
  );
}

type RowProps = {
  label: string;
  value?: string;
  isLoading?: boolean;
};

export function Row({ label, value, isLoading }: RowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <UiText className="font-medium" numberOfLines={1}>
        {label}
      </UiText>
      {isLoading ? (
        <ActivityIndicator color={colors.primary.toString()} />
      ) : (
        <UiText className="text-sm text-gray" numberOfLines={1}>
          {value}
        </UiText>
      )}
    </View>
  );
}
