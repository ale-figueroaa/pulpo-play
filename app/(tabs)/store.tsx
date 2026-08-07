// StoreScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { getUserSandDollars, addSandDollars } from '../../utils/db';

import { styles } from '../../styles/store.style';

import { MOBILE_BREAKPOINT, NAV_ITEMS, STORE_ITEMS_DATA, StoreItem } from '../../utils/store';

const BASIC_ITEM: StoreItem = STORE_ITEMS_DATA.find(item => item.id === 'basic') || STORE_ITEMS_DATA[0];

export default function StoreScreen() {
  const [coins, setCoins] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [equippedItem, setEquippedItem] = useState<StoreItem>(BASIC_ITEM);
  const [ownedItems, setOwnedItems] = useState<string[]>(['basic']);
  const [userId, setUserId] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const fetchStoreData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const sandDollars = await getUserSandDollars(user.id);
        setCoins(sandDollars);

        const metadata = user.user_metadata || {};

        if (metadata.equippedItem) {
          try {
            setEquippedItem(typeof metadata.equippedItem === 'string' ? JSON.parse(metadata.equippedItem) : metadata.equippedItem);
          } catch (e) {
            setEquippedItem(BASIC_ITEM);
          }
        } else {
          const storedEquipped = await AsyncStorage.getItem(`pulpo_equipped_item_${user.id}`);
          if (storedEquipped) {
            try {
              setEquippedItem(JSON.parse(storedEquipped));
            } catch (e) {
              setEquippedItem(BASIC_ITEM);
            }
          } else {
            setEquippedItem(BASIC_ITEM);
          }
        }

        if (metadata.ownedItems) {
          setOwnedItems(metadata.ownedItems);
        } else {
          const storedOwned = await AsyncStorage.getItem(`pulpo_owned_items_${user.id}`);
          if (storedOwned) {
            try {
              const parsedOwned = JSON.parse(storedOwned);
              setOwnedItems(Array.isArray(parsedOwned) ? parsedOwned : ['basic']);
            } catch (e) {
              setOwnedItems(['basic']);
            }
          } else {
            setOwnedItems(['basic']);
          }
        }
      }
    } catch (err) {
      console.error('Error loading store data:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoreData();
    }, [])
  );

  const handleNavigation = (key: string) => {
    if (key === 'streak') router.push('/(tabs)/streaks' as any);
    else if (key === 'worlds') router.push('/(tabs)/homepage' as any);
    else if (key === 'store') router.push('/(tabs)/store' as any);
    else if (key === 'profile') router.push('/(tabs)/profile' as any);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      router.replace('/login' as any);
    }
  };

  const visibleNavItems = NAV_ITEMS;

  const handlePriceClick = (item: StoreItem) => {
    setSelectedItem(item);
  };

  const handleEquipItem = async (item: StoreItem) => {
    setEquippedItem(item);
    if (userId) {
      await AsyncStorage.setItem(`pulpo_equipped_item_${userId}`, JSON.stringify(item));
      await supabase.auth.updateUser({
        data: { equippedItem: item }
      });
    }
    Alert.alert('Item Equipped!', `You are now wearing: ${item.name} 🐙✨`);
  };

  const confirmPurchase = async () => {
    if (!selectedItem || purchasing) return;
    const cost = Number(selectedItem.price.replace(/,/g, ''));
    if (isNaN(cost) || coins < cost) return;

    setPurchasing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await addSandDollars(user.id, -cost);
      }
      setCoins(prev => prev - cost);
      
      const newOwned = [...ownedItems, selectedItem.id];
      setOwnedItems(newOwned);
      setEquippedItem(selectedItem);

      if (userId) {
        await AsyncStorage.setItem(`pulpo_owned_items_${userId}`, JSON.stringify(newOwned));
        await AsyncStorage.setItem(`pulpo_equipped_item_${userId}`, JSON.stringify(selectedItem));
        await supabase.auth.updateUser({
          data: {
            ownedItems: newOwned,
            equippedItem: selectedItem
          }
        });
      }

      const purchasedName = selectedItem.name;
      setSelectedItem(null);
      Alert.alert('Purchase Successful!', `You have acquired "${purchasedName}" and it has been equipped automatically! 🐙✨`);
    } catch (err) {
      console.error('Error confirming purchase:', err);
      Alert.alert('Error', 'Could not complete the purchase. Try again.');
    } finally {
      setPurchasing(false);
    }
  };

  // Helper de renderizado para los botones de las tarjetas pequeñas
  const renderItemCardAction = (item: StoreItem, testIdPrefix: string) => {
    const isEquipped = equippedItem.id === item.id;
    const isOwned = ownedItems.includes(item.id);

    if (isEquipped) {
      return (
        <TouchableOpacity
          testID={`${testIdPrefix}-${item.id}`}
          id={`${testIdPrefix}-${item.id}`}
          style={[styles.priceBadge, styles.badgeInUse]}
          activeOpacity={0.8}
        >
          <Text style={styles.badgeInUseText}>✨ In Use</Text>
        </TouchableOpacity>
      );
    }

    if (isOwned) {
      return (
        <TouchableOpacity
          testID={`${testIdPrefix}-${item.id}`}
          id={`${testIdPrefix}-${item.id}`}
          style={[styles.priceBadge, styles.badgeEquip]}
          activeOpacity={0.8}
          onPress={() => handleEquipItem(item)}
        >
          <Text style={styles.badgeEquipText}>🎒 Equip</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        testID={`${testIdPrefix}-${item.id}`}
        id={`${testIdPrefix}-${item.id}`}
        style={styles.priceBadge}
        activeOpacity={0.8}
        onPress={() => handlePriceClick(item)}
      >
        <Image source={require('../../assets/images/SandDollars.png')} style={styles.priceCoinIcon} />
        <Text style={styles.priceText}>{item.price}</Text>
      </TouchableOpacity>
    );
  };

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
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/profile' as any)}
              >
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
              <TouchableOpacity
                style={styles.profileIconMobile}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
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
                    style={[styles.navPill, isMobile && styles.navPillMobile, item.key === 'store' && styles.navPillActive]}
                    onPress={() => handleNavigation(item.key)}
                  >
                    <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile, item.key === 'store' && styles.pillIconActive]} />
                    <Text style={[styles.pillText, isMobile && styles.pillTextMobile, item.key === 'store' && styles.pillTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.headerSide, styles.headerSideRight, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <View style={styles.coinsCard}>
                <Image source={require('../../assets/images/SandDollars.png')} style={styles.coinIcon} />
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

        {/* --- CONTENIDO PRINCIPAL ADAPTATIVO --- */}
        {isMobile ? (
          /* --- NUEVA DISTRIBUCIÓN MÓVIL: CONTENEDOR PARTIDO VERTICALMENTE --- */
          <View style={styles.mainContentMobileSplit}>

            {/* PARTE DE ARRIBA: OBJETO EQUIPADO / EN USO */}
            <View style={styles.mobileStaticTopSection}>
              <View style={[styles.featuredItemCard, styles.featuredItemCardMobile]}>
                <Image source={equippedItem.image} style={styles.itemImage} resizeMode="contain" />
                <Text style={styles.featuredItemTitle}>{equippedItem.name}</Text>
                <TouchableOpacity
                  testID="store-price-featured-mobile"
                  id="store-price-featured-mobile"
                  style={[styles.priceBadge, styles.badgeInUse]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.badgeInUseText}>✨ In Use</Text>
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
                  {STORE_ITEMS_DATA.filter(item => item.id !== equippedItem.id).map((item) => (
                    <View key={item.id} style={styles.smallItemCardMobile}>
                      <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                      {renderItemCardAction(item, 'store-price-mobile')}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
          /* --- DISEÑO ESCRITORIO WEB (DOS COLUMNAS PARALELAS) --- */
          <View style={styles.mainContentWeb}>

            <View style={styles.webDashboardLayout}>
              {/* Izquierda Estática: OBJETO EQUIPADO / EN USO */}
              <View style={[styles.featuredItemCard, styles.featuredItemCardWeb]}>
                <Image source={equippedItem.image} style={styles.itemImage} resizeMode="contain" />
                <Text style={styles.featuredItemTitle}>{equippedItem.name}</Text>
                <TouchableOpacity
                  testID="store-price-featured-web"
                  id="store-price-featured-web"
                  style={[styles.priceBadge, styles.badgeInUse]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.badgeInUseText}>✨ In Use</Text>
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
                    {STORE_ITEMS_DATA.filter(item => item.id !== equippedItem.id).map((item) => (
                      <View key={item.id} style={styles.smallItemCardWeb}>
                        <Image
                          source={item.image}
                          style={styles.itemImage}
                          resizeMode="contain"
                        />
                        {renderItemCardAction(item, 'store-price-web')}
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
                  style={[styles.navPill, isMobile && styles.navPillMobile, item.key === 'store' && styles.navPillActive]}
                  onPress={() => handleNavigation(item.key)}
                >
                  <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile, item.key === 'store' && styles.pillIconActive]} />
                  <Text style={[styles.pillText, isMobile && styles.pillTextMobile, item.key === 'store' && styles.pillTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* --- MODAL DE CONFIRMACIÓN DE COMPRA --- */}
        {selectedItem && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirm Purchase 🛒</Text>
              <Text style={styles.modalSubtitle}>Do you want to acquire this marine item?</Text>

              <View style={styles.modalItemBox}>
                <Image source={selectedItem.image} style={styles.modalItemImage} />
                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                <View style={styles.modalPriceRow}>
                  <Image source={require('../../assets/images/SandDollars.png')} style={styles.coinIcon} />
                  <Text style={styles.modalPriceText}>{selectedItem.price}</Text>
                </View>
              </View>

              {(() => {
                const itemCost = Number(selectedItem.price.replace(/,/g, ''));
                const canAfford = !isNaN(itemCost) && coins >= itemCost;

                return (
                  <>
                    {!canAfford && (
                      <Text style={styles.modalWarningText}>
                        ⚠️ Not enough Sand Dollars! You need {itemCost - coins} more.
                      </Text>
                    )}

                    <View style={styles.modalButtonsRow}>
                      <TouchableOpacity
                        testID="store-confirm-modal-cancel"
                        id="store-confirm-modal-cancel"
                        style={styles.cancelButton}
                        onPress={() => !purchasing && setSelectedItem(null)}
                        disabled={purchasing}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        testID="store-confirm-modal-buy"
                        id="store-confirm-modal-buy"
                        style={[
                          styles.confirmBuyButton,
                          (!canAfford || purchasing) && styles.confirmBuyButtonDisabled,
                        ]}
                        onPress={confirmPurchase}
                        disabled={!canAfford || purchasing}
                      >
                        {purchasing ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.confirmBuyButtonText}>
                            {canAfford ? 'Confirm purchase' : 'Insufficient balance'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}