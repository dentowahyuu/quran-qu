import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#2d6a4f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen name="index" options={{ title: 'Al-Qur\'an Digital' }} />
      <Stack.Screen name="detail/[id]" options={{ title: 'Detail Surah' }} />
    </Stack>
  );
}