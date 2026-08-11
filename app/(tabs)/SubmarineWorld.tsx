import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import OctavioHelper from '../../components/OctavioHelper';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/submarine.style';
import { addExperience, addSandDollars, saveGameSession } from '../../utils/db';
import { soundManager } from '../../utils/audio';

const DIFFICULTY_CONFIG = {
  easy: { reward: 10, xp: 20 },
  medium: { reward: 30, xp: 40 },
  hard: { reward: 50, xp: 80 },
};

const { width, height } = Dimensions.get('window');

type Difficulty = 'easy' | 'medium' | 'hard' | null;

interface ShapeData {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon' | 'diamond';
  color: string;
  isSorted: boolean;
  targetMonster: 'green' | 'pink';
}

const DraggableShape = ({ shape, isSelected, onDrop, onClick }: { shape: ShapeData, isSelected: boolean, onDrop: (shape: ShapeData, dropX: number, dropY: number) => void, onClick: (id: number) => void }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const shapeRef = useRef(shape);
  const onDropRef = useRef(onDrop);
  const onClickRef = useRef(onClick);

  useEffect(() => {
    shapeRef.current = shape;
    onDropRef.current = onDrop;
    onClickRef.current = onClick;
  }, [shape, onDrop, onClick]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !shapeRef.current.isSorted,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        if (shapeRef.current.isSorted) return;

        // Treat it as a click if it hardly moved
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          onClickRef.current(shapeRef.current.id);
        } else {
          onDropRef.current(shapeRef.current, gesture.moveX, gesture.moveY);
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  if (shape.isSorted) {
    return <View style={[styles.shapeWrapper, { width: 60, height: 60, opacity: 0 }]} />;
  }

  return (
    <Animated.View
      style={[
        styles.shapeWrapper,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[
        { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
        isSelected && { borderWidth: 4, borderColor: '#FFD700', borderRadius: 8, transform: [{ scale: 1.1 }] }
      ]}>
        {shape.type === 'circle' && <View style={[styles.circle, { backgroundColor: shape.color }]} />}
        {shape.type === 'square' && <View style={[styles.square, { backgroundColor: shape.color }]} />}
        {shape.type === 'triangle' && <Text style={{ fontSize: 65, lineHeight: 65, color: shape.color, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 }}>▲</Text>}
        {shape.type === 'star' && <Text style={{ fontSize: 65, lineHeight: 65, color: shape.color, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 }}>★</Text>}
        {shape.type === 'diamond' && <Text style={{ fontSize: 65, lineHeight: 65, color: shape.color, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 }}>♦</Text>}
        {shape.type === 'hexagon' && <Text style={{ fontSize: 65, lineHeight: 65, color: shape.color, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 }}>⬢</Text>}
      </View>
    </Animated.View>
  );
};

export default function SubmarineWorld() {
  const { width, height: windowHeight } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 768;
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  const [greenState, setGreenState] = useState<'mad' | 'happy'>('mad');
  const [pinkState, setPinkState] = useState<'mad' | 'happy'>('mad');

  const [showWinModal, setShowWinModal] = useState(false);
  const [moves, setMoves] = useState(0);
  const [rewardGranted, setRewardGranted] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const maxColumns = Math.max(5, Math.ceil(shapes.length / 3));
  const dynamicMaxWidth = shapes.length > 0 ? maxColumns * 70 : 360;

  const grantReward = async (diff: Difficulty) => {
    if (!diff) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dcfg = DIFFICULTY_CONFIG[diff];
        await addSandDollars(user.id, dcfg.reward);
        await addExperience(user.id, dcfg.xp);

        let numShapes = 10;
        if (diff === 'easy') numShapes = 10;
        else if (diff === 'medium') numShapes = 15;
        else if (diff === 'hard') numShapes = 20;

        const minutesPlayed = Math.max(1, Math.round(elapsedSeconds / 60));
        await saveGameSession(user.id, 'Submarine Sort', minutesPlayed, numShapes, dcfg.xp);
      }
    } catch (err) {
      console.error('Error granting reward:', err);
    }
  };

  const greenShake = useRef(new Animated.Value(0)).current;
  const pinkShake = useRef(new Animated.Value(0)).current;

  const greenTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = (diff: Difficulty) => {
    let numShapes = 10;
    if (diff === 'easy') numShapes = 10;
    else if (diff === 'medium') numShapes = 15;
    else if (diff === 'hard') numShapes = 20;

    let greenTypes: any[] = ['circle'];
    let pinkTypes: any[] = ['square'];

    if (diff === 'medium' || diff === 'hard') {
      greenTypes.push('triangle');
      pinkTypes.push('star');
    }
    if (diff === 'hard') {
      greenTypes.push('diamond');
      pinkTypes.push('hexagon');
    }

    let newShapes: ShapeData[] = [];
    for (let i = 0; i < numShapes; i++) {
      const isGreen = i % 2 === 0;
      const targetMonster = isGreen ? 'green' : 'pink';
      const color = isGreen ? '#4caf50' : '#f48fb1';

      const typesList = isGreen ? greenTypes : pinkTypes;
      const type = typesList[Math.floor(Math.random() * typesList.length)];

      newShapes.push({
        id: Date.now() + i + Math.random(),
        type,
        color,
        targetMonster,
        isSorted: false
      });
    }

    newShapes.sort(() => Math.random() - 0.5);

    setShapes(newShapes);
    setDifficulty(diff);
    setGreenState('mad');
    setPinkState('mad');
    setShowWinModal(false);
    setMoves(0);
    setRewardGranted(false);
    setSelectedShapeId(null);
    setElapsedSeconds(0);
    startTimer();
  };

  const handleShapeClick = (id: number) => {
    soundManager.playSfx('tap');
    setSelectedShapeId(id);
  };

  const handleMonsterClick = (monsterType: 'green' | 'pink') => {
    if (!selectedShapeId) return;
    const shape = shapes.find(s => s.id === selectedShapeId);
    if (!shape) return;

    setMoves(m => m + 1);

    if (shape.targetMonster === monsterType) {
      soundManager.playSfx('correct');
      const newShapes = shapes.map(s => s.id === shape.id ? { ...s, isSorted: true } : s);
      setShapes(newShapes);
      triggerHappyAnimation(shape.targetMonster, newShapes);
      setSelectedShapeId(null);
    } else {
      soundManager.playSfx('tap');
      triggerMadShake(monsterType);
      setSelectedShapeId(null);
    }
  };

  const isGameWon = (currentShapes: ShapeData[]) => {
    return currentShapes.length > 0 && currentShapes.every(s => s.isSorted);
  };

  const triggerHappyAnimation = (monster: 'green' | 'pink', currentShapes: ShapeData[]) => {
    if (monster === 'green') {
      if (greenTimeout.current) clearTimeout(greenTimeout.current);
      setGreenState('happy');
      greenTimeout.current = setTimeout(() => {
        if (!isGameWon(currentShapes)) setGreenState('mad');
      }, 1000);
    } else {
      if (pinkTimeout.current) clearTimeout(pinkTimeout.current);
      setPinkState('happy');
      pinkTimeout.current = setTimeout(() => {
        if (!isGameWon(currentShapes)) setPinkState('mad');
      }, 1000);
    }
  };

  const triggerMadShake = (monster: 'green' | 'pink') => {
    const animValue = monster === 'green' ? greenShake : pinkShake;
    Animated.sequence([
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const handleDrop = (shape: ShapeData, dropX: number, dropY: number) => {
    // Assuming monsters are in the top 60% of the screen
    const isUpperHalf = dropY < height * 0.6;
    if (!isUpperHalf) return;

    const droppedOnGreen = dropX < width / 2;
    const droppedOnPink = dropX >= width / 2;

    setMoves(m => m + 1);

    let correct = false;
    if (droppedOnGreen && shape.targetMonster === 'green') correct = true;
    if (droppedOnPink && shape.targetMonster === 'pink') correct = true;

    if (correct) {
      const newShapes = shapes.map(s => s.id === shape.id ? { ...s, isSorted: true } : s);
      setShapes(newShapes);
      triggerHappyAnimation(shape.targetMonster, newShapes);
    } else {
      const target = droppedOnGreen ? 'green' : 'pink';
      triggerMadShake(target);
    }
  };

  const winTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isGameWon(shapes)) {
      stopTimer();
      setGreenState('happy');
      setPinkState('happy');
      if (!rewardGranted && difficulty) {
        setRewardGranted(true);
        grantReward(difficulty);
      }

      if (winTimeout.current) clearTimeout(winTimeout.current);
      winTimeout.current = setTimeout(() => {
        setShowWinModal(true);
      }, 500);
    }

    return () => {
      if (winTimeout.current) clearTimeout(winTimeout.current);
    };
  }, [shapes, rewardGranted, difficulty]);

  useFocusEffect(
    useCallback(() => {
      const initGame = async () => {
        const stored = await AsyncStorage.getItem('pulpo_difficulty');
        let diff: Difficulty = 'easy';
        if (stored === '2') diff = 'medium';
        if (stored === '3') diff = 'hard';
        startGame(diff);
      };
      initGame();

      return () => {
        if (winTimeout.current) clearTimeout(winTimeout.current);
        stopTimer();
      };
    }, [])
  );



  return (
    <LinearGradient colors={['#004d7a', '#008793']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <OctavioHelper />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/homepage' as any)}>
            <Text style={styles.backButtonText}>Quit</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Submarine Sort</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{moves}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatTime(elapsedSeconds)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gameArea}>
          <View style={[styles.monstersContainer, isMobile && styles.monstersContainerMobile]}>
            {/* Green Monster */}
            <TouchableOpacity
              style={styles.monsterZone}
              activeOpacity={0.8}
              onPress={() => handleMonsterClick('green')}
            >
              <View style={[styles.heartBubble, isMobile && styles.heartBubbleMobile]}>
                <Text style={styles.heartEmoji}>❤️</Text>
                <View style={[styles.circle, { width: 28, height: 28, backgroundColor: '#4caf50', marginHorizontal: 2 }]} />
                {(difficulty === 'medium' || difficulty === 'hard') && (
                  <Text style={{ fontSize: 24, color: '#4caf50', marginHorizontal: 2 }}>▲</Text>
                )}
                {difficulty === 'hard' && (
                  <Text style={{ fontSize: 24, color: '#4caf50', marginHorizontal: 2 }}>♦</Text>
                )}
              </View>
              <Animated.Image
                source={greenState === 'mad'
                  ? require('../../assets/images/greenMonsterMad.png')
                  : require('../../assets/images/greenMonsterHappy.png')}
                style={[styles.monsterImage, { transform: [{ translateX: greenShake }] }]}
              />
            </TouchableOpacity>

            {/* Pink Monster */}
            <TouchableOpacity
              style={styles.monsterZone}
              activeOpacity={0.8}
              onPress={() => handleMonsterClick('pink')}
            >
              <View style={[styles.heartBubble, isMobile && styles.heartBubbleMobile]}>
                <Text style={styles.heartEmoji}>❤️</Text>
                <View style={[styles.square, { width: 28, height: 28, backgroundColor: '#f48fb1', marginHorizontal: 2 }]} />
                {(difficulty === 'medium' || difficulty === 'hard') && (
                  <Text style={{ fontSize: 24, color: '#f48fb1', marginHorizontal: 2 }}>★</Text>
                )}
                {difficulty === 'hard' && (
                  <Text style={{ fontSize: 24, color: '#f48fb1', marginHorizontal: 2 }}>⬢</Text>
                )}
              </View>
              <Animated.Image
                source={pinkState === 'mad'
                  ? require('../../assets/images/pinkMonsterMad.png')
                  : require('../../assets/images/pinkMonsterHappy.png')}
                style={[styles.monsterImage, { transform: [{ translateX: pinkShake }] }]}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.shapesContainer, { maxWidth: dynamicMaxWidth }]}>
            {shapes.map((shape) => (
              <DraggableShape
                key={shape.id}
                shape={shape}
                isSelected={shape.id === selectedShapeId}
                onDrop={handleDrop}
                onClick={handleShapeClick}
              />
            ))}
          </View>
        </View>

        {showWinModal && (
          <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
            <View style={styles.modalCard}>
              <Image source={require('../../assets/images/OctavioBasic.png')} style={styles.modalImage} />
              <Text style={styles.modalTitle}>Treasure Found!</Text>
              <Text style={styles.modalSubtitle}>
                Sorted in {moves} moves • {formatTime(elapsedSeconds)}
              </Text>

              <View style={styles.rewardBadge}>
                <Image source={require('../../assets/images/SandDollars.png')} style={styles.rewardIcon} />
                <Text style={styles.rewardText}>+{difficulty ? DIFFICULTY_CONFIG[difficulty].reward : 0} Sand Dollars!</Text>
              </View>

              <View style={[styles.rewardBadge, styles.rewardBadgeXP]}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={[styles.rewardText, styles.rewardTextXP]}>+{difficulty ? DIFFICULTY_CONFIG[difficulty].xp : 0} XP Earned!</Text>
              </View>

              <TouchableOpacity 
                style={styles.modalPrimaryBtn} 
                onPress={() => { 
                  soundManager.playSfx('itemBought');
                  setShowWinModal(false); 
                  router.push('/(tabs)/homepage' as any); 
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>View Sand Dollars in Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => { setShowWinModal(false); startGame(difficulty); }}>
                <Text style={styles.modalSecondaryBtnText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
