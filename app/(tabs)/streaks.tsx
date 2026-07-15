import React from 'react';
import { Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

import { useStreaksLogic, NavItem, DayData, MilestoneData } from '../../utils/streaks';
import { styles } from '../../styles/streaks.styles';


export default function StreaksScreenWeb() {
  // Con esta línea, conectamos la vista con el "cerebro"
  const { coins, isMobile, visibleNavItems, DAYS_DATA, MILESTONES } = useStreaksLogic();

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
        
        {/* --- NAVBAR SUPERIOR --- */}
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
                {visibleNavItems.map((item: NavItem) => (
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
              {visibleNavItems.map((item: NavItem) => (
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