import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions, Platform, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Ionicons } from '@expo/vector-icons'; 
import { supabase } from '../../lib/supabase'; 
import { router } from 'expo-router'; 

const MOBILE_BREAKPOINT = 768;

interface NavItem {
  key: string;
  label: string;
  icon: any;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'worlds', label: 'Worlds', icon: require('../../assets/images/Worlds.png') },
  { key: 'streak', label: 'Streak', icon: require('../../assets/images/Streak.png') },
  { key: 'store', label: 'Store', icon: require('../../assets/images/Store.png') },
  { key: 'profile', label: 'Profile', icon: require('../../assets/images/CoralReef.png') },
];

const DAYS_DATA = [
  { name: 'Mon', completed: true },
  { name: 'Tue', completed: true },
  { name: 'Wed', completed: true },
  { name: 'Thu', completed: true },
  { name: 'Fri', completed: true },
  { name: 'Sat', completed: false },
  { name: 'Sun', completed: false },
];

const MILESTONES = [
  { id: '1', days: 2, reward: 10 },
  { id: '2', days: 3, reward: 50 },
  { id: '3', days: 10, reward: 100 },
  { id: '4', days: 15, reward: 150 },
  { id: '5', days: 20, reward: 200 },
];

export default function StreaksScreenWeb() {
  const [coins, setCoins] = useState<number>(0);
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  useEffect(() => {
    fetchUserCoins();
  }, []);

  const fetchUserCoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles') 
          .select('coins')
          .eq('id', user.id)
          .single();

        if (data && !error) setCoins(data.coins);
      }
    } catch (err) {
      console.error('Error cargando monedas en streaks:', err);
    }
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
            <View style={[styles.headerSideMobile, styles.headerSideLeftMobile]}>
              <TouchableOpacity style={styles.profileIconMobile} activeOpacity={0.8}>
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
                {visibleNavItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.8}
                    style={[styles.navPill, isMobile && styles.navPillMobile]}
                    onPress={() => {
                      if (item.key === 'streak') {
                        router.push('/streaks');
                      } else if (item.key === 'worlds') {
                        router.push('/homepage');
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

            <View style={[styles.headerSide, styles.headerSideRight]}>
              <View style={styles.coinsCard}>
                <Image
                  source={require('../../assets/images/SandDollars.png')}
                  style={styles.coinIcon}
                />
                <Text style={styles.coinsText}>{coins}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= CONTENIDO PRINCIPAL ADAPTATIVO ================= */}
        {isMobile ? (
          /* --- CONTENEDOR EN MÓVIL (SCROLL GLOBAL) --- */
          <ScrollView 
            contentContainerStyle={styles.mainContentMobile}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.weeklyCard}>
              <Text style={styles.sectionTitleMobile}>Weekly Streak</Text>
              <View style={styles.daysRowMobile}>
                {DAYS_DATA.slice(0, 4).map((day, idx) => (
                  <View key={idx} style={styles.dayItem}>
                    <View style={[styles.dayCircle, day.completed ? styles.dayCompleted : styles.dayUpcoming]}>
                      {day.completed ? <Ionicons name="checkmark" size={20} color="#FFFFFF" /> : <View style={styles.innerUpcomingCircle} />}
                    </View>
                    <Text style={styles.dayText}>{day.name}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.daysRowMobile}>
                {DAYS_DATA.slice(4, 7).map((day, idx) => (
                  <View key={idx} style={styles.dayItem}>
                    <View style={[styles.dayCircle, day.completed ? styles.dayCompleted : styles.dayUpcoming]}>
                      {day.completed ? <Ionicons name="checkmark" size={20} color="#FFFFFF" /> : <View style={styles.innerUpcomingCircle} />}
                    </View>
                    <Text style={styles.dayText}>{day.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.milestonesContainer}>
              <Text style={styles.sectionTitleMobile}>Milestones Rewards</Text>
              {MILESTONES.map((milestone) => (
                <View key={milestone.id} style={styles.milestoneCard}>
                  <Image source={require('../../assets/images/SandDollars.png')} style={styles.milestoneCoinIcon} />
                  <View style={styles.milestoneTextContainer}>
                    <Text style={styles.milestoneTitle}>{milestone.days} Days Streak</Text>
                    <Text style={styles.milestoneReward}>+{milestone.reward} Sand Dollars</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* --- CONTENEDOR ESCRITORIO WEB (VISTA DE DOS COLUMNAS INDEPENDIENTES) --- */
          <View style={styles.mainContentWeb}>
            <View style={styles.webDashboardLayout}>
              
              {/* Columna Izquierda: Racha Semanal (COMPLETAMENTE ESTÁTICA) */}
              <View style={[styles.weeklyCard, styles.weeklyCardWeb]}>
                <Text style={styles.sectionTitleWeb}>Your Weekly Splash Streak</Text>
                <Text style={styles.sectionSubTitleWeb}>Keep the momentum going to unlock chest rewards!</Text>
                
                <View style={styles.daysRowWeb}>
                  {DAYS_DATA.map((day, idx) => (
                    <View key={idx} style={styles.dayItemWeb}>
                      <View style={[styles.dayCircleWeb, day.completed ? styles.dayCompletedWeb : styles.dayUpcomingWeb]}>
                        {day.completed ? (
                          <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                        ) : (
                          <View style={styles.innerUpcomingCircleWeb} />
                        )}
                      </View>
                      <Text style={[styles.dayTextWeb, day.completed && styles.dayTextActiveWeb]}>{day.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Columna Derecha: Hitos de Recompensa (CON SCROLL PROPIO) */}
              <View style={styles.milestonesContainerWeb}>
                <Text style={styles.sectionTitleWeb}>Streak Milestones</Text>
                
                <ScrollView 
                  style={styles.milestonesScrollWeb}
                  contentContainerStyle={styles.milestonesScrollContentWeb}
                  showsVerticalScrollIndicator={false}
                >
                  {MILESTONES.map((milestone) => (
                    <View key={milestone.id} style={[styles.milestoneCard, styles.milestoneCardWeb]}>
                      <Image source={require('../../assets/images/SandDollars.png')} style={styles.milestoneCoinIconWeb} />
                      <View style={styles.milestoneTextContainer}>
                        <Text style={styles.milestoneTitleWeb}>{milestone.days} Days Milestone</Text>
                        <Text style={styles.milestoneRewardWeb}>{milestone.reward} Sand Dollars Reward</Text>
                      </View>
                      <View style={styles.claimBadgeWeb}>
                        <Text style={styles.claimBadgeText}>Locked</Text>
                      </View>
                    </View>
                  ))}
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
                  onPress={() => {
                    if (item.key === 'streak') {
                      router.push('/streaks');  
                    } else if (item.key === 'worlds') {
                      router.push('/homepage'); 
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

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingTop: 20,
    width: '100%',
    alignSelf: 'center',    
    maxWidth: 1400,          
  },
  containerMobile: {
    paddingHorizontal: '5%',
    paddingTop: 55, 
  },
  mainContentMobile: {
    paddingBottom: 110,
    paddingTop: 10,       
    paddingHorizontal: 16, 
  },
  mainContentWeb: {
    flex: 1,               // Toma todo el espacio disponible restante abajo de la navbar
    paddingVertical: 20,   
    paddingHorizontal: 32, 
    marginBottom: 20,
  },

  // ================= DESKTOP NAV =================
  topNavbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30, 
    marginBottom: 40,      
    zIndex: 50, 
    paddingHorizontal: '5%', 
  },
  headerSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSideLeft: {
    justifyContent: 'flex-start'
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ================= MOBILE NAV =================
  headerRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,      
    zIndex: 30,
  },
  headerSideMobile: {
    flex: 1,
  },
  headerSideLeftMobile: {
    alignItems: 'flex-start',
  },
  headerSideRightMobile: {
    alignItems: 'flex-end', 
  },
  headerCenterMobile: {
    flex: 2, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavbarMobile: {
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 10 : 15, 
    zIndex: 30,
  },

  // --- Logo ---
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    height: 70,
    borderWidth: 3,
    borderColor: '#B0CFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    ...Platform.select({
      web: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 0,
        shadowOpacity: 1,
      },
      default: { elevation: 3 }
    })
  },
  logoCardMobile: {
    height: 54,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 0,
    borderRadius: 14,
  },
  logoTextTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3B629B',
    lineHeight: 30,
  },
  logoTextSub: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3B629B',
    lineHeight: 30,
  },

  // --- Monedas ---
  coinsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20, 
    height: 70,
    borderWidth: 3,
    borderColor: '#B0CFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150, 
    ...Platform.select({
      web: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 0,
        shadowOpacity: 1,
      },
      default: { elevation: 3 }
    })
  },
  coinsCardMobile: {
    height: 54,
    width: '105%', 
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  coinIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 10,
  },
  coinIconMobile: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  coinsText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3B629B',
  },
  coinsTextMobile: {
    fontSize: 18,
  },

  // --- Nav Island ---
  navIsland: {
    backgroundColor: '#EAF2FF',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 3,
    borderColor: '#B0CFFF',
    height: 70,
    ...Platform.select({
      web: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 0,
        shadowOpacity: 1,
      }
    })
  },
  navIslandMobile: {
    width: '100%',        
    alignSelf: 'center', 
    height: 80,
    paddingHorizontal: 6,
    borderRadius: 22,
  },
  navPill: {
    flexDirection: 'row',     
    alignItems: 'center',    
    justifyContent: 'center', 
    paddingVertical: 4,
    paddingHorizontal: 22,
    marginHorizontal: 10,
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  navPillMobile: {
    flexDirection: 'column',  
    alignItems: 'center',     
    justifyContent: 'center', 
    paddingHorizontal: 1,
    marginHorizontal: 1,
  },
  pillIcon: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
    marginRight: 8,
  },
  pillIconMobile: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
    marginBottom: -8, 
  },
  pillText: {
    color: '#3B629B',
    fontSize: 22,
    fontWeight: '900',
  },
  pillTextMobile: {
    color: '#3B629B',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 16, 
  },

  profileIconMobile: {
    width: 54,
    height: 54,
  },
  profileIconImage: {
    marginTop: 3,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // ================= ESTILOS PROPIOS DEL CONTENIDO DE RACHAS =================
  sectionTitleMobile: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 15, textAlign: 'center' },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#EAF2FF',
  },
  daysRowMobile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayItem: { alignItems: 'center', flex: 1 },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCompleted: { backgroundColor: '#5A9EFF', borderWidth: 3, borderColor: '#EAF2FF' },
  dayUpcoming: { backgroundColor: '#F2F7FF', borderWidth: 2, borderColor: '#C0D4F0', borderStyle: 'dashed' },
  innerUpcomingCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#D2E3FC' },
  dayText: { fontSize: 13, color: '#3B629B', fontWeight: '800' },

  milestonesContainer: { width: '100%' },
  milestoneCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#EAF2FF',
  },
  milestoneCoinIcon: { width: 50, height: 50, resizeMode: 'contain', marginRight: 15 },
  milestoneTextContainer: { flex: 1 },
  milestoneTitle: { color: '#3B629B', fontSize: 16, fontWeight: '900' },
  milestoneReward: { color: '#5A9EFF', fontSize: 14, fontWeight: '800' },

  // --- DISEÑO ESCRITORIO WEB CONTENIDO MÁS FLEXIBLE ---
  webDashboardLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 30,
  },
  weeklyCardWeb: {
    flex: 1.3,
    padding: 35,
    marginBottom: 0,
    justifyContent: 'center',
    alignSelf: 'stretch',     // Se estira al alto completo disponible de forma fija
  },
  milestonesContainerWeb: {
    flex: 1,
    height: '100%',           // Forzamos que use el alto completo para que el scroll interno funcione
  },
  milestonesScrollWeb: {
    flex: 1,
    marginTop: 15,
  },
  milestonesScrollContentWeb: {
    gap: 15,
    paddingBottom: 20,        // Aire al final del scroll para que no pegue con el fondo
  },
  sectionTitleWeb: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0a3575',
    marginBottom: 5,
  },
  sectionSubTitleWeb: {
    fontSize: 16,
    color: '#7F8C9D',
    fontWeight: '600',
    marginBottom: 40,
  },
  daysRowWeb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  dayItemWeb: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircleWeb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayCompletedWeb: {
    backgroundColor: '#3B629B',
    borderWidth: 4,
    borderColor: '#B0CFFF',
  },
  dayUpcomingWeb: {
    backgroundColor: '#F5F9FF',
    borderWidth: 3,
    borderColor: '#CBDFFF',
    borderStyle: 'dashed',
  },
  innerUpcomingCircleWeb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBDFFF',
  },
  dayTextWeb: {
    fontSize: 16,
    color: '#A0B8DD',
    fontWeight: '800',
  },
  dayTextActiveWeb: {
    color: '#3B629B',
    fontWeight: '900',
  },
  milestoneCardWeb: {
    marginBottom: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#B0CFFF',
  },
  milestoneCoinIconWeb: {
    width: 65,
    height: 65,
    marginRight: 20,
  },
  milestoneTitleWeb: {
    fontSize: 19,
    fontWeight: '900',
    color: '#3B629B',
    marginBottom: 3,
  },
  milestoneRewardWeb: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5A9EFF',
  },
  claimBadgeWeb: {
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  claimBadgeText: {
    color: '#888888',
    fontWeight: '800',
    fontSize: 13,
  },
});