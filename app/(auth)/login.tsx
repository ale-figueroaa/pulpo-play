import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('¡Ups!', 'Por favor completa todos los campos del buceador 🐙');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('usuario') 
        .select('*')
        .eq('nombre_usuario', name.trim())
        .eq('contrasenia_encriptada', password.trim())
        .single();

      if (error || !data) {
        Alert.alert(
          '¡Buscando en el océano!', 
          'No encontramos a ningún buceador con esos datos. ¡Revisa tu nombre o contraseña! 🌊'
        );
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      Alert.alert('Error', 'Hubo un problema al conectar con el arrecife de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circle} />
      
      <Text style={styles.title}>Pulpo Play</Text>
      <Text style={styles.subtitle}>Your adventure starts here!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Diver's Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!loading}
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>¡Submerge!</Text>
          )}
        </TouchableOpacity>
      </View>

      <Link href="/signup" style={styles.footerText}>
        Don't have an account? Sign up
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
    marginBottom: 32,
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
    marginBottom: 20,
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