import React, { useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, ScrollView,
  Platform, useWindowDimensions, Image
} from 'react-native';
import { Link, useRouter } from 'expo-router';

// 1. Importamos la lógica externa y los estilos
import { handleSignUpLogic } from '../../utils/signup';
import { styles } from '../../styles/signup.style';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      onSuccess: () => router.replace('/login')
    });
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