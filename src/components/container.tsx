import { scaleY } from '@kirz/nativewind-scale';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Container({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="px-4 h-full w-full"
      style={{ paddingTop: insets.top + scaleY(4) }}
    >
      {children}
    </View>
  );
}
