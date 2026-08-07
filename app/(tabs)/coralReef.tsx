import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { styles } from '../../styles/coralReef.style';
import { addExperience, addSandDollars, saveGameSession } from '../../utils/db';
import OctavioHelper from '../../components/OctavioHelper';

interface Creature {
  id: string;
  emoji: string;
  name: string;
}

interface CardItem extends Creature {
  uniqueId: string;
}

const MARINE_CREATURES: Creature[] = [
  { id: 'pulpo', emoji: '🐙', name: 'Octopus' },
  { id: 'coral', emoji: '🪸', name: 'Coral' },
  { id: 'tortuga', emoji: '🐢', name: 'Turtle' },
  { id: 'pez', emoji: '🐠', name: 'Clownfish' },
  { id: 'delfin', emoji: '🐬', name: 'Dolphin' },
  { id: 'cangrejo', emoji: '🦀', name: 'Crab' },
  { id: 'tiburon', emoji: '🦈', name: 'Shark' },
  { id: 'ballena', emoji: '🐋', name: 'Whale' },
  { id: 'medusa', emoji: '🪼', name: 'Jellyfish' },
  { id: 'estrella', emoji: '⭐', name: 'Starfish' },
];

const MemoramaCard = ({ card, isMobile, isCardFlipped, isCardMatched, onPress, cardSize }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  const wasMatched = useRef(isCardMatched);

  useEffect(() => {
    if (isCardMatched && !wasMatched.current) {
      wasMatched.current = true;
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
    }
  }, [isCardMatched, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        testID={`memorama-card-${card.uniqueId}`}
        id={`memorama-card-${card.uniqueId}`}
        activeOpacity={0.8}
        style={[
          styles.card,
          isMobile && styles.cardMobile,
          isCardMatched ? styles.cardMatched : isCardFlipped ? styles.cardUp : styles.cardDown,
        ]}
        onPress={() => onPress(card)}
      >
        {isCardFlipped || isCardMatched ? (
          <>
            <Text style={[styles.cardEmoji, isMobile && styles.cardEmojiMobile]}>
              {card.emoji}
            </Text>
            <Text style={[styles.cardLabel, isCardMatched && styles.cardLabelMatched]}>
              {card.name}
            </Text>
          </>
        ) : (
          <Text style={styles.cardBackEmoji}>🌊</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CoralReefScreen() {
  const { width, height: windowHeight } = useWindowDimensions();
  const isMobile = width < 640;

  const [difficulty, setDifficulty] = useState<number>(2);

  const numPairs = difficulty === 1 ? 4 : difficulty === 3 ? 7 : 6;
  const rewardAmount = difficulty === 1 ? 30 : difficulty === 3 ? 80 : 50;
  const xpReward = difficulty === 1 ? 10 : difficulty === 3 ? 30 : 20;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [rewardGranted, setRewardGranted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else if (countdown === 0) {
        setPreviewMode(true);
        const timer = setTimeout(() => {
          setPreviewMode(false);
          setIsProcessing(false);
          setCountdown(null);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [countdown]);

  // Se reinicia automáticamente cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      const loadGame = async () => {
        let diff = 2;
        try {
          const stored = await AsyncStorage.getItem('pulpo_difficulty');
          if (stored) diff = parseInt(stored, 10);
        } catch (e) { }
        setDifficulty(diff);

        const activeNumPairs = diff === 1 ? 4 : diff === 3 ? 7 : 6;

        const deck: CardItem[] = [];
        const activeCreatures = MARINE_CREATURES.slice(0, activeNumPairs);
        activeCreatures.forEach((creature) => {
          deck.push({ ...creature, uniqueId: `${creature.id}-0` });
          deck.push({ ...creature, uniqueId: `${creature.id}-1` });
        });

        // Mezclar aleatoriamente las cartas
        const shuffled = deck.sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setShowWinModal(false);
        setRewardGranted(false);

        // Start sequence
        setIsProcessing(true);
        setPreviewMode(false);
        setCountdown(3);
      };
      loadGame();
    }, [])
  );

  const handleCardPress = (card: CardItem) => {
    // Evitar acciones si la carta ya está emparejada, volteada o estamos comparando 2 cartas
    if (
      isProcessing ||
      flipped.includes(card.uniqueId) ||
      matched.includes(card.id)
    ) {
      return;
    }

    const nextFlipped = [...flipped, card.uniqueId];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      const firstCard = cards.find((c) => c.uniqueId === nextFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.id === secondCard.id) {
        // ¡Pareja encontrada!
        const newMatched = [...matched, firstCard.id];
        setMatched(newMatched);
        setFlipped([]);
        setIsProcessing(false);

        // Si se encontraron todas las parejas
        if (newMatched.length === numPairs) {
          handleGameWon();
        }
      } else {
        // Volver a voltear las cartas después de un instante
        setTimeout(() => {
          setFlipped([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  const handleGameWon = async () => {
    setShowWinModal(true);
    if (!rewardGranted) {
      setRewardGranted(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await addSandDollars(user.id, rewardAmount);
          await addExperience(user.id, xpReward);
          
          const minutes = 2; // Coral reef doesn't track time, mocking 2 minutes
          await saveGameSession(user.id, 'Coral Reef Memory', minutes, numPairs, xpReward);
        }
      } catch (err) {
        console.error('Error granting rewards:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OctavioHelper />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra superior con botón de regreso y contador */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-to-home-btn"
            id="back-to-home-btn"
            style={styles.backButton}
            onPress={() => router.push('/homepage')}
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{moves}</Text>
            </View>

            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Pairs</Text>
              <Text style={styles.statValue}>
                {matched.length} / {numPairs}
              </Text>
            </View>
          </View>
        </View>

        {/* Encabezado */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Coral Reef Memory Game</Text>
          <Text style={styles.subTitleText}>
            Find the pairs
          </Text>
        </View>

        {/* Cuadrícula de Memorama */}
        <View style={[styles.gridContainer, { position: 'relative' }]}>
          {countdown !== null && countdown > 0 && (
            <View style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
              justifyContent: 'center', alignItems: 'center', zIndex: 100
            }}>
              <Text style={{
                fontSize: 120, fontWeight: 'bold', color: '#FFFFFF',
                textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 10
              }}>
                {countdown}
              </Text>
            </View>
          )}

          {(() => {
            const columns = 4;
            const rows = (numPairs * 2) / columns;
            const availableWidth = Math.min(width - 48, 680);
            const availableHeight = windowHeight - (isMobile ? 220 : 280);

            const maxCardWidth = Math.floor((availableWidth - ((columns - 1) * 16)) / columns);
            const maxCardHeight = Math.floor((availableHeight - ((rows - 1) * 16)) / rows);

            const defaultSize = isMobile ? 100 : 140;
            const cardSize = Math.max(Math.min(defaultSize, maxCardWidth, maxCardHeight), 50);

            return cards.map((card) => {
              const isCardFlipped = flipped.includes(card.uniqueId);
              const isCardMatched = matched.includes(card.id);

              return (
                <MemoramaCard
                  key={card.uniqueId}
                  card={card}
                  isMobile={isMobile}
                  isCardFlipped={isCardFlipped || previewMode}
                  isCardMatched={isCardMatched}
                  onPress={handleCardPress}
                  cardSize={cardSize}
                />
              );
            });
          })()}
        </View>

        {/* Botón de Reinicio Rápido */}
        <TouchableOpacity
          testID="restart-game-btn"
          id="restart-game-btn"
          style={styles.resetButton}
          onPress={() => {
            // Un truco para forzar re-render con initialize logic
            setMatched([]);
            setFlipped([]);
            setMoves(0);
            const deck: CardItem[] = [];
            const activeCreatures = MARINE_CREATURES.slice(0, numPairs);
            activeCreatures.forEach((creature) => {
              deck.push({ ...creature, uniqueId: `${creature.id}-0` });
              deck.push({ ...creature, uniqueId: `${creature.id}-1` });
            });
            setCards(deck.sort(() => Math.random() - 0.5));
            setIsProcessing(true);
            setPreviewMode(false);
            setCountdown(3);
          }}
        >
          <Text style={styles.resetButtonText}>Restart Game</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Victoria y Recompensa */}
      {showWinModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉🐙🐚</Text>
            <Text style={styles.modalTitle}>Reef Explored Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              You completed all pairs in {moves} moves.
            </Text>

            <View style={styles.rewardBadge}>
              <Text style={styles.rewardEmoji}>🪙</Text>
              <Text style={styles.rewardText}>
                +{rewardAmount} Sand Dollars Earned!
              </Text>
            </View>
            <View style={[styles.rewardBadge, { backgroundColor: '#e0f2fe', borderColor: '#3b82f6', marginTop: -12 }]}>
              <Text style={styles.rewardEmoji}>⭐</Text>
              <Text style={[styles.rewardText, { color: '#0369a1' }]}>
                +{xpReward} XP Earned!
              </Text>
            </View>

            <TouchableOpacity
              testID="win-modal-home-btn"
              id="win-modal-home-btn"
              style={styles.modalPrimaryBtn}
              onPress={() => router.push('/homepage')}
            >
              <Text style={styles.modalPrimaryBtnText}>
                View my Sand Dollars in Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="win-modal-play-again-btn"
              id="win-modal-play-again-btn"
              style={styles.modalSecondaryBtn}
              onPress={() => {
                setShowWinModal(false);
                setRewardGranted(false);
                setMatched([]);
                setFlipped([]);
                setMoves(0);
                const deck: CardItem[] = [];
                const activeCreatures = MARINE_CREATURES.slice(0, numPairs);
                activeCreatures.forEach((creature) => {
                  deck.push({ ...creature, uniqueId: `${creature.id}-0` });
                  deck.push({ ...creature, uniqueId: `${creature.id}-1` });
                });
                setCards(deck.sort(() => Math.random() - 0.5));
                setIsProcessing(true);
                setPreviewMode(false);
                setCountdown(3);
              }}
            >
              <Text style={styles.modalSecondaryBtnText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}