import { ThemeProvider } from '@/contexts/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  </SafeAreaView>
  );
}
