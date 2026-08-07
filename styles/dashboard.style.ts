import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    width: '100%',
    alignSelf: 'center',
    maxWidth: 1000,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#B0CFFF',
  },
  backButtonText: {
    color: '#3B629B',
    fontWeight: '900',
    fontSize: 16,
  },
  
  // --- Summary Cards ---
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap',
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: '#EAF2FF',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 6px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 3 }
    })
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#3B629B',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7F8C9D',
  },
  
  // --- Graph Section ---
  graphSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#EAF2FF',
    ...Platform.select({
      web: { boxShadow: '0px 8px 0px rgba(0,0,0,0.05)' },
      default: { elevation: 4 }
    })
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3B629B',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7F8C9D',
    fontWeight: '600',
    marginBottom: 30,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 250,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barsWrapper: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 10,
  },
  barMinutes: {
    width: 14,
    backgroundColor: '#5A9EFF',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barCorrect: {
    width: 14,
    backgroundColor: '#00897b',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B629B',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColorBlue: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#5A9EFF',
  },
  legendColorGreen: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#00897b',
  },
  legendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7F8C9D',
  },

  // --- Math Gate Modal ---
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 36, 90, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  gateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 40,
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#B0CFFF',
  },
  gateTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3B629B',
    marginBottom: 10,
    textAlign: 'center',
  },
  gateSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C9D',
    marginBottom: 30,
    textAlign: 'center',
  },
  mathProblem: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0a3575',
    marginBottom: 30,
  },
  gateInput: {
    width: '100%',
    backgroundColor: '#EAF2FF',
    borderRadius: 20,
    padding: 20,
    fontSize: 24,
    fontWeight: '900',
    color: '#3B629B',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#B0CFFF',
  },
  gateButton: {
    backgroundColor: '#00897b',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  gateButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  gateError: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  backToAppButton: {
    marginTop: 20,
    padding: 15,
  },
  backToAppText: {
    color: '#7F8C9D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activityList: {
    marginTop: 10,
    backgroundColor: '#FAFCFF',
    borderRadius: 20,
    padding: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAF2FF',
  },
  activityGameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B629B',
  },
  activityDate: {
    fontSize: 12,
    color: '#7F8C9D',
    marginTop: 2,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  activityStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00897b',
  }
});
