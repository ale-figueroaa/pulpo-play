import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: '#020e2e',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 60,
    paddingTop: 8,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    width: '100%',
    maxWidth: 700,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ── Title ───────────────────────────────────────────────────
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(100,180,255,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subTitleText: {
    fontSize: 13,
    color: 'rgba(160,210,255,0.85)',
    textAlign: 'center',
    marginTop: 2,
  },
  difficultyBadge: {
    marginTop: 5,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  difficultyText: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // ── Game area: maze + side d-pad ────────────────────────────
  gameAreaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginVertical: 6,
  },
  gameAreaMobile: {
    flexDirection: 'column',
    gap: 20,
  },

  // ── Maze wrapper ────────────────────────────────────────────
  mazeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mazeGrid: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(100,180,255,0.3)',
  },
  mazeRow: {
    flexDirection: 'row',
  },

  // ── Cells ───────────────────────────────────────────────────
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellWall: {
    backgroundColor: '#050f28',
  },
  cellPath: {
    backgroundColor: '#0d2a5a',
  },
  cellStart: {
    backgroundColor: '#0d2a5a',
  },
  cellEnd: {
    backgroundColor: '#0d2a5a',
  },
  cellVisited: {
    backgroundColor: '#112f6a',
  },
  cellPlayer: {
    backgroundColor: '#163a80',
  },
  cellEmoji: {
    textAlign: 'center',
  },

  // ── D-Pad side panel ────────────────────────────────────────
  dpadPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.25)',
  },
  dpadPanelMobile: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dpadMiddleRowMobile: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    gap: 0,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(100,180,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(100,180,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  controlBtnMobile: {
    width: 70,
    height: 45,
    borderRadius: 14,
  },

  // ── Legend (below d-pad) ─────────────────────────────────────
  legendContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 10,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  legendEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  legendText: {
    color: 'rgba(200,230,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Reset button ────────────────────────────────────────────
  resetButton: {
    marginTop: 2,
    backgroundColor: '#1565c0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ── Win modal ───────────────────────────────────────────────
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,14,46,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0a3d8f',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  rewardBadgeXP: {
    backgroundColor: '#e0f2fe',
    borderColor: '#3b82f6',
  },
  rewardIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  rewardEmoji: {
    fontSize: 24,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b45309',
  },
  rewardTextXP: {
    color: '#0369a1',
  },
  modalPrimaryBtn: {
    backgroundColor: '#00897b',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSecondaryBtn: {
    backgroundColor: '#EEF2FF',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: '#0a3d8f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
