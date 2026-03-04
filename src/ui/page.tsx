import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

type Props = SafeAreaViewProps & { noSaveArea?: boolean };

export function Page({ children, className, noSaveArea, ...props }: Props) {
  return (
    <View className="flex-1">
      <SafeAreaView {...props} className={twMerge('flex-1 bg-background px-edge', className)}>
        <StatusBar style="dark" />
        {children}
      </SafeAreaView>
    </View>
  );
}
