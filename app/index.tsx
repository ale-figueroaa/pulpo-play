/**
 * ============================================================================
 * GUÍA PASO A PASO: CÓMO CREAR ESTA LANDING PAGE DESDE CERO EN EXPO ROUTER
 * ============================================================================
 * 
 * PASO 1: Definir el archivo raíz (`app/index.tsx`)
 *   - En Expo Router, el archivo `index.tsx` dentro de la carpeta `app/` es la 
 *     ruta principal ("/") de tu aplicación.
 * 
 * PASO 2: Separar el comportamiento Web vs. Móvil (`Platform.OS`)
 *   - Usamos `Platform.OS === 'web'` para detectar si el usuario abrió la app en 
 *     un navegador de computadora/celular web.
 *   - Si NO es web (`!isWeb`), devolvemos `<Redirect href="/(auth)/login" />` 
 *     para mandar a los usuarios de iOS/Android directo a iniciar sesión.
 * 
 * PASO 3: Estructurar la Landing Page en Bloques Lógicos (Componentes visuales)
 *   Una buena Landing Page se compone de 4 secciones clave dentro de un ScrollView:
 *     A) Navbar (Barra superior): Logo a la izquierda y botones de acción (Log In / Sign Up) a la derecha.
 *     B) Hero Section (Sección Principal): Título llamativo, subtítulo explicativo y botones Call-To-Action (CTA).
 *     C) Features Section (Beneficios/Características): Tarjetas en cuadrícula (`flexWrap: 'wrap'`) explicando qué hace la app.
 *     D) Footer (Pie de página): Derechos de autor o enlaces secundarios.
 * 
 * PASO 4: Conectar con el Sistema de Diseño (`styles/landing.style.ts`)
 *   - Separamos los estilos en un archivo externo para mantener el código limpio.
 *   - Usamos la paleta de colores de la app (`#0a3d8f` azul marino, `#00897b` verde/turquesa)
 *     y elementos decorativos como burbujas oceánicas con posición absoluta.
 * ============================================================================
 */

import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../styles/landing.style';

export default function WebLandingScreen() {
  const router = useRouter();

  // 1. Detectamos la plataforma (si se ejecuta en web, iOS o Android)
  const isWeb = Platform.OS === 'web';

  // 2. Si el usuario está en la app nativa (móvil), lo llevamos directo al Login
  if (!isWeb) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3. Renderizado principal de la Landing Page para Web
  return (
    /* SafeAreaView: Contenedor raíz que protege el contenido para no quedar debajo de barras o bordes del sistema */
    <SafeAreaView style={styles.container}>
      {/* ScrollView: Contenedor con desplazamiento vertical por si el contenido es más alto que la ventana del navegador */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ================================================================
            A) NAVBAR (Barra Superior de Navegación)
            Un 'View' actúa como un <div> en HTML: agrupa elementos visuales.
            ================================================================ */}
        <View style={styles.navbar}>
          {/* Contenedor izquierdo del logo (Marca / Identidad visual) */}
          <View style={styles.navBrand}>
            {/* Text: Componente para renderizar cualquier texto o emoji */}
            <Text style={styles.navEmoji}>🐙</Text>
            <Text style={styles.navTitle}>Pulpo Play</Text>
          </View>

          {/* Contenedor derecho para los botones de acción (Log In y Sign Up) */}
          <View style={styles.navActions}>
            {/* TouchableOpacity: Botón interactivo que reduce su opacidad al hacer clic */}
            <TouchableOpacity
              testID="nav-login-btn"
              id="nav-login-btn"
              style={styles.navLoginBtn}
              onPress={() => router.push('/(auth)/login' as any)}
            >
              <Text style={styles.navLoginText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="nav-signup-btn"
              id="nav-signup-btn"
              style={styles.navSignUpBtn}
              onPress={() => router.push('/(auth)/signup' as any)}
            >
              <Text style={styles.navSignUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================
            B) HERO SECTION (Sección Principal de Impacto)
            Es el primer contenido visual que recibe al usuario ("Above the fold")
            ================================================================ */}
        <View style={styles.heroSection}>
          {/* Views vacíos con posición absoluta que sirven de burbujas decorativas en el fondo */}
          <View style={styles.bubble1} />
          <View style={styles.bubble2} />
          <View style={styles.bubble3} />

          {/* Pequeño distintivo o etiqueta superior con fondo redondeado */}
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>WELCOME TO THE UNDERSEA WORLD</Text>
          </View>

          {/* Título principal H1 de la Landing Page */}
          <Text style={styles.heroTitle}>
            Dive Into Interactive Undersea Learning & Fun
          </Text>

          {/* Subtítulo o descripción introductoria */}
          <Text style={styles.heroSubtitle}>
            Explore colorful coral reefs, solve underwater challenges, and embark on
            an extraordinary adventure designed for explorers of all ages.
          </Text>

          {/* Contenedor horizontal (Row) con los botones principales de llamada a la acción (CTA) */}
          <View style={styles.heroButtonsRow}>
            <TouchableOpacity
              testID="hero-signup-btn"
              id="hero-signup-btn"
              style={styles.primaryHeroBtn}
              onPress={() => router.push('/(auth)/signup' as any)}
            >
              <Text style={styles.primaryHeroBtnText}>¡Dive In Now!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="hero-login-btn"
              id="hero-login-btn"
              style={styles.secondaryHeroBtn}
              onPress={() => router.push('/(auth)/login' as any)}
            >
              <Text style={styles.secondaryHeroBtnText}>Existing Diver? Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================
            C) FEATURES SECTION (Beneficios / Razones para usar la app)
            ================================================================ */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresHeader}>Why Divers Love Pulpo Play</Text>
          <Text style={styles.featuresSubHeader}>
            Designed with marine aesthetics and interactive gameplay
          </Text>

          {/* Contenedor Grid (flexWrap: 'wrap') que organiza las tarjetas en columnas responsive */}
          <View style={styles.featuresGrid}>
            {/* Tarjeta 1: Interactive Quests */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🐙</Text>
              </View>
              <Text style={styles.featureTitle}>Interactive Quests</Text>
              <Text style={styles.featureDesc}>
                Discover marine mysteries, complete ocean missions, and interact with smart undersea creatures.
              </Text>
            </View>

            {/* Tarjeta 2: Vibrant Coral Reefs */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🪸</Text>
              </View>
              <Text style={styles.featureTitle}>Vibrant Coral Reefs</Text>
              <Text style={styles.featureDesc}>
                Immerse yourself in beautifully designed underwater environments full of life and color.
              </Text>
            </View>

            {/* Tarjeta 3: Track Your Journey */}
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

        {/* ================================================================
            D) FOOTER (Pie de página con derechos de autor)
            ================================================================ */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Pulpo Play. Dive into the undersea adventure world by Bruno.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
