import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { soundManager } from '../../utils/audio';
import { supabase } from '../../lib/supabase';
import { ensureUsuarioProfile } from '../../utils/db';

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        soundManager.stopBgMusic();
        router.replace('/(auth)/login');
      } else {
        ensureUsuarioProfile(session.user);
      }
    });

    // Revisar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        soundManager.stopBgMusic();
        router.replace('/(auth)/login');
      } else {
        ensureUsuarioProfile(session.user);
      }
    });

    soundManager.playBgMusic();

    return () => {
      authListener.subscription.unsubscribe();
      soundManager.stopBgMusic();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // 👈 oculta la barra completa
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="homepage"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: 'Rachas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="coralReef"
        options={{
          href: null, // 👈 oculta esta pantalla de cualquier listado de tabs
        }}
      />
      <Tabs.Screen
        name="SunkenShip"
        options={{
          href: null, // 👈 oculta esta pantalla de cualquier listado de tabs
        }}
      />
    </Tabs>
  );
}