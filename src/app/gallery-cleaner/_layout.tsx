import { Stack } from 'expo-router';

import { colors } from '@/config/theme';

export default function GalleryCleanerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.toString() },
      }}
    />
  );
}
