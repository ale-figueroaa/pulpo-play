import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// 1. Cambiamos el anchor para que la app sepa que el punto de partida 
// cuando se gestionen redirecciones iniciales pueda considerar el flujo de auth.
export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 2. Registramos el grupo de autenticación como la pantalla inicial */}
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