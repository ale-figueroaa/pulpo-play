import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, Image, SafeAreaView, Text, TouchableOpacity, View, Platform } from 'react-native';
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
    const randomDelay = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
    const bubbleDelayA = randomDelay(1800, 3200);
    const bubbleDelayB = randomDelay(2200, 3800);
    const bubbleDelayC = randomDelay(2600, 4200);

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
      Animated.sequence([
        Animated.timing(bubbleAnim, { toValue: 1, duration: 4200 + randomDelay(400, 1200), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnim, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoop.start();

    const bubbleLoopB = Animated.loop(
      Animated.sequence([
        Animated.delay(bubbleDelayA),
        Animated.timing(bubbleAnimB, { toValue: 1, duration: 4500 + randomDelay(300, 1100), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnimB, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoopB.start();

    const bubbleLoop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleAnim2, { toValue: 1, duration: 5200 + randomDelay(500, 1300), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnim2, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoop2.start();

    const bubbleLoop2B = Animated.loop(
      Animated.sequence([
        Animated.delay(bubbleDelayB),
        Animated.timing(bubbleAnim2B, { toValue: 1, duration: 5400 + randomDelay(300, 1200), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnim2B, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoop2B.start();

    const bubbleLoop3 = Animated.loop(
      Animated.sequence([
        Animated.delay(bubbleDelayC),
        Animated.timing(bubbleAnim3, { toValue: 1, duration: 4800 + randomDelay(400, 1300), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnim3, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoop3.start();

    const bubbleLoop3B = Animated.loop(
      Animated.sequence([
        Animated.delay(bubbleDelayC + randomDelay(800, 1600)),
        Animated.timing(bubbleAnim3B, { toValue: 1, duration: 5000 + randomDelay(300, 1400), useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(bubbleAnim3B, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    );
    bubbleLoop3B.start();

    return () => {
      floatLoop.stop();
      swayLoop.stop();
      bubbleLoop.stop();
      bubbleLoopB.stop();
      bubbleLoop2.stop();
      bubbleLoop2B.stop();
      bubbleLoop3.stop();
      bubbleLoop3B.stop();
    };
  }, []);

  const octavioTranslateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const seaweedRotate1 = swayAnim.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '5deg'] });
  const seaweedRotate2 = swayAnim.interpolate({ inputRange: [0, 1], outputRange: ['3deg', '-3deg'] });

  const bubbleTranslateY = bubbleAnim.interpolate({ inputRange: [0, 0.1, 0.15, 0.85, 1], outputRange: [0, 0, -40, -58, 0] });
  const bubbleTranslateX = bubbleAnim.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, 8, -5] });
  const bubbleScale = bubbleAnim.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.95, 0.95, 1.08, 0.9] });
  const bubbleRotate = bubbleAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '5deg'] });
  const bubbleOpacity = bubbleAnim.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.75, 0.85, 0] });

  const bubbleTranslateYB = bubbleAnimB.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -35, -50] });
  const bubbleTranslateXB = bubbleAnimB.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -10, 6] });
  const bubbleScaleB = bubbleAnimB.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.9, 0.9, 1.05, 0.92] });
  const bubbleRotateB = bubbleAnimB.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-4deg'] });
  const bubbleOpacityB = bubbleAnimB.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.72, 0.85, 0] });

  const bubbleTranslateY2 = bubbleAnim2.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -50, -65] });
  const bubbleTranslateX2 = bubbleAnim2.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, 6, -8] });
  const bubbleScale2 = bubbleAnim2.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.92, 0.92, 1.1, 0.88] });
  const bubbleRotate2 = bubbleAnim2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '4deg'] });
  const bubbleOpacity2 = bubbleAnim2.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.62, 0.72, 0] });
  const bubbleTranslateY2B = bubbleAnim2B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -45, -60] });
  const bubbleTranslateX2B = bubbleAnim2B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -6, 7] });
  const bubbleScale2B = bubbleAnim2B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.9, 0.9, 1.03, 0.94] });
  const bubbleRotate2B = bubbleAnim2B.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-3deg'] });
  const bubbleOpacity2B = bubbleAnim2B.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.62, 0.72, 0] });

  const bubbleTranslateY3 = bubbleAnim3.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -30, -45] });
  const bubbleTranslateX3 = bubbleAnim3.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, 4, -6] });
  const bubbleScale3 = bubbleAnim3.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.94, 0.94, 1.03, 0.9] });
  const bubbleRotate3 = bubbleAnim3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '3deg'] });
  const bubbleOpacity3 = bubbleAnim3.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.62, 0.7, 0] });
  const bubbleTranslateY3B = bubbleAnim3B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -32, -47] });
  const bubbleTranslateX3B = bubbleAnim3B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0, 0, -8, 8] });
  const bubbleScale3B = bubbleAnim3B.interpolate({ inputRange: [0, 0.1, 0.5, 1], outputRange: [0.9, 0.9, 1.05, 0.93] });
  const bubbleRotate3B = bubbleAnim3B.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-2deg'] });
  const bubbleOpacity3B = bubbleAnim3B.interpolate({ inputRange: [0, 0.05, 0.15, 0.85, 1], outputRange: [0, 0, 0.6, 0.65, 0] });

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
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.backgroundOctavio, isMobile && styles.backgroundOctavioMobile, { transform: [{ translateY: octavioTranslateY }] }]}
          />
          <Animated.Image
            source={require('../../assets/images/bubbleSingle.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleSingleTopLeft, { transform: [{ translateY: bubbleTranslateY }, { translateX: bubbleTranslateX }, { scale: bubbleScale }, { rotate: bubbleRotate }], opacity: bubbleOpacity }]}
          />
          <Animated.Image
            source={require('../../assets/images/bubbleSingle.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleSingleTopRight, { transform: [{ translateY: bubbleTranslateYB }, { translateX: bubbleTranslateXB }, { scale: bubbleScaleB }, { rotate: bubbleRotateB }], opacity: bubbleOpacityB }]}
          />

          <Animated.Image
            source={require('../../assets/images/bubblesThree.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleThreeCenter, { transform: [{ translateY: bubbleTranslateY3 }, { translateX: bubbleTranslateX3 }, { scale: bubbleScale3 }, { rotate: bubbleRotate3 }], opacity: bubbleOpacity3 }]}
          />
          <Animated.Image
            source={require('../../assets/images/bubblesThree.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleThreeLeft, { transform: [{ translateY: bubbleTranslateY3B }, { translateX: bubbleTranslateX3B }, { scale: bubbleScale3B }, { rotate: bubbleRotate3B }], opacity: bubbleOpacity3B }]}
          />

          <Animated.Image
            source={require('../../assets/images/bubbleSingle.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleSingleBottomLeft, { transform: [{ translateY: bubbleTranslateY2 }, { translateX: bubbleTranslateX2 }, { scale: bubbleScale2 }, { rotate: bubbleRotate2 }], opacity: bubbleOpacity2 }]}
          />
          <Animated.Image
            source={require('../../assets/images/bubbleSingle.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.bubbleSingleBottomRight, { transform: [{ translateY: bubbleTranslateY2B }, { translateX: bubbleTranslateX2B }, { scale: bubbleScale2B }, { rotate: bubbleRotate2B }], opacity: bubbleOpacity2B }]}
          />
          <Animated.Image
            source={require('../../assets/images/seaweed.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.seaweedDecorationRight1, isMobile && styles.seaweedDecorationRight1Mobile, { transform: [{ rotate: seaweedRotate1 }] }]}
          />
          <Animated.Image
            source={require('../../assets/images/seaweed.png')}
            {...({ pointerEvents: 'none' } as any)}
            style={[styles.seaweedDecorationRight2, isMobile && styles.seaweedDecorationRight2Mobile, { transform: [{ rotate: seaweedRotate2 }] }]}
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