import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingTop: 45,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  seaweedDecorationRight1: {
    position: 'absolute',
    bottom: -15,
    right: 0,
    width: 200,
    height: 250,
    resizeMode: 'contain',
    zIndex: 2,
    opacity: 0.85,
  },
  seaweedDecorationRight2: {
    position: 'absolute',
    bottom: -30,
    right: 80,
    width: 230,
    height: 280,
    resizeMode: 'contain',
    zIndex: 1,
    opacity: 0.6,
  },
  seaweedDecorationRight1Mobile: {
    width: 120,
    height: 150,
    bottom: -5,
  },
  seaweedDecorationRight2Mobile: {
    width: 140,
    height: 170,
    bottom: -15,
    right: 40,
  },
  bubbleSingleTopLeft: {
    position: 'absolute',
    top: 40,
    left: 10,
    width: 28,
    height: 28,
    resizeMode: 'contain',
    zIndex: 4,
    opacity: 0.75,
  },
  bubbleSingleTopRight: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 22,
    height: 22,
    resizeMode: 'contain',
    zIndex: 4,
    opacity: 0.7,
  },
  bubbleThreeCenter: {
    position: 'absolute',
    top: 190,
    right: 80,
    width: 110,
    height: 110,
    resizeMode: 'contain',
    zIndex: 2,
    opacity: 0.35,
  },
  bubbleThreeLeft: {
    position: 'absolute',
    top: 240,
    left: 40,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 1,
    opacity: 0.3,
  },
  bubbleSingleBottomLeft: {
    position: 'absolute',
    bottom: 120,
    left: 30,
    width: 26,
    height: 26,
    resizeMode: 'contain',
    zIndex: 3,
    opacity: 0.65,
  },
  bubbleSingleBottomRight: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 32,
    height: 32,
    resizeMode: 'contain',
    zIndex: 4,
    opacity: 0.7,
  },
  backgroundOctavio: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 250,
    height: 250,
    resizeMode: 'contain',
    zIndex: 5,
    opacity: 0.9,
  },
  backgroundOctavioMobile: {
    width: 120,
    height: 120,
    top: 60,
    left: -10,
  },

  // ================= DESKTOP =================
  topNavbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    zIndex: 50,
    paddingHorizontal: '3%',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },

  // ================= MOBILE =================
  headerRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)', // Actualizado a boxShadow para web
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)', // Actualizado
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)', 
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
    paddingHorizontal: 12,
    marginHorizontal: 5,
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

  // --- Diálogos estables ---
  dialogWrapper: {
    position: 'absolute',
    top: 120,
    left: 280,
    width: 380,
    zIndex: 20,
  },
  dialogWrapperMobile: {
    position: 'absolute',
    top: 55,
    left: 110,
    width: 240,
  },
  dialogBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: '#E2EEFF',
    ...Platform.select({
      web: {
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)', // Actualizado
      }
    })
  },
  dialogTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  dialogText: {
    color: '#7F8C9D',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  avatarCircleDecorator: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#5C96FF',
  },
  dialogOctopus: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 6,
  },
  dialogTail: {
    position: 'absolute',
    top: '50%',
    left: -16,
    marginTop: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 16,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },

  // ================= MUNDOS / PLANETAS DESKTOP =================
  worldsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  worldCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  centerWorld: {
    width: 240,
    height: 240,
    marginHorizontal: 10,
    zIndex: 10,
  },
  sideWorld: {
    width: 140,
    height: 140,
    zIndex: 5,
    opacity: 0.85,
    marginHorizontal: 15,
    transform: [{ translateY: -25 }],
  },
  worldImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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


  // ================= CONTENEDORES Y BOTÓN PLAY =================
  centerWorldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  gameTitleWeb: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: 15,
    zIndex: 20,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#3B82F6', // Solid blue without shadows
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 45,
    marginTop: 15,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  difficultyContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 32,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  starActive: {
    color: '#FCD34D', // Gold
  },
  starInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
  difficultyLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // ================= ESTILOS DEL CARRUSEL CONTROLADO MOBILE =================
  carouselWrapperMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
  },
  centerWorldContainerMobile: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
    marginHorizontal: -25,
    transform: [{ translateY: 15 }],
  },
  gameTitleMobile: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
    zIndex: 20,
    textAlign: 'center',
  },
  centerWorldMobile: {
    width: 225,
    height: 225,
    zIndex: 10,
  },
  sideWorldMobile: {
    width: 135,
    height: 135,
    marginHorizontal: 8,
    zIndex: 5,
    opacity: 0.70,
    transform: [{ translateY: -35 }],
  },
  playButtonMobile: {
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    paddingVertical: 12, 
    paddingHorizontal: 40,
    marginTop: 15, 
  },
  playButtonTextMobile: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  difficultyContainerMobile: {
    alignItems: 'center',
    marginTop: 12,
    zIndex: 100,
    elevation: 10,
  },
  starsRowMobile: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
    zIndex: 100,
    elevation: 10,
  },
  starIconMobile: {
    fontSize: 26,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  difficultyLabelMobile: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});