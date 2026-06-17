import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Viene por defecto en Expo

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- HEADER SUPERIOR --- */}
      <View style={styles.header}>
        {/* Avatar de Usuario */}
        <TouchableOpacity style={styles.avatarButton}>
          <Ionicons name="person-circle" size={50} color="#0084FF" />
        </TouchableOpacity>

        {/* Contador de Monedas / Conchas */}
        <View style={styles.coinBadge}>
          <View style={styles.coinCircle}>
            {/* Aquí puedes meter un mini PNG de tu concha marina */}
            <Text style={styles.coinIcon}>🐚</Text> 
          </View>
          <Text style={styles.coinText}>10,000</Text>
        </View>
      </View>

      {/* --- BURBUJA DE TEXTO (DIÁLOGO) --- */}
      <View style={styles.dialogContainer}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>
            ¿Ready for a splash?{"\n"}Chosse a zone below to start your mission explores!
          </Text>
        </View>
        {/* Círculo decorativo azul que sobresale */}
        <View style={styles.decoratorCircle} />
      </View>

      {/* --- CAROUSEL / SELECCIÓN DE MUNDOS --- */}
      {/* 
        Nota: Para que se mueva de lado a lado como en tu imagen, 
        más adelante puedes envolver esto en un ScrollView horizontal.
      */}
      <View style={styles.worldsContainer}>
        {/* Mundo Izquierdo (Barco) */}
        <View style={[styles.worldSide, styles.worldLeft]}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} // Reemplaza con tu asset local
            style={styles.imageSideWorld}
          />
        </View>

        {/* Mundo Central Principal (Coral Reef) */}
        <View style={styles.worldMainContainer}>
          <TouchableOpacity activeOpacity={0.9} style={styles.worldMainCard}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/250' }} // Reemplaza con tu imagen 3D de coral
              style={styles.imageMainWorld}
            />
          </TouchableOpacity>
          <Text style={styles.worldTitle}>1 - Coral Reef</Text>
        </View>

        {/* Mundo Derecho (Submarino) */}
        <View style={[styles.worldSide, styles.worldRight]}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} // Reemplaza con tu asset local
            style={styles.imageSideWorld}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A2D2FF', // Tu azul característico de fondo
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  avatarButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 2,
    // Sombra suave para dar efecto 3D/relieve
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fondo blanco semitransparente
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  coinCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  coinIcon: {
    fontSize: 14,
  },
  coinText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  dialogContainer: {
    width: '100%',
    position: 'relative',
    marginTop: 40,
    marginBottom: 20,
  },
  dialogBox: {
    backgroundColor: '#73C2FB', // Un azul intermedio para el cuadro de diálogo
    borderRadius: 30,
    padding: 22,
    borderWidth: 2,
    borderColor: '#52A6E3',
    zIndex: 1,
  },
  dialogText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  decoratorCircle: {
    position: 'absolute',
    top: -20,
    right: 10,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#0000CD', // El círculo azul marino de tu diseño
    zIndex: 2, // Se superpone a la caja
  },
  worldsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -20,
  },
  worldMainContainer: {
    alignItems: 'center',
    zIndex: 10,
    width: width * 0.55,
  },
  worldMainCard: {
    width: width * 0.52,
    height: width * 0.52,
    borderRadius: (width * 0.52) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageMainWorld: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  worldTitle: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  worldSide: {
    position: 'absolute',
    width: width * 0.32,
    height: width * 0.32,
    opacity: 0.7, // Se ven más opacos al fondo
  },
  worldLeft: {
    left: -20,
  },
  worldRight: {
    right: -20,
  },
  imageSideWorld: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});