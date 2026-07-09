import React from 'react';
import { Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { styles } from '../../styles/store.style';

// 💡 CONFIGURACIÓN DEL MOCKUP
const IS_MOBILE = false; // Cambia a 'true' para visualizar la interfaz móvil
const MOCK_COINS = "1,250";

const MOCK_NAV_ITEMS = [
  { key: 'worlds', label: 'Worlds', icon: require('../../assets/images/SandDollars.png') },
  { key: 'streak', label: 'Streak', icon: require('../../assets/images/SandDollars.png') },
  { key: 'store', label: 'Store', icon: require('../../assets/images/SandDollars.png') },
];

const MOCK_FEATURED_ITEM = {
  id: 'f1',
  name: 'Volcano Island',
  price: 2500,
  image: require('../../assets/images/SandDollars.png'),
};

const MOCK_REST_ITEMS = [
  { id: '1', name: 'Coral Reef', price: 800, image: require('../../assets/images/SandDollars.png') },
  { id: '2', name: 'Deep Ocean', price: 1200, image: require('../../assets/images/SandDollars.png') },
  { id: '3', name: 'Ice Berg', price: 1500, image: require('../../assets/images/SandDollars.png') },
  { id: '4', name: 'Space Station', price: 2000, image: require('../../assets/images/SandDollars.png') },
];

export default function StoreScreenWeb() {
  return (
    <LinearGradient
      colors={['#99C1F9', '#C8E6FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={[styles.container, IS_MOBILE && styles.containerMobile]}>

        {/* ── NAVBAR SUPERIOR ─────────────────────────────────────── */}
        {IS_MOBILE ? (
          <View style={styles.headerRowMobile}>
            {/* Perfil (izquierda) */}
            <View style={[styles.headerSideMobile, styles.headerSideLeftMobile]}>
              <TouchableOpacity style={styles.profileIconMobile} activeOpacity={0.8}>
                <Image
                  source={require('../../assets/images/Perfil.png')}
                  style={styles.profileIconImage}
                />
              </TouchableOpacity>
            </View>

            {/* Monedas (centro) */}
            <View style={styles.headerCenterMobile}>
              <View style={[styles.coinsCard, styles.coinsCardMobile]}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={[styles.coinIcon, styles.coinIconMobile]}
                />
                <Text style={[styles.coinsText, styles.coinsTextMobile]}>{MOCK_COINS}</Text>
              </View>
            </View>

            {/* Logout (derecha) */}
            <View style={[styles.headerSideMobile, styles.headerSideRightMobile]}>
              <TouchableOpacity style={styles.profileIconMobile} activeOpacity={0.8}>
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
                {MOCK_NAV_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.8}
                    style={styles.navPill}
                  >
                    <Image source={item.icon} style={styles.pillIcon} />
                    <Text style={styles.pillText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.headerSide, styles.headerSideRight]}>
              <View style={styles.coinsCard}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={styles.coinIcon}
                />
                <Text style={styles.coinsText}>{MOCK_COINS}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── CONTENIDO PRINCIPAL ──────────────────────────────────── */}
        {IS_MOBILE ? (
          /* ── MOBILE ── */
          <ScrollView
            contentContainerStyle={styles.mainContentMobile}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.storeTitle}>Store</Text>

            {/* Tarjeta destacada */}
            <View style={styles.featuredCard}>
              <Image source={MOCK_FEATURED_ITEM.image} style={styles.featuredImage} />
              <View style={styles.featuredPriceTag}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={styles.coinIconMobile}
                />
                <Text style={styles.featuredPriceText}>
                  {MOCK_FEATURED_ITEM.price.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Fila de items adicionales */}
            <Text style={styles.rowTitle}>More Worlds</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.itemsScrollContent}
            >
              {MOCK_REST_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={styles.itemCard}
                >
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.itemPriceTag}>
                    <Image
                      source={require('../../assets/images/SandDollars.png')}
                      style={styles.itemPriceCoin}
                    />
                    <Text style={styles.itemPriceText}>
                      {item.price.toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        ) : (
          /* ── DESKTOP ── */
          <View style={styles.mainContentWeb}>
            <Text style={styles.storeTitleWeb}>Store</Text>

            <View style={styles.webGrid}>
              {/* Featured */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.featuredCardWeb}
              >
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
                </View>
                <Image source={MOCK_FEATURED_ITEM.image} style={styles.featuredImageWeb} />
                <Text style={styles.featuredNameWeb}>{MOCK_FEATURED_ITEM.name}</Text>
                <View style={styles.featuredPriceTagWeb}>
                  <Image
                    source={require('../../assets/images/SandDollars.png')}
                    style={styles.featuredCoinWeb}
                  />
                  <Text style={styles.featuredPriceTextWeb}>
                    {MOCK_FEATURED_ITEM.price.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Resto de items */}
              {MOCK_REST_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={styles.itemCardWeb}
                >
                  <Image source={item.image} style={styles.itemImageWeb} />
                  <Text style={styles.itemNameWeb}>{item.name}</Text>
                  <View style={styles.itemPriceTagWeb}>
                    <Image
                      source={require('../../assets/images/SandDollars.png')}
                      style={styles.itemCoinWeb}
                    />
                    <Text style={styles.itemPriceTextWeb}>
                      {item.price.toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── NAVBAR INFERIOR MOBILE ───────────────────────────────── */}
        {IS_MOBILE && (
          <View style={styles.bottomNavbarMobile}>
            <View style={[styles.navIsland, styles.navIslandMobile]}>
              {MOCK_NAV_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  style={[styles.navPill, styles.navPillMobile]}
                >
                  <Image source={item.icon} style={[styles.pillIcon, styles.pillIconMobile]} />
                  <Text style={[styles.pillText, styles.pillTextMobile]}>
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