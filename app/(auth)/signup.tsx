import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('¡Ups!', 'Por favor completa todos los campos para tu nuevo personaje 🐙');
      return;
    }

    setLoading(true);

    try {
      // 1. Verificar primero si el nombre de usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuario')
        .select('nombre_usuario')
        .eq('nombre_usuario', name.trim())
        .maybeSingle();

      if (existingUser) {
        Alert.alert('¡Nombre ocupado!', 'Ese nombre de buceador ya está registrado. ¡Prueba otro divertido! 🐬');
        setLoading(false);
        return;
      }

      // 2. Si está libre, creamos el usuario con la fecha de hoy
      const { error } = await supabase
        .from('usuario')
        .insert([
          {
            nombre_usuario: name.trim(),
            contrasenia_encriptada: password.trim(),
            fecha_registro: new Date().toISOString().split('T')[0] // Guarda en formato YYYY-MM-DD requerido por SQL
          }
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('¡Éxito!', '¡Tu cuenta ha sido creada! Ahora puedes sumergirte. 🌊', [
        { text: '¡Genial!', onPress: () => router.replace('/login') }
      ]);

    } catch (err) {
      Alert.alert('Error', 'No pudimos crear tu personaje en el arrecife. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circle} />
      
      <Text style={styles.title}>Pulpo Play</Text>
      <Text style={styles.subtitle}>Join the undersea adventure!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Diver's Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="none"
          placeholder="New name"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!loading}
          autoCapitalize="none"
          placeholder="Create password"
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>¡Dive In!</Text>
          )}
        </TouchableOpacity>
      </View>

      <Link href="/login" style={styles.footerText}>
        Already have an account? Log In
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A2D2FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0000CD',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A8A8A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#CCD9FF',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0084FF',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});