// app/(tabs)/coralReef.tsx
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function CoralReef() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Coral Reef 🐠</Text>

      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => router.push('/homepage')}
      >
        <Text style={styles.buttonText}>Lección completada</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#5a9eff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});