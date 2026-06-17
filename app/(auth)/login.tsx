import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator, Platform, useWindowDimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('¡Ups!', 'Por favor completa todos los campos del buceador 🐙');
      return;
    }

    setLoading(true);
    try {
      // 1. Buscar el idUsuario por nombreUsuario para obtener el email de auth.users
      const { data: usuario, error: userError } = await supabase
        .from('Usuario')
        .select('idUsuario')
        .eq('nombreUsuario', name.trim())
        .maybeSingle();

      if (userError || !usuario) {
        Alert.alert('¡Buscando en el océano!', 'No encontramos a ningún buceador con ese nombre. 🌊');
        setLoading(false);
        return;
      }

      // 2. Buscar el email en auth.users por el id
      const { data: authData, error: authError } = await supabase
        .rpc('get_email_by_id', { user_id: usuario.idUsuario });

      if (authError || !authData) {
        Alert.alert('Error', 'No pudimos encontrar tu cuenta. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      // 3. Hacer login con email + password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authData,
        password: password.trim(),
      });

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          Alert.alert('¡Confirma tu correo!', 'Revisa tu bandeja de entrada y confirma tu email antes de entrar. 📧');
        } else {
          Alert.alert('¡Contraseña incorrecta!', 'Revisa tu contraseña e intenta de nuevo. 🔒');
        }
        return;
      }

    router.replace('/(tabs)/homepage' as any);
    } catch (err: any) {
      Alert.alert('Error', 'Hubo un problema al conectar con el arrecife de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isWeb && styles.containerWeb]}>
      {!isMobile && (
        <View style={styles.webLeftPanel}>
          <Text style={styles.webPanelEmoji}>🐙</Text>
          <Text style={styles.webPanelTitle}>Pulpo Play</Text>
          <Text style={styles.webPanelSub}>Dive into the undersea{'\n'}adventure world</Text>
          <View style={styles.webBubble1} />
          <View style={styles.webBubble2} />
          <View style={styles.webBubble3} />
        </View>
      )}

      <View style={[styles.formWrapper, !isMobile && styles.formWrapperWeb]}>
        {isMobile && (
          <>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🐙</Text>
            </View>
            <Text style={styles.title}>Pulpo Play</Text>
            <Text style={styles.subtitle}>Your adventure starts here!</Text>
          </>
        )}

        {!isMobile && (
          <>
            <Text style={styles.webFormTitle}>Welcome back!</Text>
            <Text style={styles.webFormSub}>Log in to continue your adventure</Text>
          </>
        )}

        <View style={[styles.card, !isMobile && styles.cardWeb]}>
          <Text style={styles.label}>Diver's Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={!loading}
            autoCapitalize="none"
            placeholder="Your username"
            placeholderTextColor="#A0AEC0"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            autoCapitalize="none"
            placeholder="Your password"
            placeholderTextColor="#A0AEC0"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>¡Submerge!</Text>
            )}
          </TouchableOpacity>
        </View>

        <Link href="/signup" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
          Don't have an account? Sign up
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3d8f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  containerWeb: {
    flexDirection: 'row',
    padding: 0,
    backgroundColor: '#f0f4ff',
  },
  webLeftPanel: {
    flex: 1,
    backgroundColor: '#0a3d8f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    overflow: 'hidden',
  },
  webPanelEmoji: { fontSize: 72, marginBottom: 20 },
  webPanelTitle: {
    fontSize: 40, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12,
  },
  webPanelSub: {
    fontSize: 18, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', lineHeight: 28,
  },
  webBubble1: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -60, left: -60,
  },
  webBubble2: {
    position: 'absolute', width: 120, height: 120,
    borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)',
    top: 40, right: -30,
  },
  webBubble3: {
    position: 'absolute', width: 80, height: 80,
    borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)',
    top: 180, left: 40,
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  formWrapperWeb: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    padding: 64,
    alignItems: 'flex-start',
  },
  webFormTitle: {
    fontSize: 30, fontWeight: 'bold', color: '#0a3d8f', marginBottom: 6,
  },
  webFormSub: {
    fontSize: 15, color: '#7a8aaa', marginBottom: 28,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconEmoji: { fontSize: 38 },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardWeb: {
    borderRadius: 20,
    shadowOpacity: 0.08,
    marginBottom: 20,
  },
  label: {
    fontSize: 13, fontWeight: '600',
    color: '#7a8aaa', marginBottom: 6, marginTop: 4,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#EEF2FF',
    height: 50, borderRadius: 14,
    paddingHorizontal: 18, fontSize: 15,
    color: '#1a2340', marginBottom: 14,
  },
  button: {
    backgroundColor: '#1565c0',
    height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF', fontSize: 18, fontWeight: 'bold',
  },
  footerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14, fontWeight: '500', textAlign: 'center',
  },
  footerTextWeb: {
    color: '#1565c0',
  },
});