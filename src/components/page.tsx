import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { View } from 'react-native';

export function Page({ children }: { children: ReactNode }) {
  return (
    <View className="bg-background h-full w-full">
      <StatusBar style="light" />
      {children}
    </View>
  );
}
