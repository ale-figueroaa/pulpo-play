import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d7a',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
    backgroundColor: '#004d7a',
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconEmoji: { fontSize: 38 },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28,
  },
  containerWeb: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
  },
  webLeftPanel: {
    flex: 1,
    backgroundColor: '#004d7a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    overflow: 'hidden',
  },
  webPanelEmoji: { fontSize: 72, marginBottom: 20 },
  webPanelTitle: {
    fontSize: 40, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12,
  },
  webPanelSub: {
    fontSize: 18, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', lineHeight: 28,
  },
  webBubble1: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -60, left: -60,
  },
  webBubble2: {
    position: 'absolute', width: 120, height: 120,
    borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)',
    top: 40, right: -30,
  },
  webBubble3: {
    position: 'absolute', width: 80, height: 80,
    borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)',
    top: 180, left: 40,
  },
  formWrapperWeb: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    padding: 64,
    alignItems: 'flex-start',
  },
  webFormTitle: {
    fontSize: 30, fontWeight: 'bold', color: '#004d7a', marginBottom: 6,
  },
  webFormSub: {
    fontSize: 15, color: '#7a8aaa', marginBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)', 
    elevation: 6,
  },
  cardWeb: {
    borderRadius: 20,
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)', 
    marginBottom: 20,
  },
  label: {
    fontSize: 13, fontWeight: '600', color: '#7a8aaa',
    marginBottom: 6, marginTop: 4,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#EEF2FF',
    height: 50, borderRadius: 14,
    paddingHorizontal: 18, fontSize: 15,
    color: '#1a2340', marginBottom: 14,
  },
  button: {
    backgroundColor: '#00897b',
    height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF', fontSize: 18, fontWeight: 'bold',
  },
  footerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14, fontWeight: '500', textAlign: 'center',
  },
  footerTextWeb: {
    color: '#004d7a',
  },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 54, marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22, fontWeight: 'bold', color: '#004d7a', marginBottom: 12, textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16, color: '#7a8aaa', textAlign: 'center', marginBottom: 24, lineHeight: 22,
  },
  modalBtn: {
    backgroundColor: '#00897b',
    paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 100,
    width: '100%', alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF', fontSize: 16, fontWeight: 'bold',
  },
});