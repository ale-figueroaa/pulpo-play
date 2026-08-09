// profile.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/profile.style';
import { getUserProfileByAuthId, getUserSandDollars } from '../../utils/db';
import { MOBILE_BREAKPOINT, NAV_ITEMS, STORE_ITEMS_DATA, StoreItem } from '../../utils/store';

const DEFAULT_EQUIPPED: StoreItem = STORE_ITEMS_DATA.find(item => item.id === 'basic') || STORE_ITEMS_DATA[0];

export default function ProfileScreen() {  const [coins, setCoins] = useState<number>(0);
  const [nombreUsuario, setNombreUsuario] = useState<string>('Explorer Diver');
  const [email, setEmail] = useState<string>('diver@pulpoplay.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [equippedItem, setEquippedItem] = useState<StoreItem>(DEFAULT_EQUIPPED);
  const [experienceLevel, setExperienceLevel] = useState<number>(0);

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || 'diver@pulpoplay.com');

        // Consultar perfil y monedas
        const profile = await getUserProfileByAuthId(user.id);
        if (profile?.nombreUsuario) {
          setNombreUsuario(profile.nombreUsuario);
        } else {
          setNombreUsuario(user.user_metadata?.nombreUsuario || 'Explorer Diver');
        }
        setExperienceLevel(profile?.experienceLevel || 0);

        const sandDollars = await getUserSandDollars(user.id);
        setCoins(sandDollars);

        // Consultar ítem equipado
        const metadata = user.user_metadata || {};
        if (metadata.equippedItem) {
          try {
            setEquippedItem(typeof metadata.equippedItem === 'string' ? JSON.parse(metadata.equippedItem) : metadata.equippedItem);
          } catch (e) {
            setEquippedItem(DEFAULT_EQUIPPED);
          }
        } else {
          const storedEquipped = await AsyncStorage.getItem(`pulpo_equipped_item_${user.id}`);
          if (storedEquipped) {
            try {
              setEquippedItem(JSON.parse(storedEquipped));
            } catch (e) {
              setEquippedItem(DEFAULT_EQUIPPED);
            }
          } else {
            setEquippedItem(DEFAULT_EQUIPPED);
          }
        }

        // Consultar última contraseña localmente
        const storedPass = await AsyncStorage.getItem(`pulpo_last_password_${user.id}`);
        if (storedPass) {
          setPassword(storedPass);
        } else {
          setPassword('••••••••••••');
        }
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
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

  const handleSaveName = async () => {
    if (!newName.trim()) return setIsEditingName(false);
    setSavingName(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('Usuario').update({ nombreUsuario: newName.trim() }).eq('idUsuario', user.id);
        await supabase.auth.updateUser({ data: { nombreUsuario: newName.trim() } });
        setNombreUsuario(newName.trim());
      }
    } catch (err) {
      console.error('Error updating name:', err);
    } finally {
      setSavingName(false);
      setIsEditingName(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim()) return setIsEditingPassword(false);
    setSavingPassword(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({ password: newPassword });
        await AsyncStorage.setItem(`pulpo_last_password_${user.id}`, newPassword);
        setPassword(newPassword);
      }
    } catch (err) {
      console.error('Error updating password:', err);
    } finally {
      setSavingPassword(false);
      setIsEditingPassword(false);
    }
  };

  const visibleNavItems = NAV_ITEMS;

  const currentLevel = Math.floor(experienceLevel / 100) + 1;
  const progressPercent = experienceLevel % 100;

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
                onPress={() => handleNavigation('profile')}
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
                    style={[styles.navPill, isMobile && styles.navPillMobile, item.key === 'profile' && styles.navPillActive]}
                    onPress={() => handleNavigation(item.key)}
                  >
                    <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile, item.key === 'profile' && styles.pillIconActive]} />
                    <Text style={[styles.pillText, isMobile && styles.pillTextMobile, item.key === 'profile' && styles.pillTextActive]}>{item.label}</Text>
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

        {/* --- CONTENIDO PRINCIPAL DEL PERFIL --- */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.profileCard}>

            {/* AVATAR DE PERFIL (OBJETO EN USO) */}
            <View style={styles.avatarCircle}>
              <Image source={equippedItem.image} style={styles.avatarImage} />
            </View>
            <View style={styles.equippedBadge}>
              <Text style={styles.equippedBadgeText}>In Use: {equippedItem.name}</Text>
            </View>

            {/* SISTEMA DE NIVELES */}
            <View style={styles.levelSection}>
              <Text style={styles.levelTitle}>Level {currentLevel}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.levelProgressText}>{progressPercent} / 100 XP until level {currentLevel + 1}</Text>
              
              <TouchableOpacity
                style={{ marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#EAF2FF', borderRadius: 20, alignSelf: 'center', borderWidth: 2, borderColor: '#B0CFFF' }}
                onPress={() => router.push('/adult-dashboard' as any)}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#3B629B', fontWeight: 'bold', fontSize: 16 }}>📈 See Progress</Text>
              </TouchableOpacity>
            </View>

            {/* CAMPOS DE INFORMACIÓN DEL USUARIO */}
            <View style={styles.infoSection}>

              <View style={styles.fieldBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  {!isEditingName && (
                    <TouchableOpacity onPress={() => { setIsEditingName(true); setNewName(nombreUsuario); }}>
                      <Text style={{ color: '#00897b', fontWeight: 'bold' }}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {!isEditingName ? (
                  <Text style={styles.fieldValue} testID="profile-username-text" id="profile-username-text">
                    {nombreUsuario}
                  </Text>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <TextInput
                      style={[styles.fieldValue, { flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 4, marginRight: 8 }]}
                      value={newName}
                      onChangeText={setNewName}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={handleSaveName}
                      disabled={savingName}
                      style={{ backgroundColor: '#00897b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
                    >
                      {savingName ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Confirm</Text>}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue} testID="profile-email-text" id="profile-email-text">
                  {email}
                </Text>
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.fieldLabel}>Current balance</Text>
                <Text style={styles.fieldValue}>
                  {coins} Sand Dollars
                </Text>
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.fieldLabel}>Password</Text>
                {!isEditingPassword ? (
                  <View style={styles.passwordRow}>
                    <Text style={styles.fieldValue} testID="profile-password-text" id="profile-password-text">
                      {showPassword ? password : '••••••••••••'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <TouchableOpacity
                        testID="profile-toggle-password-btn"
                        id="profile-toggle-password-btn"
                        style={styles.toggleBtn}
                        activeOpacity={0.8}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.toggleBtnText}>
                          {showPassword ? 'Hide' : 'Show'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setIsEditingPassword(true); setNewPassword(''); }}>
                        <Text style={{ color: '#00897b', fontWeight: 'bold' }}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <TextInput
                      style={[styles.fieldValue, { flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 4, marginRight: 8 }]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      placeholderTextColor="#999"
                      secureTextEntry
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={handleSavePassword}
                      disabled={savingPassword}
                      style={{ backgroundColor: '#00897b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
                    >
                      {savingPassword ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Confirm</Text>}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

            </View>

            {/* BOTÓN DE LOG OUT */}
            <TouchableOpacity
              testID="profile-logout-btn"
              id="profile-logout-btn"
              style={styles.logoutButton}
              activeOpacity={0.85}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        {/* --- NAVBAR INFERIOR (SÓLO MOBILE) --- */}
        {isMobile && (
          <View style={styles.bottomNavbarMobile}>
            <View style={[styles.navIsland, styles.navIslandMobile]}>
              {visibleNavItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  style={[styles.navPill, isMobile && styles.navPillMobile, item.key === 'profile' && styles.navPillActive]}
                  onPress={() => handleNavigation(item.key)}
                >
                  <Image source={item.icon} style={[styles.pillIcon, isMobile && styles.pillIconMobile, item.key === 'profile' && styles.pillIconActive]} />
                  <Text style={[styles.pillText, isMobile && styles.pillTextMobile, item.key === 'profile' && styles.pillTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}
