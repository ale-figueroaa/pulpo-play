import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { styles } from '../styles/landing.style';

export default function WebLandingScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  // Si no estamos en web (móvil), redirigimos directo a login
  if (!isWeb) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={styles.navBrand}>
            <Text style={styles.navEmoji}>🐙</Text>
            <Text style={styles.navTitle}>Pulpo Play</Text>
          </View>

          <View style={styles.navActions}>
            <TouchableOpacity
              style={styles.navLoginBtn}
              onPress={() => router.push('/(auth)/login' as any)}
            >
              <Text style={styles.navLoginText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navSignUpBtn}
              onPress={() => router.push('/(auth)/signup' as any)}
            >
              <Text style={styles.navSignUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.bubble1} />
          <View style={styles.bubble2} />
          <View style={styles.bubble3} />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌊 WELCOME TO THE UNDERSEA WORLD</Text>
          </View>

          <Text style={styles.heroTitle}>
            Dive Into Interactive Undersea Learning & Fun
          </Text>

          <Text style={styles.heroSubtitle}>
            Explore colorful coral reefs, solve underwater challenges, and embark on
            an extraordinary adventure designed for explorers of all ages.
          </Text>

          <View style={styles.heroButtonsRow}>
            <TouchableOpacity
              style={styles.primaryHeroBtn}
              onPress={() => router.push('/(auth)/signup' as any)}
            >
              <Text style={styles.primaryHeroBtnText}>¡Dive In Now!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryHeroBtn}
              onPress={() => router.push('/(auth)/login' as any)}
            >
              <Text style={styles.secondaryHeroBtnText}>Existing Diver? Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresHeader}>Why Divers Love Pulpo Play</Text>
          <Text style={styles.featuresSubHeader}>
            Designed with marine aesthetics and interactive gameplay
          </Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🐙</Text>
              </View>
              <Text style={styles.featureTitle}>Interactive Quests</Text>
              <Text style={styles.featureDesc}>
                Discover marine mysteries, complete ocean missions, and interact with smart undersea creatures.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🪸</Text>
              </View>
              <Text style={styles.featureTitle}>Vibrant Coral Reefs</Text>
              <Text style={styles.featureDesc}>
                Immerse yourself in beautifully designed underwater environments full of life and color.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🏆</Text>
              </View>
              <Text style={styles.featureTitle}>Track Your Journey</Text>
              <Text style={styles.featureDesc}>
                Earn badges, level up your diving gear, and follow your exploration milestones seamlessly.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Pulpo Play. Dive into the undersea adventure world.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
