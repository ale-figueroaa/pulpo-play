import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, PanResponder, Animated, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { styles } from '../../styles/submarine.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import OctavioHelper from '../../components/OctavioHelper';
import { addExperience, addSandDollars } from '../../utils/db';

const DIFFICULTY_CONFIG = {
  easy: { reward: 10, xp: 20 },
  medium: { reward: 30, xp: 40 },
  hard: { reward: 50, xp: 80 },
};

const { width, height } = Dimensions.get('window');

type Difficulty = 'easy' | 'medium' | 'hard' | null;

interface ShapeData {
  id: number;
  type: 'circle' | 'square';
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
        styles[shape.type], 
        { backgroundColor: shape.color }, 
        isSelected && { borderWidth: 4, borderColor: '#FFD700', transform: [{ scale: 1.1 }] }
      ]} />
    </Animated.View>
  );
};

export default function SubmarineWorld() {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);
  
  const [greenState, setGreenState] = useState<'mad' | 'happy'>('mad');
  const [pinkState, setPinkState] = useState<'mad' | 'happy'>('mad');
  
  const [showWinModal, setShowWinModal] = useState(false);
  const [moves, setMoves] = useState(0);
  const [rewardGranted, setRewardGranted] = useState(false);
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      }
    } catch (err) {
      console.error('Error granting reward:', err);
    }
  };

  const greenShake = useRef(new Animated.Value(0)).current;
  const pinkShake = useRef(new Animated.Value(0)).current;
  
  const greenTimeout = useRef<NodeJS.Timeout | null>(null);
  const pinkTimeout = useRef<NodeJS.Timeout | null>(null);

  const startGame = (diff: Difficulty) => {
    let numShapes = 10;
    if (diff === 'easy') numShapes = 10;
    else if (diff === 'medium') numShapes = 15;
    else if (diff === 'hard') numShapes = 20;

    let newShapes: ShapeData[] = [];
    for (let i = 0; i < numShapes; i++) {
      const isGreen = i % 2 === 0;
      newShapes.push({
        id: Date.now() + i + Math.random(),
        type: isGreen ? 'circle' : 'square',
        color: isGreen ? '#4caf50' : '#f48fb1',
        targetMonster: isGreen ? 'green' : 'pink',
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
    setSelectedShapeId(id);
  };

  const handleMonsterClick = (monsterType: 'green' | 'pink') => {
    if (!selectedShapeId) return;
    const shape = shapes.find(s => s.id === selectedShapeId);
    if (!shape) return;

    setMoves(m => m + 1);

    if (shape.targetMonster === monsterType) {
      const newShapes = shapes.map(s => s.id === shape.id ? { ...s, isSorted: true } : s);
      setShapes(newShapes);
      triggerHappyAnimation(shape.targetMonster, newShapes);
      setSelectedShapeId(null);
    } else {
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

  const winTimeout = useRef<NodeJS.Timeout | null>(null);

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
          <View style={styles.monstersContainer}>
            {/* Green Monster */}
            <TouchableOpacity 
              style={styles.monsterZone}
              activeOpacity={0.8}
              onPress={() => handleMonsterClick('green')}
            >
              <View style={styles.heartBubble}>
                <Text style={styles.heartEmoji}>❤️</Text>
                <View style={[styles.circle, { width: 40, height: 40, backgroundColor: '#4caf50' }]} />
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
              <View style={styles.heartBubble}>
                <Text style={styles.heartEmoji}>❤️</Text>
                <View style={[styles.square, { width: 40, height: 40, backgroundColor: '#f48fb1' }]} />
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
              <Text style={styles.modalEmoji}>🎉🐙💰</Text>
              <Text style={styles.modalTitle}>Treasure Found!</Text>
              <Text style={styles.modalSubtitle}>
                Sorted in {moves} moves • {formatTime(elapsedSeconds)}
              </Text>

              <View style={styles.rewardBadge}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardText}>+{difficulty ? DIFFICULTY_CONFIG[difficulty].reward : 0} Sand Dollars!</Text>
              </View>

              <View style={[styles.rewardBadge, styles.rewardBadgeXP]}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={[styles.rewardText, styles.rewardTextXP]}>+{difficulty ? DIFFICULTY_CONFIG[difficulty].xp : 0} XP Earned!</Text>
              </View>

              <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => { setShowWinModal(false); router.push('/(tabs)/homepage' as any); }}>
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
