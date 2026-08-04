import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { supabase } from '../../lib/supabase';

// 1. Importamos la lógica y estilos originales
import { styles } from '../../styles/homepage.style';
import { useHomeLogic } from '../../utils/homepage';

export default function HomeScreenWeb() {
  const [difficulty, setDifficulty] = useState<number>(2);
  // 2. Extraemos todo lo que necesitamos de nuestro hook personalizado
  const {
    coins, showDialog, setShowDialog, touchStartX, changeWorld,
    isMobile, visibleNavItems, leftWorld, centerWorldItem, rightWorld, equippedItem
  } = useHomeLogic();

  // Auto-oculta el diálogo después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowDialog(false), 10000);
    return () => clearTimeout(timer);
  }, [setShowDialog]);

  // --- ANIMATIONS ---
  const floatAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnimB = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2B = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3B = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) })
      ])
    );
    floatLoop.start();

    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, { toValue: 1, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(swayAnim, { toValue: 0, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) })
      ])
    );
    swayLoop.start();

    const bubbleLoop = Animated.loop(
      Animated.timing(bubbleAnim, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.linear })
    );
    bubbleLoop.start();
    const timer1 = setTimeout(() => {
      Animated.loop(Animated.timing(bubbleAnimB, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.linear })).start();
    }, 2000);
    
    const bubbleLoop2 = Animated.loop(
      Animated.timing(bubbleAnim2, { toValue: 1, duration: 5500, useNativeDriver: true, easing: Easing.linear })
    );
    bubbleLoop2.start();
    const timer2 = setTimeout(() => {
      Animated.loop(Animated.timing(bubbleAnim2B, { toValue: 1, duration: 5500, useNativeDriver: true, easing: Easing.linear })).start();
    }, 2750);

    const bubbleLoop3 = Animated.loop(
      Animated.timing(bubbleAnim3, { toValue: 1, duration: 4800, useNativeDriver: true, easing: Easing.linear })
    );
    bubbleLoop3.start();
    const timer3 = setTimeout(() => {
      Animated.loop(Animated.timing(bubbleAnim3B, { toValue: 1, duration: 4800, useNativeDriver: true, easing: Easing.linear })).start();
    }, 2400);
    
    return () => {
      floatLoop.stop();
      swayLoop.stop();
      bubbleLoop.stop();
      bubbleLoop2.stop();
      bubbleLoop3.stop();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const octavioTranslateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const seaweedRotate1 = swayAnim.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '5deg'] });
  const seaweedRotate2 = swayAnim.interpolate({ inputRange: [0, 1], outputRange: ['3deg', '-3deg'] });
  
  const bubbleTranslateY = bubbleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });
  const bubbleOpacity = bubbleAnim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.65, 0.65, 0] });
  const bubbleTranslateYB = bubbleAnimB.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });
  const bubbleOpacityB = bubbleAnimB.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.65, 0.65, 0] });
  
  const bubbleTranslateY2 = bubbleAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const bubbleOpacity2 = bubbleAnim2.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.5, 0.5, 0] });
  const bubbleTranslateY2B = bubbleAnim2B.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const bubbleOpacity2B = bubbleAnim2B.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.5, 0.5, 0] });

  const bubbleTranslateY3 = bubbleAnim3.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const bubbleOpacity3 = bubbleAnim3.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.4, 0.4, 0] });
  const bubbleTranslateY3B = bubbleAnim3B.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const bubbleOpacity3B = bubbleAnim3B.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.4, 0.4, 0] });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      router.replace('/login' as any);
    }
  };

  return (
    <LinearGradient
      colors={['#03245a', '#5a9eff']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={[styles.container, isMobile && styles.containerMobile]}>

        {/* --- MENÚ SUPERIOR (LOGO Y MONEDAS) --- */}
        {isMobile ? (
          <View style={styles.headerRowMobile}>
            <View style={[styles.headerSideMobile, styles.headerSideLeftMobile]}>
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/profile' as any)}
              >
                <Image
                  source={require('../../assets/images/Perfil.png')}
                  style={styles.profileIconImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerCenterMobile}>
              <View style={[styles.coinsCard, styles.coinsCardMobile]}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={[styles.coinIcon, styles.coinIconMobile]}
                />
                <Text style={[styles.coinsText, styles.coinsTextMobile]}>{coins}</Text>
              </View>
            </View>

            <View style={[styles.headerSideMobile, styles.headerSideRightMobile]}>
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <Image
                  source={require('../../assets/images/LogOut.png')}
                  style={styles.profileIconImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topNavbar}>
            <View style={[styles.headerSide, styles.headerSideLeft]}>
              <View style={styles.logoCard}>
                <Text style={styles.logoTextTitle}>Pulpo</Text>
                <Text style={styles.logoTextSub}>Play</Text>
              </View>
            </View>

            <View style={styles.headerCenter}>
              <View style={styles.navIsland}>
                {visibleNavItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.8}
                    style={[styles.navPill, isMobile && styles.navPillMobile]}
                    onPress={() => {
                      if (item.key === 'streak') {
                        router.push('/(tabs)/streaks' as any);
                      } else if (item.key === 'worlds') {
                        router.push('/(tabs)/homepage' as any);
                      } else if (item.key === 'store') {
                        router.push('/(tabs)/store' as any);
                      } else if (item.key === 'profile') {
                        router.push('/(tabs)/profile' as any);
                      }
                    }}
                  >
                    <Image
                      source={item.icon}
                      style={[styles.pillIcon, isMobile && styles.pillIconMobile]}
                    />
                    <Text style={[styles.pillText, isMobile && styles.pillTextMobile]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.headerSide, styles.headerSideRight, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <View style={styles.coinsCard}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={styles.coinIcon}
                />
                <Text style={styles.coinsText}>{coins}</Text>
              </View>
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/profile' as any)}
              >
                <Image source={require('../../assets/images/Perfil.png')} style={styles.profileIconImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <Image source={require('../../assets/images/LogOut.png')} style={styles.profileIconImage} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- CONTENIDO CENTRAL --- */}
        <View style={styles.mainContent}>
          <Animated.Image 
            source={equippedItem?.image} 
            pointerEvents="none"
            style={[styles.backgroundOctavio, { transform: [{ translateY: octavioTranslateY }] }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/bubbles.png')} 
            pointerEvents="none"
            style={[styles.bubblesDecoration, { transform: [{ translateY: bubbleTranslateY }], opacity: bubbleOpacity }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/bubbles.png')} 
            pointerEvents="none"
            style={[styles.bubblesDecoration, { transform: [{ translateY: bubbleTranslateYB }], opacity: bubbleOpacityB }]} 
          />

          <Animated.Image 
            source={require('../../assets/images/bubbles.png')} 
            pointerEvents="none"
            style={[styles.bubblesDecorationLeft, { transform: [{ translateY: bubbleTranslateY3 }], opacity: bubbleOpacity3 }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/bubbles.png')} 
            pointerEvents="none"
            style={[styles.bubblesDecorationLeft, { transform: [{ translateY: bubbleTranslateY3B }], opacity: bubbleOpacity3B }]} 
          />

          <Animated.Image 
            source={require('../../assets/images/bubbleSingle.png')} 
            pointerEvents="none"
            style={[styles.bubbleSingleLeft, { transform: [{ translateY: bubbleTranslateY }], opacity: bubbleOpacity }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/bubbleSingle.png')} 
            pointerEvents="none"
            style={[styles.bubbleSingleLeft, { transform: [{ translateY: bubbleTranslateYB }], opacity: bubbleOpacityB }]} 
          />

          <Animated.Image 
            source={require('../../assets/images/bubbleSingle.png')} 
            pointerEvents="none"
            style={[styles.bubbleSingleRight, { transform: [{ translateY: bubbleTranslateY2 }], opacity: bubbleOpacity2 }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/bubbleSingle.png')} 
            pointerEvents="none"
            style={[styles.bubbleSingleRight, { transform: [{ translateY: bubbleTranslateY2B }], opacity: bubbleOpacity2B }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/seaweed.png')} 
            pointerEvents="none"
            style={[styles.seaweedDecorationRight1, { transform: [{ rotate: seaweedRotate1 }] }]} 
          />
          <Animated.Image 
            source={require('../../assets/images/seaweed.png')} 
            pointerEvents="none"
            style={[styles.seaweedDecorationRight2, { transform: [{ rotate: seaweedRotate2 }] }]} 
          />

          {/* --- VENTANA FLOTANTE --- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDialog(false)}
            disabled={!showDialog}
            style={[
              styles.dialogWrapper,
              isMobile && styles.dialogWrapperMobile,
              !showDialog && { opacity: 0 }
            ]}
          >
            <View style={styles.dialogBubble}>
              <View style={styles.dialogTextContainer}>
                <Text style={styles.dialogText}>
                  Ready for a splash? Choose a zone below to start your mission explores!
                </Text>
              </View>
            </View>
            <View style={styles.dialogTail} />
          </TouchableOpacity>

          {/* --- CAROUSEL ANIMADO INTERACTIVO --- */}
          {isMobile ? (
            <View
              style={styles.carouselWrapperMobile}
              onTouchStart={(e) => { touchStartX.current = e.nativeEvent.pageX; }}
              onTouchEnd={(e) => {
                const diffX = touchStartX.current - e.nativeEvent.pageX;
                if (diffX > 50) changeWorld('next');
                if (diffX < -50) changeWorld('prev');
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.worldCircle, styles.sideWorldMobile]}
                onPress={() => changeWorld('prev')}
              >
                <Image source={leftWorld.image} style={styles.worldImage} />
              </TouchableOpacity>

              <View style={styles.centerWorldContainerMobile}>
                <Text style={styles.gameTitleMobile}>{centerWorldItem.name}</Text>
                <TouchableOpacity activeOpacity={0.9} style={[styles.worldCircle, styles.centerWorldMobile]}>
                  <Image source={centerWorldItem.image} style={styles.worldImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.playButtonMobile}
                  onPress={async () => {
                    await AsyncStorage.setItem('pulpo_difficulty', difficulty.toString());
                    router.push(centerWorldItem.route as any);
                  }}
                >
                  <Text style={styles.playButtonTextMobile}>Play</Text>
                </TouchableOpacity>
                <View style={styles.difficultyContainerMobile}>
                  <View style={styles.starsRowMobile}>
                    {[1, 2, 3].map(star => (
                      <TouchableOpacity key={star} onPress={() => setDifficulty(star)}>
                        <Text style={[styles.starIconMobile, difficulty >= star ? styles.starActive : styles.starInactive]}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.difficultyLabelMobile}>
                    {difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.worldCircle, styles.sideWorldMobile]}
                onPress={() => changeWorld('next')}
              >
                <Image source={rightWorld.image} style={styles.worldImage} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.worldsRow}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.worldCircle, styles.sideWorld]}
                onPress={() => changeWorld('prev')}
              >
                <Image source={leftWorld.image} style={styles.worldImage} />
              </TouchableOpacity>

              <View style={styles.centerWorldContainer}>
                <Text style={styles.gameTitleWeb}>{centerWorldItem.name}</Text>
                <TouchableOpacity activeOpacity={0.9} style={[styles.worldCircle, styles.centerWorld]}>
                  <Image source={centerWorldItem.image} style={styles.worldImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.playButton}
                  onPress={async () => {
                    await AsyncStorage.setItem('pulpo_difficulty', difficulty.toString());
                    router.push(centerWorldItem.route as any);
                  }}
                >
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
                <View style={styles.difficultyContainer}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map(star => (
                      <TouchableOpacity key={star} onPress={() => setDifficulty(star)}>
                        <Text style={[styles.starIcon, difficulty >= star ? styles.starActive : styles.starInactive]}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.difficultyLabel}>
                    {difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.worldCircle, styles.sideWorld]}
                onPress={() => changeWorld('next')}
              >
                <Image source={rightWorld.image} style={styles.worldImage} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* --- NAVBAR INFERIOR (SÓLO MOBILE) --- */}
        {isMobile && (
          <View style={styles.bottomNavbarMobile}>
            <View style={[styles.navIsland, styles.navIslandMobile]}>
              {visibleNavItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  style={[styles.navPill, isMobile && styles.navPillMobile]}
                  onPress={() => {
                    if (item.key === 'streak') {
                      router.push('/(tabs)/streaks' as any);
                    } else if (item.key === 'worlds') {
                      router.push('/(tabs)/homepage' as any);
                    } else if (item.key === 'store') {
                      router.push('/(tabs)/store' as any);
                    } else if (item.key === 'profile') {
                      router.push('/(tabs)/profile' as any);
                    }
                  }}
                >
                  <Image
                    source={item.icon}
                    style={[styles.pillIcon, isMobile && styles.pillIconMobile]}
                  />
                  <Text style={[styles.pillText, isMobile && styles.pillTextMobile]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}