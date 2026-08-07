
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput, TouchableOpacity,
  useWindowDimensions,
  View,
  Image
} from 'react-native';

// la logica en utils y el estilo en style
import { styles } from '../../styles/login.style';
import { handleLoginLogic } from '../../utils/login';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  // The button triggers this, which passes the data to your logic file
  const onLoginPress = () => {
    setErrorMessage('');
    handleLoginLogic({
      name,
      password,
      setLoading,
      onSuccess: () => router.replace('/(tabs)/homepage' as any),
      onError: setErrorMessage
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
          <Text style={styles.webFormTitle}>Welcome back!</Text>
          <Text style={styles.webFormSub}>Log in to continue your adventure</Text>
        </>
      )}

      <View style={[styles.card, !isMobile && styles.cardWeb]}>
        <Text style={styles.label}>Diver's Name</Text>
        <TextInput
          testID="login-username-input"
          id="login-username-input"
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="none"
          placeholder="Your username"
          placeholderTextColor="#A0AEC0"
        />

        <Text style={styles.label}>Password</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="login-password-input"
            id="login-password-input"
            style={[styles.input, { paddingRight: 50 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
            autoCapitalize="none"
            placeholder="Your password"
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

        {errorMessage ? (
          <Text style={{ color: '#EF4444', marginBottom: 15, textAlign: 'center', fontWeight: '500' }}>
            {errorMessage}
          </Text>
        ) : null}

        <TouchableOpacity
          testID="login-submit-btn"
          id="login-submit-btn"
          style={styles.button}
          onPress={onLoginPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>¡Submerge!</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
          <Text style={{ marginHorizontal: 10, color: '#94A3B8' }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
        </View>

        <TouchableOpacity
          testID="login-google-btn"
          id="login-google-btn"
          style={[styles.button, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 0 }]}
          onPress={handleGoogleAuth}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: '#475569' }]}>🇬 Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      <Link testID="login-to-signup-link" id="login-to-signup-link" href="/signup" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
        Don't have an account? Sign up
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
        <Text style={styles.subtitle}>Your adventure starts here!</Text>
        {formContent}
      </ScrollView>
    </SafeAreaView>
  );
}