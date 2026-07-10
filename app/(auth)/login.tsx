
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
  View
} from 'react-native';

// la logica en utils y el estilo en style
import { styles } from '../../styles/login.style';
import { handleLoginLogic } from '../../utils/login';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  // The button triggers this, which passes the data to your logic file
  const onLoginPress = () => {
    handleLoginLogic({
      name,
      password,
      setLoading,
      onSuccess: () => router.replace('/(tabs)/homepage' as any)
    });
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

        <TouchableOpacity style={styles.button} onPress={onLoginPress} disabled={loading}>
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
        <Text style={styles.subtitle}>Your adventure starts here!</Text>
        {formContent}
      </ScrollView>
    </SafeAreaView>
  );
}