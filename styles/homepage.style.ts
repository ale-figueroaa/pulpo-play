import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative', 
  },

  // ================= DESKTOP =================
  topNavbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30, 
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)', // Actualizado
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

  // --- Diálogos estables ---
  dialogWrapper: {
    alignSelf: 'center',       
    width: 480,
    marginTop: 35,             
    marginLeft: 320,           
    position: 'relative',
    zIndex: 20,
  },
  dialogWrapperMobile: {
    alignSelf: 'center',
    width: '100%',
    marginTop: 40,   
    marginRight: 0,
    marginLeft: 0, 
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
    bottom: -15,
    right: 35,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // ================= MUNDOS / PLANETAS DESKTOP =================
  worldsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -140, 
    marginBottom: 40,
  },
  worldCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  centerWorld: {
    width: 320,           
    height: 320,         
    marginHorizontal: 10, 
    zIndex: 10,
  },
  sideWorld: {
    width: 200,           
    height: 200,         
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
   
  // ================= CONTENEDORES Y BOTÓN PLAY =================
  centerWorldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  playButton: {
    backgroundColor: '#3B629B', 
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderWidth: 3,
    borderColor: '#B0CFFF', 
    marginTop: 15,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 0px rgba(0,0,0,0.15)', // Actualizado
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

  // ================= ESTILOS DEL CARRUSEL CONTROLADO MOBILE =================
  carouselWrapperMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 300, 
    marginTop: -150,    
    marginBottom: -20, 
  },
  centerWorldContainerMobile: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginHorizontal: -25, 
    transform: [{ translateY: 15 }], 
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
    backgroundColor: '#3B629B',
    borderRadius: 16,
    paddingVertical: 8, 
    paddingHorizontal: 35,
    borderWidth: 2,
    borderColor: '#B0CFFF',
    marginTop: 15, 
  },
  playButtonTextMobile: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});