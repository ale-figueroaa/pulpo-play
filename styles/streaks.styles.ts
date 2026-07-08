import { StyleSheet, Platform } from 'react-native';

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
    paddingTop: 55,
  },
  mainContentMobile: {
    paddingBottom: 110,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  mainContentWeb: {
    flex: 1,
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
    justifyContent: 'flex-start',
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
      default: { elevation: 3 },
    }),
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
      default: { elevation: 3 },
    }),
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
      },
    }),
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
      web: { cursor: 'pointer' },
    }),
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
  sectionTitleMobile: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
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
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCompleted: {
    backgroundColor: '#5A9EFF',
    borderWidth: 3,
    borderColor: '#EAF2FF',
  },
  dayUpcoming: {
    backgroundColor: '#F2F7FF',
    borderWidth: 2,
    borderColor: '#C0D4F0',
    borderStyle: 'dashed',
  },
  innerUpcomingCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D2E3FC',
  },
  dayText: {
    fontSize: 13,
    color: '#3B629B',
    fontWeight: '800',
  },

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
  milestoneCoinIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 15,
  },
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
    alignSelf: 'stretch',
  },
  milestonesContainerWeb: {
    flex: 1,
    height: '100%',
  },
  milestonesScrollWeb: {
    flex: 1,
    marginTop: 15,
  },
  milestonesScrollContentWeb: {
    gap: 15,
    paddingBottom: 20,
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