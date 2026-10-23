import { useEffect, useState } from 'react';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorScreen } from '@/components/ErrorScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StudyTimer } from '@/features/profile/useStudyTimer';
import { ChestHost } from '@/features/journey/ui/ChestHost';
import { ToastHost } from '@/features/journey/ui/ToastHost';
import { useReminderSync } from '@/features/reminders/useReminderSync';
import { remainingLoadingMs } from '@/lib/loading';
import { useProgressStore } from '@/store';
import { playSfx, preloadSfx } from '@/lib/sfx';
import { fontAssets, ThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** O expo-router mostra isto no lugar de uma tela quebrada. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <ErrorScreen retry={retry} />;
}

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
  // A cor de fundo da janela segue o tema: sem isso aparece um clarão branco ao abrir o teclado ou girar a tela.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
  }, [colors.background]);
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          freezeOnBlur: true,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="lesson/[id]" />
        <Stack.Screen name="review" />
        <Stack.Screen name="mixed" />
        <Stack.Screen name="placement" />
        <Stack.Screen name="welcome" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="mochi" />
        <Stack.Screen name="rescue" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  useReminderSync();

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
          <StudyTimer>
            <ThemedStack />
            <ToastHost />
            <ChestHost />
            <LoadingGate />
          </StudyTimer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
