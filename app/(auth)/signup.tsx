import React, { useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, ScrollView,
  Platform, useWindowDimensions, Modal
} from 'react-native';
import { Link, useRouter } from 'expo-router';

// 1. Importamos la lógica externa y los estilos
import { handleSignUpLogic } from '../../utils/signup';
import { styles } from '../../styles/signup.style';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);
  
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
      onError: (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalCallback(null);
        setModalVisible(true);
      },
      onSuccessMsg: (title: string, message: string, cb: () => void) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalCallback(() => cb);
        setModalVisible(true);
      }
    });
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
      </View>

      <Link href="/login" style={[styles.footerText, !isMobile && styles.footerTextWeb]}>
        Already have an account? Log In
      </Link>

      {modalVisible && (
        <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => {
          setModalVisible(false);
          if (modalCallback) modalCallback();
        }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEmoji}>🫧</Text>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalSubtitle}>{modalMessage}</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                setModalVisible(false);
                if (modalCallback) modalCallback();
              }}>
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
        <Text style={styles.subtitle}>Join the undersea adventure!</Text>
        {formContent}
      </ScrollView>
    </SafeAreaView>
  );
}