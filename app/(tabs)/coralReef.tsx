import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Animated
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { addSandDollars } from '../../utils/db';
import { styles } from '../../styles/coralReef.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreItem } from '../../utils/store';
import { Image } from 'react-native';

interface Creature {
  id: string;
  emoji: string;
  name: string;
}

interface CardItem extends Creature {
  uniqueId: string;
}

const BASE_MARINE_CREATURES: Creature[] = [
  { id: 'pulpo', emoji: '🐙', name: 'Pulpo' },
  { id: 'coral', emoji: '🪸', name: 'Coral' },
  { id: 'tortuga', emoji: '🐢', name: 'Tortuga' },
  { id: 'pez', emoji: '🐠', name: 'Pez Payaso' },
  { id: 'delfin', emoji: '🐬', name: 'Delfín' },
  { id: 'cangrejo', emoji: '🦀', name: 'Cangrejo' },
];

const EXTRA_MARINE_CREATURES: Creature[] = [
  { id: 'tiburon', emoji: '🦈', name: 'Tiburón' },
  { id: 'estrella', emoji: '⭐', name: 'Estrella' },
  { id: 'caballito', emoji: '🧜‍♂️', name: 'Caballito' },
  { id: 'ballena', emoji: '🐋', name: 'Ballena' },
  { id: 'medusa', emoji: '🪼', name: 'Medusa' },
  { id: 'foca', emoji: '🦭', name: 'Foca' },
];

const MemoramaCard = ({ card, isMobile, isCardFlipped, isCardMatched, onPress }: any) => {
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

const REWARD_AMOUNT = 50;

export default function CoralReefScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [rewardGranted, setRewardGranted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [extraPairs, setExtraPairs] = useState<number>(0);
  const [activeCreaturesCount, setActiveCreaturesCount] = useState<number>(BASE_MARINE_CREATURES.length);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const [equippedItem, setEquippedItem] = useState<StoreItem | null>(null);
  const [motivationMessage, setMotivationMessage] = useState<string>("Let's start!");
  const motivationMessages = ["Keep going! 🐙", "You can do it! ✨", "Great memory! 🧠", "Don't give up! 🌊", "Awesome! 🐠"];

  const fetchEquippedItem = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const storedEquipped = await AsyncStorage.getItem(`pulpo_equipped_item_${user.id}`);
        if (storedEquipped) {
          try {
            setEquippedItem(JSON.parse(storedEquipped));
          } catch (e) {
            // handle
          }
        } else {
          setEquippedItem({
            id: 'featured',
            name: 'Traje de Buzo Leyenda',
            price: '10,000',
            image: require('../../assets/images/octavioExplorador.png'),
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (moves > 0) {
      setMotivationMessage(motivationMessages[Math.floor(Math.random() * motivationMessages.length)]);
    }
  }, [moves]);

  // Inicializar o reiniciar la partida
  const initializeGame = () => {
    // Calculamos qué criaturas usaremos basado en extraPairs
    // Se usa un valor funcional de extraPairs o podemos depender del estado porque useFocusEffect llama a esto
    setExtraPairs((currentExtraPairs) => {
      const creaturesToUse = BASE_MARINE_CREATURES.concat(EXTRA_MARINE_CREATURES.slice(0, currentExtraPairs));
      setActiveCreaturesCount(creaturesToUse.length);
      
      const deck: CardItem[] = [];
      creaturesToUse.forEach((creature) => {
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
      
      return currentExtraPairs;
    });
  };

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
      initializeGame();
      fetchEquippedItem();
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

        // Si se encontraron las parejas
        if (newMatched.length === activeCreaturesCount) {
          handleGameWon(moves + 1, activeCreaturesCount);
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

  const handleGameWon = async (finalMoves: number, totalPairs: number) => {
    setShowWinModal(true);
    
    // Dificultad Dinámica:
    // Si completan el juego con menos movimientos que el mínimo + 3, añadimos 2 pares más (4 cartas)
    if (finalMoves <= totalPairs + 3) {
      setExtraPairs((prev) => Math.min(prev + 2, EXTRA_MARINE_CREATURES.length));
    }

    if (!rewardGranted) {
      setRewardGranted(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await addSandDollars(user.id, REWARD_AMOUNT);
        }
      } catch (err) {
        console.error('Error al otorgar Sand Dollars:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Companion Floating in Top Corner */}
      {equippedItem && (
        <View style={{ 
          position: 'absolute', 
          top: isMobile ? 90 : 110, 
          right: isMobile ? 10 : 30, 
          flexDirection: 'row', 
          alignItems: 'center', 
          zIndex: 50 
        }}>
          <View style={{ 
            backgroundColor: '#FFFFFF', 
            padding: isMobile ? 10 : 16, 
            borderRadius: 15, 
            borderWidth: 2, 
            borderColor: '#B0CFFF', 
            marginRight: 8, 
            maxWidth: isMobile ? 160 : 250 
          }}>
            <Text style={{ 
              color: '#3B629B', 
              fontWeight: 'bold', 
              fontSize: isMobile ? 14 : 20, 
              textAlign: 'center' 
            }}>{motivationMessage}</Text>
          </View>
          <Image 
            source={equippedItem.image} 
            style={{ 
              width: isMobile ? 65 : 110, 
              height: isMobile ? 65 : 110, 
              resizeMode: 'contain' 
            }} 
          />
        </View>
      )}
      
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
                {matched.length} / {activeCreaturesCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Encabezado */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Coral Reef Memory 🐠</Text>
          <Text style={styles.subTitleText}>
            Find the matching marine pairs to earn Sand Dollars 🐚
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

          {cards.map((card) => {
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
              />
            );
          })}
        </View>

        {/* Botón de Reinicio Rápido */}
        <TouchableOpacity
          testID="restart-game-btn"
          id="restart-game-btn"
          style={styles.resetButton}
          onPress={initializeGame}
        >
          <Text style={styles.resetButtonText}>🔄 Restart Memory Game</Text>
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
                +{REWARD_AMOUNT} Sand Dollars Earned!
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
              onPress={initializeGame}
            >
              <Text style={styles.modalSecondaryBtnText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}