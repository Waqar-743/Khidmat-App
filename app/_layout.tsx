import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/constants';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash after a short delay (fonts are system/default)
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={Colors.primaryContainer} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="intent-confirm" options={{ presentation: 'modal' }} />
        <Stack.Screen name="provider-list" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="negotiation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="agent-logs" options={{ presentation: 'modal' }} />
        <Stack.Screen name="booking-summary" options={{ presentation: 'modal' }} />
        <Stack.Screen name="help-support" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
