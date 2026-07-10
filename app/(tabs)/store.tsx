// StoreScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { getUserSandDollars } from '../../utils/db';

import { styles } from '../../styles/store.style';

import { MOBILE_BREAKPOINT, NAV_ITEMS, STORE_ITEMS_DATA } from '../../utils/store';

export default function StoreScreen() {
  const [coins, setCoins] = useState<number>(0);
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const fetchUserCoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sandDollars = await getUserSandDollars(user.id);
        setCoins(sandDollars);
      }
    } catch (err) {
      console.error('Error cargando monedas en la tienda:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserCoins();
    }, [])
  );

  const handleNavigation = (key: string) => {
    if (key === 'streak') router.push('/streaks');
    else if (key === 'worlds') router.push('/homepage');
    else if (key === 'store') router.push('/store');
  };

  const visibleNavItems = isMobile 
    ? NAV_ITEMS.filter(item => item.key !== 'profile') 
    : NAV_ITEMS;

  return (
    <LinearGradient
      colors={['#03245a', '#5a9eff']} 
      start={{ x: 0, y: 1 }}           
      end={{ x: 0, y: 0 }}             
      style={styles.gradientContainer}
    >
      <SafeAreaView style={[styles.container, isMobile && styles.containerMobile]}>
        
        {/* --- NAVBAR SUPERIOR --- */}
        {isMobile ? (
          <View style={styles.headerRowMobile}>
            {/* Perfil (izquierda) */}
            <View style={[styles.headerSideMobile, styles.headerSideLeftMobile]}>
              <TouchableOpacity style={styles.profileIconMobile} activeOpacity={0.8}>
                <Image source={require('../../assets/images/Perfil.png')} style={styles.profileIconImage} />
              </TouchableOpacity>
            </View>

            {/* Monedas (centro) */}
            <View style={styles.headerCenterMobile}>
              <View style={[styles.coinsCard, styles.coinsCardMobile]}>
                <Image source={require('../../assets/images/SandDollars.png')} style={[styles.coinIcon, styles.coinIconMobile]} />
                <Text style={[styles.coinsText, styles.coinsTextMobile]}>{coins}</Text>
              </View>
            </View>

            {/* Logout (derecha) */}
            <View style={[styles.headerSideMobile, styles.headerSideRightMobile]}>
              <TouchableOpacity style={styles.profileIconMobile} activeOpacity={0.8}>
                <Image source={require('../../assets/images/LogOut.png')} style={styles.profileIconImage} />
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
                    onPress={() => handleNavigation(item.key)}
                  >
                    <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile]} />
                    <Text style={[styles.pillText, isMobile && styles.pillTextMobile]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.headerSide, styles.headerSideRight]}>
              <View style={styles.coinsCard}>
                <Image source={require('../../assets/images/SandDollars.png')} style={styles.coinIcon} />
                <Text style={styles.coinsText}>{coins}</Text>
              </View>
            </View>
          </View>
        )}

        {/* --- CONTENIDO PRINCIPAL ADAPTATIVO --- */}
        {isMobile ? (
          /* --- NUEVA DISTRIBUCIÓN MÓVIL: CONTENEDOR PARTIDO VERTICALMENTE --- */
          <View style={styles.mainContentMobileSplit}>
            
            {/* PARTE DE ARRIBA: COMPLETAMENTE ESTÁTICA */}
            <View style={styles.mobileStaticTopSection}>
              <Text style={styles.storeTitle}>Store</Text>
              <View style={[styles.featuredItemCard, styles.featuredItemCardMobile]}>
                <View style={styles.featuredPreviewPlaceholder} />
                <TouchableOpacity style={[styles.priceBadge, styles.featuredPriceBadge]} activeOpacity={0.8}>
                  <Image source={require('../../assets/images/SandDollars.png')} style={styles.priceCoinIcon} />
                  <Text style={styles.priceText}>10,0000</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* PARTE DE ABAJO: CUADRÍCULA CON SCROLL PROPIO */}
            <View style={styles.mobileScrollingBottomSection}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mobileItemsScrollContent}
              >
                <View style={styles.mobileGrid}>
                  {STORE_ITEMS_DATA.map((item) => (
                    <View key={item.id} style={styles.smallItemCardMobile}>
                      <View style={styles.itemPreviewPlaceholder} />
                      <TouchableOpacity style={styles.priceBadge} activeOpacity={0.8}>
                        <Image source={require('../../assets/images/SandDollars.png')} style={styles.priceCoinIcon} />
                        <Text style={styles.priceText}>{item.price}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
          /* --- DISEÑO ESCRITORIO WEB (DOS COLUMNAS PARALELAS) --- */
          <View style={styles.mainContentWeb}>
            <Text style={styles.storeTitleWeb}>Store</Text>
            
            <View style={styles.webDashboardLayout}>
              {/* Izquierda Estática */}
              <View style={[styles.featuredItemCard, styles.featuredItemCardWeb]}>
                <View style={styles.featuredPreviewPlaceholder} />
                <TouchableOpacity style={[styles.priceBadge, styles.featuredPriceBadge]} activeOpacity={0.8}>
                  <Image source={require('../../assets/images/SandDollars.png')} style={styles.priceCoinIcon} />
                  <Text style={styles.priceText}>10,0000</Text>
                </TouchableOpacity>
              </View>

              {/* Derecha con Scroll */}
              <View style={styles.smallItemsContainerWeb}>
                <ScrollView 
                  style={styles.smallItemsScrollWeb}
                  contentContainerStyle={styles.smallItemsScrollContentWeb}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.webGrid}>
                    {STORE_ITEMS_DATA.map((item) => (
                      <View key={item.id} style={styles.smallItemCardWeb}>
                        <View style={styles.itemPreviewPlaceholder} />
                        <TouchableOpacity style={styles.priceBadge} activeOpacity={0.8}>
                          <Image source={require('../../assets/images/SandDollars.png')} style={styles.priceCoinIcon} />
                          <Text style={styles.priceText}>{item.price}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {/* --- NAVBAR INFERIOR (SÓLO MOBILE) --- */}
        {isMobile && (
          <View style={styles.bottomNavbarMobile}>
            <View style={[styles.navIsland, styles.navIslandMobile]}>
              {visibleNavItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  style={[styles.navPill, isMobile && styles.navPillMobile]}
                  onPress={() => handleNavigation(item.key)}
                >
                  <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile]} />
                  <Text style={[styles.pillText, isMobile && styles.pillTextMobile]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}