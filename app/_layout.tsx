import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      let styleEl = document.getElementById('dynamic-zoom-style');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-zoom-style';
        document.head.appendChild(styleEl);
      }

      // Inject CSS zoom based on 1024px virtual canvas for wide screens.
      // The DOM layout will always act as if the screen is 1024px wide, 
      // preventing any overlaps while scaling up perfectly.
      styleEl.innerHTML = `
        @media (min-width: 1024px) {
          html {
            zoom: calc(100vw / 1024);
          }
        }
      `;
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pantalla inicial Landing Page (solo Web, en móvil redirige a Login) */}
        <Stack.Screen name="index" />

        {/* Registramos el grupo de autenticación */}
        <Stack.Screen name="(auth)" />

        {/* 3. El grupo de pestañas principales queda listo para cuando el pulpo haga login */}
        <Stack.Screen name="(tabs)" />

        {/* 4. Mantenemos el modal por si necesitas usarlo como un pop-up de pausa o logro */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}