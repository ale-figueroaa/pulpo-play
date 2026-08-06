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
    padding: 32,
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
    padding: 32,
    alignItems: 'center',
  },
  webFormTitle: {
    fontSize: 30, fontWeight: 'bold', color: '#004d7a', marginBottom: 6,
    width: '100%', maxWidth: 420,
  },
  webFormSub: {
    fontSize: 15, color: '#7a8aaa', marginBottom: 28,
    width: '100%', maxWidth: 420,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)', 
    elevation: 6,
  },
  cardWeb: {
    borderRadius: 20,
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)', 
    marginBottom: 20,
    width: '100%', maxWidth: 420,
  },
  label: {
    fontSize: 13, fontWeight: '600', color: '#7a8aaa',
    marginBottom: 4, marginTop: 2,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#EEF2FF',
    height: 44, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 15,
    color: '#1a2340', marginBottom: 10,
  },
  button: {
    backgroundColor: '#00897b',
    height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
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
});