import React from 'react';
import { Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { router } from 'expo-router'; 

// 1. Importamos la lógica y estilos
import { useHomeLogic, NavItem } from '../../utils/homepage';
import { styles } from '../../styles/homepage.style';

export default function HomeScreenWeb() {
  // 2. Extraemos todo lo que necesitamos de nuestro hook personalizado
  const {
    coins, showDialog, setShowDialog, touchStartX, changeWorld,
    isMobile, visibleNavItems, leftWorld, centerWorldItem, rightWorld
  } = useHomeLogic();

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

       {/* --- CONTENIDO CENTRAL --- */}
        <View style={styles.mainContent}>
          
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
              <View style={styles.avatarCircleDecorator} />
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
                <TouchableOpacity activeOpacity={0.9} style={[styles.worldCircle, styles.centerWorldMobile]}>
                  <Image source={centerWorldItem.image} style={styles.worldImage} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.playButtonMobile}>
                  <Text style={styles.playButtonTextMobile}>Play</Text>
                </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={0.9} style={[styles.worldCircle, styles.centerWorld]}>
                  <Image source={centerWorldItem.image} style={styles.worldImage} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.playButton}>
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
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