
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
  Modal
} from 'react-native';

// la logica en utils y el estilo en style
import { styles } from '../../styles/login.style';
import { handleLoginLogic } from '../../utils/login';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  // The button triggers this, which passes the data to your logic file
  const onLoginPress = () => {
    handleLoginLogic({
      name,
      password,
      setLoading,
      onSuccess: () => router.replace('/(tabs)/homepage' as any),
      onError: (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
      }
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
        <TextInput
          testID="login-password-input"
          id="login-password-input"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          autoCapitalize="none"
          placeholder="Your password"
          placeholderTextColor="#A0AEC0"
        />

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
      </View>

      <Link testID="login-to-signup-link" id="login-to-signup-link" href="/signup" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
        Don't have an account? Sign up
      </Link>

      {modalVisible && (
        <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEmoji}>🫧</Text>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalSubtitle}>{modalMessage}</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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