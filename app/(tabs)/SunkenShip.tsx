import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/sunkenShip.style';
import { addExperience, addSandDollars, saveGameSession } from '../../utils/db';
import OctavioHelper from '../../components/OctavioHelper';
import { STORE_ITEMS_DATA, StoreItem } from '../../utils/store';

const BASIC_ITEM = STORE_ITEMS_DATA.find(item => item.id === 'basic') || STORE_ITEMS_DATA[0];

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
type Cell = 'wall' | 'path';
type Grid = Cell[][];
interface Pos { row: number; col: number }

// ─────────────────────────────────────────────────────────────────
// Iterative maze generator (avoids stack overflow on large grids)
// ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMaze(rows: number, cols: number): Grid {
  // Start with all walls
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => 'wall')
  );

  // Iterative DFS using an explicit stack
  const stack: [number, number][] = [];
  grid[1][1] = 'path';
  stack.push([1, 1]);

  const DIRS: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const shuffled = shuffle(DIRS);
    let moved = false;
    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 'wall') {
        grid[r + dr / 2][c + dc / 2] = 'path';
        grid[nr][nc] = 'path';
        stack.push([nr, nc]);
        moved = true;
        break;
      }
    }
    if (!moved) stack.pop();
  }

  // Ensure start and end are always open
  grid[1][1] = 'path';
  grid[rows - 2][cols - 2] = 'path';
  return grid;
}

// ─────────────────────────────────────────────────────────────────
// Config per difficulty
// ─────────────────────────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
  1: { rows: 9, cols: 9, reward: 30, xp: 10, label: '⭐ Easy' },
  2: { rows: 13, cols: 13, reward: 50, xp: 20, label: '⭐⭐ Medium' },
  3: { rows: 17, cols: 17, reward: 80, xp: 30, label: '⭐⭐⭐ Hard' },
} as const;

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────
export default function SunkenShipScreen() {  const { width, height: windowHeight } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web';

  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [grid, setGrid] = useState<Grid>([]);
  const [playerPos, setPlayerPos] = useState<Pos>({ row: 1, col: 1 });
  const [visited, setVisited] = useState<Set<string>>(new Set(['1,1']));
  const [moves, setMoves] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [equippedItem, setEquippedItem] = useState<StoreItem>(BASIC_ITEM);

  // Use a ref for the timer so it's always stable across renders
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Octavio bounce/scale animation
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Keep difficulty accessible inside timer callbacks without stale closures
  const difficultyRef = useRef<1 | 2 | 3>(2);
  // Keep grid accessible inside handleMove without stale closures
  const gridRef = useRef<Grid>([]);

  // ── Timer helpers (stable refs — never recreated) ────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
  }, [stopTimer]);

  // ── Initialize / reset game ──────────────────────────────────
  const initGame = useCallback((diff: 1 | 2 | 3) => {
    difficultyRef.current = diff;
    const dcfg = DIFFICULTY_CONFIG[diff];
    const newGrid = buildMaze(dcfg.rows, dcfg.cols);
    gridRef.current = newGrid;  // keep ref in sync
    setDifficulty(diff);
    setGrid(newGrid);
    setPlayerPos({ row: 1, col: 1 });
    setVisited(new Set(['1,1']));
    setMoves(0);
    setShowWinModal(false);
    setRewardGranted(false);
    setElapsedSeconds(0);
    startTimer();
  }, [startTimer]);

  // ── Bounce animation when Octavio moves ─────────────────────
  const triggerBounce = useCallback(() => {
    bounceAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -7, duration: 70, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 3, duration: 70, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 70, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 130, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bounceAnim, scaleAnim]);

  // ── Load difficulty from storage and init on focus ───────────
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        let diff: 1 | 2 | 3 = 2;
        try {
          const stored = await AsyncStorage.getItem('pulpo_difficulty');
          if (stored) {
            const parsed = parseInt(stored, 10);
            if (parsed === 1 || parsed === 2 || parsed === 3) diff = parsed;
          }
        } catch (_) { }

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const metadata = user.user_metadata || {};
            if (metadata.equippedItem) {
              setEquippedItem(typeof metadata.equippedItem === 'string' ? JSON.parse(metadata.equippedItem) : metadata.equippedItem);
            } else {
              const storedEquipped = await AsyncStorage.getItem(`pulpo_equipped_item_${user.id}`);
              if (storedEquipped) {
                setEquippedItem(JSON.parse(storedEquipped));
              }
            }
          }
        } catch (_) {}

        initGame(diff);
      };
      load();
      // Cleanup: stop timer when screen loses focus
      return () => stopTimer();
    }, [initGame, stopTimer])
  );

  // ── Grant reward (only once per win) ─────────────────────────
  const grantReward = useCallback(async (diff: 1 | 2 | 3) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dcfg = DIFFICULTY_CONFIG[diff];
        await addSandDollars(user.id, dcfg.reward);
        await addExperience(user.id, dcfg.xp);
        
        // Save game session to backend table for progress tracking
        const minutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
        const correct = diff * 5; // e.g. 5, 10, 15 "correct" answers equivalents based on difficulty
        await saveGameSession(user.id, 'Sunken Ship Maze', minutes, correct, dcfg.xp);
      }
    } catch (err) {
      console.error('Error granting reward:', err);
    }
  }, []);


  // ── Handle player movement ───────────────────────────────────
  const handleMove = useCallback((dr: number, dc: number) => {
    const currentGrid = gridRef.current;
    const diff = difficultyRef.current;
    const dcfg = DIFFICULTY_CONFIG[diff];

    setPlayerPos(prev => {
      if (prev.row === -1) return prev; // sentinel for "won"
      const nr = prev.row + dr;
      const nc = prev.col + dc;

      // Bounds check
      if (nr < 0 || nr >= dcfg.rows || nc < 0 || nc >= dcfg.cols) return prev;
      // Wall check
      if (!currentGrid[nr] || currentGrid[nr][nc] === 'wall') return prev;

      // Valid move
      triggerBounce();
      setMoves(m => m + 1);

      // Check win condition
      if (nr === dcfg.rows - 2 && nc === dcfg.cols - 2) {
        stopTimer();
        setShowWinModal(true);
        if (!rewardGranted) {
          setRewardGranted(true);
          grantReward(diff);
        }
        return { row: -1, col: -1 };
      }

      setVisited(v => new Set(v).add(`${nr},${nc}`));
      return { row: nr, col: nc };
    });
  }, [triggerBounce, stopTimer, rewardGranted, grantReward]);

  // ── Keyboard Support for Web ─────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (showWinModal || gridRef.current.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          handleMove(-1, 0);
          e.preventDefault();
          break;
        case 'ArrowDown':
          handleMove(1, 0);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          handleMove(0, -1);
          e.preventDefault();
          break;
        case 'ArrowRight':
          handleMove(0, 1);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMove, showWinModal]);

  // ── Helpers ──────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const cfg = DIFFICULTY_CONFIG[difficulty];

  

  // Cell sizing: reserve space for d-pad panel on the right
  const dpadPanelWidth = isMobile ? 180 : 260;
  // Increase reserved width for larger gap, allow up to 700px on larger screens
  const maxMazeWidth = Math.min(width - dpadPanelWidth - 40, isMobile ? 460 : 700);
  
  // Header is ~40px, Title is ~80px. Total top elements ~120px. 
  // We need game area to fit in the remaining height.
  const reservedHeight = isMobile ? 140 : 180; // 140 to be safe on iOS
  const maxMazeHeight = Math.max(windowHeight - reservedHeight, 150);

  let cellSize = 0;
  if (grid.length > 0) {
    const cellSizeW = Math.floor(maxMazeWidth / cfg.cols);
    const cellSizeH = Math.floor(maxMazeHeight / cfg.rows);
    cellSize = Math.min(cellSizeW, cellSizeH);
  }

  // ── Cell rendering ───────────────────────────────────────────
  const isStart = (r: number, c: number) => r === 1 && c === 1;
  const isEnd = (r: number, c: number) => r === cfg.rows - 2 && c === cfg.cols - 2;
  const isPlayerCell = (r: number, c: number) =>
    playerPos.row === r && playerPos.col === c;

  const getCellBg = (r: number, c: number) => {
    if (grid[r]?.[c] === 'wall') return styles.cellWall;
    if (isPlayerCell(r, c)) return styles.cellPlayer;
    if (isStart(r, c) || isEnd(r, c)) return styles.cellStart;
    if (visited.has(`${r},${c}`)) return styles.cellVisited;
    return styles.cellPath;
  };

  const renderCellContent = (r: number, c: number) => {
    const imgSize = Math.max(cellSize * 0.78, 8);
    const elements = [];

    // Sunken ship always shown at start
    if (isStart(r, c)) {
      elements.push(
        <Image
          key="start-ship"
          source={require('../../assets/images/mazesunkenShip.png')}
          style={{ width: imgSize, height: imgSize, resizeMode: 'contain', opacity: 0.85, position: 'absolute' }}
        />
      );
    }

    // Treasure chest at end
    if (isEnd(r, c)) {
      elements.push(
        <Image
          key="end-chest"
          source={require('../../assets/images/tresureChest.png')}
          style={{ width: imgSize * 0.9, height: imgSize * 0.9, resizeMode: 'cover', borderRadius: 4, position: 'absolute' }}
        />
      );
    }

    // Octavio at player position
    if (isPlayerCell(r, c)) {
      elements.push(
        <Animated.Image
          key="player-octavio"
          source={equippedItem?.image || require('../../assets/images/OctavioBasic.png')}
          style={{
            width: imgSize,
            height: imgSize,
            resizeMode: 'contain',
            position: 'absolute',
            zIndex: 10,
            transform: [{ translateY: bounceAnim }, { scale: scaleAnim }],
          }}
        />
      );
    }

    if (elements.length > 0) {
      return (
        <View style={{ width: cellSize, height: cellSize, alignItems: 'center', justifyContent: 'center' }}>
          {elements}
        </View>
      );
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <LinearGradient
      colors={['#020e2e', '#03245a', '#0a3d8f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <OctavioHelper />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity
              testID="sunken-back-btn"
              id="sunken-back-btn"
              style={styles.backButton}
              onPress={() => router.push('/homepage')}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>

          {/* ── Title ── */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>⚓ Sunken Ship Maze</Text>
            <Text style={styles.subTitleText}>Guide Octavio to the treasure! 💰</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{cfg.label}</Text>
            </View>
          </View>

          {/* ── Maze + Side D-Pad ── */}
          {grid.length > 0 && cellSize > 0 && (
            <View style={styles.gameAreaRow}>

              {/* Maze grid */}
              <View style={styles.mazeWrapper}>
                <View style={[styles.mazeGrid, { width: cellSize * cfg.cols, height: cellSize * cfg.rows }]}>
                  {grid.map((row, r) => (
                    <View key={r} style={styles.mazeRow}>
                      {row.map((_, c) => (
                        <View
                          key={c}
                          style={[
                            styles.cell,
                            getCellBg(r, c),
                            { width: cellSize, height: cellSize },
                          ]}
                        >
                          {renderCellContent(r, c)}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>

              {/* D-Pad — right side panel */}
              <View style={[styles.dpadPanel, { width: dpadPanelWidth }]}>
                {/* Stats */}
                <View style={[styles.statsRow, { marginBottom: 8 }]}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>Moves</Text>
                    <Text style={styles.statValue}>{moves}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>Time</Text>
                    <Text style={styles.statValue}>{formatTime(elapsedSeconds)}</Text>
                  </View>
                </View>

                {/* UP */}
                <TouchableOpacity
                  testID="ctrl-up"
                  id="ctrl-up"
                  style={styles.controlBtn}
                  onPress={() => handleMove(-1, 0)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.controlBtnText}>▲</Text>
                </TouchableOpacity>

                {/* LEFT  DOWN  RIGHT */}
                <View style={styles.dpadMiddleRow}>
                  <TouchableOpacity
                    testID="ctrl-left"
                    id="ctrl-left"
                    style={styles.controlBtn}
                    onPress={() => handleMove(0, -1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.controlBtnText}>◀</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    testID="ctrl-down"
                    id="ctrl-down"
                    style={styles.controlBtn}
                    onPress={() => handleMove(1, 0)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.controlBtnText}>▼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    testID="ctrl-right"
                    id="ctrl-right"
                    style={styles.controlBtn}
                    onPress={() => handleMove(0, 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.controlBtnText}>▶</Text>
                  </TouchableOpacity>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendRow}>
                    <Image
                      source={require('../../assets/images/mazesunkenShip.png')}
                      style={styles.legendImg}
                    />
                    <Text style={styles.legendText}>Start</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <Image
                      source={require('../../assets/images/tresureChest.png')}
                      style={[styles.legendImg, { borderRadius: 4 }]}
                    />
                    <Text style={styles.legendText}>Goal</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <Image
                      source={equippedItem?.image || require('../../assets/images/OctavioBasic.png')}
                      style={styles.legendImg}
                    />
                    <Text style={styles.legendText}>You</Text>
                  </View>
                </View>

                {/* ── New Maze button ── */}
                <TouchableOpacity
                  testID="sunken-restart-btn"
                  id="sunken-restart-btn"
                  style={styles.resetButton}
                  onPress={() => initGame(difficulty)}
                >
                  <Text style={styles.resetButtonText}>🔄 New Maze</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>

        {/* ── Win Modal ── */}
        {showWinModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEmoji}>🎉🐙💰</Text>
              <Text style={styles.modalTitle}>Treasure Found!</Text>
              <Text style={styles.modalSubtitle}>
                Octavio escaped in {moves} moves • {formatTime(elapsedSeconds)}
              </Text>

              <View style={styles.rewardBadge}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardText}>+{cfg.reward} Sand Dollars!</Text>
              </View>

              <View style={[styles.rewardBadge, styles.rewardBadgeXP]}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={[styles.rewardText, styles.rewardTextXP]}>+{cfg.xp} XP Earned!</Text>
              </View>

              <TouchableOpacity
                testID="win-home-btn"
                id="win-home-btn"
                style={styles.modalPrimaryBtn}
                onPress={() => router.push('/homepage')}
              >
                <Text style={styles.modalPrimaryBtnText}>View Sand Dollars in Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="win-play-again-btn"
                id="win-play-again-btn"
                style={styles.modalSecondaryBtn}
                onPress={() => { setShowWinModal(false); initGame(difficulty); }}
              >
                <Text style={styles.modalSecondaryBtnText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
