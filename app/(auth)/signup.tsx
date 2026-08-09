import React, { useState, useCallback } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, ScrollView,
  Platform, useWindowDimensions, Image, Modal, Alert
} from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';

// 1. Importamos la lógica externa y los estilos
import { handleSignUpLogic } from '../../utils/signup';
import { styles } from '../../styles/signup.style';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  // Ejecutamos la lógica pasando el estado local
  const onSignUpPress = () => {
    handleSignUpLogic({
      name,
      email,
      password,
      setLoading,
      onSuccess: () => router.replace('/login'),
      onShowConfirmEmail: () => setShowConfirmModal(true)
    });
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await supabase.auth.resend({ type: 'signup', email: email.trim() });
      if (Platform.OS === 'web') {
        window.alert('Sent! We have resent the confirmation email.');
      } else {
        Alert.alert('Sent!', 'We have resent the confirmation email.');
      }
      setShowConfirmModal(false);
      router.replace('/login');
    } catch (e) {
      if (Platform.OS === 'web') {
        window.alert('Error: Could not resend email.');
      } else {
        Alert.alert('Error', 'Could not resend email.');
      }
      setShowConfirmModal(false);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL('/(tabs)/homepage');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
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
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
            autoCapitalize="none"
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#A0AEC0"
          />
          <TouchableOpacity 
            style={{ position: 'absolute', right: 15, top: 14 }} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#475569' }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>¡Dive In!</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
          <Text style={{ marginHorizontal: 10, color: '#94A3B8' }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
        </View>

        <TouchableOpacity
          testID="signup-google-btn"
          id="signup-google-btn"
          style={[styles.button, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 0 }]}
          onPress={handleGoogleAuth}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: '#475569' }]}>🇬 Sign up with Google</Text>
        </TouchableOpacity>
      </View>

      <Link href="/login" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
        Already have an account? Log In
      </Link>

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, width: '100%', maxWidth: 400, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1E293B', textAlign: 'center' }}>
              please confirm email
            </Text>
            
            <TouchableOpacity 
              style={[styles.button, { width: '100%', marginBottom: 12 }]} 
              onPress={() => {
                setShowConfirmModal(false);
                router.replace('/login');
              }}
            >
              <Text style={styles.buttonText}>login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { width: '100%', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 0 }]} 
              onPress={handleResendEmail}
            >
              <Text style={[styles.buttonText, { color: '#475569' }]}>resend email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.containerWeb}>
        <View style={styles.webLeftPanel}>
          <Image 
            source={require('../../assets/images/OctavioBasic.png')} 
            style={{ width: 64, height: 64, marginBottom: 16 }} 
            resizeMode="contain" 
          />
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
          <Image 
            source={require('../../assets/images/OctavioBasic.png')} 
            style={{ width: 48, height: 48 }} 
            resizeMode="contain" 
          />
        </View>
        <Text style={styles.title}>Pulpo Play</Text>
        <Text style={styles.subtitle}>Join the undersea adventure!</Text>
        {formContent}
      </ScrollView>
    </SafeAreaView>
  );
}