import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth.store';
import { registerForPushNotifications } from '@/lib/notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { restore, isAuthenticated } = useAuthStore();

  useEffect(() => {
    restore().then(() => SplashScreen.hideAsync());
    if (isAuthenticated) registerForPushNotifications();
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#E0E5EC" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#E0E5EC' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(parent)" />
        <Stack.Screen name="(student)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
