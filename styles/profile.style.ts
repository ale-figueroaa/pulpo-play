// profile.style.ts
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

  // ================= NAVBAR SUPERIOR (MÓVIL) =================
  headerRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
  },
  headerSideMobile: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSideLeftMobile: {
    alignItems: 'flex-start',
  },
  headerSideRightMobile: {
    alignItems: 'flex-end',
  },
  headerCenterMobile: {
    alignItems: 'center',
    justifyContent: 'center',
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

  // ================= NAVBAR SUPERIOR (WEB ESCRITORIO) =================
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
    justifyContent: 'flex-start',
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)',
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
      web: { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 3 }
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
        boxShadow: '0px 6px 0px rgba(0,0,0,0.05)',
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

  bottomNavbarMobile: {
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 10 : 15,
    zIndex: 30,
  },

  // ================= CONTENIDO PERFIL =================
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0f2fe',
    borderWidth: 4,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  equippedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  equippedBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },

  // ================= SISTEMA DE NIVELES =================
  levelSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0369a1',
    marginBottom: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#e0f2fe',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 7,
  },
  levelProgressText: {
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '700',
  },

  infoSection: {
    width: '100%',
  },
  fieldBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleBtn: {
    backgroundColor: '#e2efff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf',
  },
  toggleBtnText: {
    color: '#1d4ed8',
    fontWeight: '800',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 18,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
