import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ToastHost } from '@/features/journey/ui/ToastHost';
import { remainingLoadingMs } from '@/lib/loading';
import { useProgressStore } from '@/store';
import { playSfx, preloadSfx } from '@/lib/sfx';
import { fontAssets, ThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** Quando o app começou a abrir; o carregamento das fontes conta para o tempo da tela de carregamento. */
const APP_START = Date.now();

/** Mantém a tela de carregamento animada por cima do app durante o tempo mínimo e a remove com um fade. */
function LoadingGate() {
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDone(true), remainingLoadingMs(Date.now() - APP_START, reduceMotion));
    return () => clearTimeout(id);
  }, [reduceMotion]);

  return done ? null : <LoadingScreen />;
}

function ThemedStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="lesson/[id]" />
        <Stack.Screen name="review" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="mochi" />
        <Stack.Screen name="rescue" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      preloadSfx();
      playSfx('open');
      // Abrir o app conta como dia de estudo e dá o bônus diário (e oferece salvar a sequência, se for o caso).
      useProgressStore.getState().openApp();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedStack />
          <ToastHost />
          <LoadingGate />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
