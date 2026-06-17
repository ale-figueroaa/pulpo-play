import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator, ScrollView,
  Platform, useWindowDimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('¡Ups!', 'Por favor completa todos los campos para tu nuevo personaje 🐙');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('¡Correo inválido!', 'Por favor ingresa un correo electrónico válido 📧');
      return;
    }
    if (password.trim().length < 6) {
      Alert.alert('¡Contraseña muy corta!', 'La contraseña debe tener al menos 6 caracteres 🔒');
      return;
    }

    setLoading(true);
    try {
      // Verificar si el nombreUsuario ya existe en la tabla Usuario
      const { data: existingUser } = await supabase
        .from('Usuario')
        .select('nombreUsuario')
        .eq('nombreUsuario', name.trim())
        .maybeSingle();

      if (existingUser) {
        Alert.alert('¡Nombre ocupado!', 'Ese nombre de buceador ya está registrado. ¡Prueba otro! 🐬');
        setLoading(false);
        return;
      }

      // Registrar en Supabase Auth — el trigger crea automáticamente el registro en Usuario
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            nombreUsuario: name.trim(), // el trigger lo lee de raw_user_meta_data
          }
        }
      });

      if (error) throw error;

      Alert.alert(
        '¡Éxito!',
        '¡Tu cuenta ha sido creada! Revisa tu correo para confirmarla antes de entrar. 🌊',
        [{ text: '¡Genial!', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
  console.log('Error completo:', JSON.stringify(err, null, 2));
  Alert.alert('Error', err.message + '\n\nCode: ' + err.code + '\n\nDetails: ' + err.details);

    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      {!isMobile && (
        <>
          <Text style={styles.webFormTitle}>Create your account</Text>
          <Text style={styles.webFormSub}>Join the undersea adventure today</Text>
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
          placeholder="New name"
          placeholderTextColor="#A0AEC0"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="diver@ocean.com"
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
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#A0AEC0"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>¡Dive In!</Text>
          )}
        </TouchableOpacity>
      </View>

      <Link href="/login" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
        Already have an account? Log In
      </Link>
    </>
  );

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.containerWeb}>
        <View style={styles.webLeftPanel}>
          <Text style={styles.webPanelEmoji}>🐙</Text>
          <Text style={styles.webPanelTitle}>Pulpo Play</Text>
          <Text style={styles.webPanelSub}>Dive into the undersea{'\n'}adventure world</Text>
          <View style={styles.webBubble1} />
          <View style={styles.webBubble2} />
          <View style={styles.webBubble3} />
        </View>
        <View style={styles.formWrapperWeb}>
          {formContent}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🐙</Text>
        </View>
        <Text style={styles.title}>Pulpo Play</Text>
        <Text style={styles.subtitle}>Join the undersea adventure!</Text>
        {formContent}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d7a',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
    backgroundColor: '#004d7a',
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconEmoji: { fontSize: 38 },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28,
  },
  containerWeb: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
  },
  webLeftPanel: {
    flex: 1,
    backgroundColor: '#004d7a',
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
  formWrapperWeb: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    padding: 64,
    alignItems: 'flex-start',
  },
  webFormTitle: {
    fontSize: 30, fontWeight: 'bold', color: '#004d7a', marginBottom: 6,
  },
  webFormSub: {
    fontSize: 15, color: '#7a8aaa', marginBottom: 28,
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
    fontSize: 13, fontWeight: '600', color: '#7a8aaa',
    marginBottom: 6, marginTop: 4,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#EEF2FF',
    height: 50, borderRadius: 14,
    paddingHorizontal: 18, fontSize: 15,
    color: '#1a2340', marginBottom: 14,
  },
  button: {
    backgroundColor: '#00897b',
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
    color: '#004d7a',
  },
});