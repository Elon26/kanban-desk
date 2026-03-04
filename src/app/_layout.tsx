import '../../global.css';

import { Stack } from 'expo-router';

import app from '@/root';

function Wrapper() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
      <Stack.Screen name="about" />
      <Stack.Screen name="contacts-cleaner" />
      <Stack.Screen name="gallery-cleaner" />
    </Stack>
  );
}

const RootWrapper = app.wrapLayout(Wrapper);

export default function RootLayout() {
  return <RootWrapper />;
}
