import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ── Contenedor raíz ────────────────────────────────────────────────
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingTop: 20,
  },
  containerMobile: {
    paddingHorizontal: '5%',
    paddingTop: 30,
  },

  // ── NAVBAR SUPERIOR DESKTOP ─────────────────────────────────────────
  topNavbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 30,
  },
  headerSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSideLeft:  { justifyContent: 'flex-start' },
  headerSideRight: { justifyContent: 'flex-end' },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── NAVBAR SUPERIOR MOBILE ──────────────────────────────────────────
  headerRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    zIndex: 30,
  },
  headerSideMobile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSideLeftMobile:  { justifyContent: 'flex-start' },
  headerSideRightMobile: { justifyContent: 'flex-end' },
  headerCenterMobile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Ícono de perfil / logout (círculo blanco) ───────────────────────
  profileIconMobile: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#B0CFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web:     { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 3 },
    }),
  },
  profileIconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  // ── Logo Pulpo Play ─────────────────────────────────────────────────
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
      web:     { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 3 },
    }),
  },
  logoTextTitle: { fontSize: 20, fontWeight: '900', color: '#3B629B', lineHeight: 30 },
  logoTextSub:   { fontSize: 20, fontWeight: '900', color: '#3B629B', lineHeight: 30 },

  // ── Monedas ─────────────────────────────────────────────────────────
  coinsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 22,
    height: 70,
    borderWidth: 3,
    borderColor: '#B0CFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 175,
    ...Platform.select({
      web:     { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 3 },
    }),
  },
  coinsCardMobile: {
    height: 54,
    paddingHorizontal: 12,
    minWidth: 0,
    borderRadius: 14,
  },
  coinIcon:       { width: 32, height: 32, resizeMode: 'contain', marginRight: 10 },
  coinIconMobile: { width: 22, height: 22, marginRight: 6 },
  coinsText:       { fontSize: 22, fontWeight: '900', color: '#3B629B' },
  coinsTextMobile: { fontSize: 16 },

  // ── Nav Island ──────────────────────────────────────────────────────
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
    ...Platform.select({ web: { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' } }),
  },
  navIslandMobile: {
    width: '100%',
    height: 60,
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
  },
  navPillMobile:     { paddingHorizontal: 6, marginHorizontal: 2 },
  pillIcon:          { width: 54, height: 54, resizeMode: 'contain', marginRight: 8 },
  pillIconMobile:    { width: 32, height: 32, marginRight: 1 },
  pillText:          { color: '#3B629B', fontSize: 22, fontWeight: '900' },
  pillTextMobile:    { fontSize: 14 },
  bottomNavbarMobile: {
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 10 : 15,
    zIndex: 30,
  },

  // ── CONTENIDO MOBILE ────────────────────────────────────────────────
  mainContentMobile: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  storeTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#C8006E',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  featuredCard: {
    width: '100%',
    backgroundColor: '#DDEEFF',
    borderRadius: 28,
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      web:     { boxShadow: '0px 6px 16px rgba(0,0,0,0.10)' },
      default: { elevation: 4 },
    }),
  },
  featuredImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  featuredPriceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Platform.select({
      web:     { boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  featuredPriceText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3B629B',
    marginLeft: 8,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B629B',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  itemsScrollContent: {
    paddingRight: 8,
  },
  itemCard: {
    backgroundColor: '#DDEEFF',
    borderRadius: 22,
    alignItems: 'center',
    padding: 14,
    marginRight: 14,
    width: 140,
    ...Platform.select({
      web:     { boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  itemPriceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Platform.select({
      web:     { boxShadow: '0px 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  itemPriceCoin: { width: 18, height: 18, resizeMode: 'contain' },
  itemPriceText: { fontSize: 14, fontWeight: '800', color: '#3B629B', marginLeft: 5 },

  // ── CONTENIDO DESKTOP ───────────────────────────────────────────────
  mainContentWeb: {
    flex: 1,
    paddingTop: 24,
  },
  storeTitleWeb: {
    fontSize: 48,
    fontWeight: '900',
    color: '#C8006E',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 2,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featuredCardWeb: {
    backgroundColor: '#DDEEFF',
    borderRadius: 32,
    alignItems: 'center',
    padding: 32,
    width: 320,
    ...Platform.select({
      web:     { boxShadow: '0px 8px 20px rgba(0,0,0,0.10)' },
      default: { elevation: 5 },
    }),
  },
  featuredBadge: {
    backgroundColor: '#C8006E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  featuredImageWeb: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 },
  featuredNameWeb:  { fontSize: 22, fontWeight: '800', color: '#3B629B', marginBottom: 12 },
  featuredPriceTagWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 12,
    ...Platform.select({
      web:     { boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  featuredCoinWeb: { width: 28, height: 28, resizeMode: 'contain' },
  featuredPriceTextWeb: { fontSize: 24, fontWeight: '900', color: '#3B629B', marginLeft: 8 },

  itemCardWeb: {
    backgroundColor: '#DDEEFF',
    borderRadius: 24,
    alignItems: 'center',
    padding: 20,
    width: 200,
    ...Platform.select({
      web:     { boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' },
      default: { elevation: 3 },
    }),
  },
  itemImageWeb:     { width: 120, height: 120, resizeMode: 'contain', marginBottom: 14 },
  itemNameWeb:      { fontSize: 16, fontWeight: '700', color: '#3B629B', marginBottom: 10 },
  itemPriceTagWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Platform.select({
      web:     { boxShadow: '0px 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  itemCoinWeb:      { width: 22, height: 22, resizeMode: 'contain' },
  itemPriceTextWeb: { fontSize: 16, fontWeight: '800', color: '#3B629B', marginLeft: 6 },
});