import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { addSandDollars } from '../../utils/db';
import { styles } from '../../styles/coralReef.style';

interface Creature {
  id: string;
  emoji: string;
  name: string;
}

interface CardItem extends Creature {
  uniqueId: string;
}

const MARINE_CREATURES: Creature[] = [
  { id: 'pulpo', emoji: '🐙', name: 'Pulpo' },
  { id: 'coral', emoji: '🪸', name: 'Coral' },
  { id: 'tortuga', emoji: '🐢', name: 'Tortuga' },
  { id: 'pez', emoji: '🐠', name: 'Pez Payaso' },
  { id: 'delfin', emoji: '🐬', name: 'Delfín' },
  { id: 'cangrejo', emoji: '🦀', name: 'Cangrejo' },
];

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

  // Inicializar o reiniciar la partida
  const initializeGame = () => {
    const deck: CardItem[] = [];
    MARINE_CREATURES.forEach((creature) => {
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
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

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

        // Si se encontraron las 6 parejas
        if (newMatched.length === MARINE_CREATURES.length) {
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
          await addSandDollars(user.id, REWARD_AMOUNT);
        }
      } catch (err) {
        console.error('Error al otorgar Sand Dollars:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra superior con botón de regreso y contador */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/homepage')}
          >
            <Text style={styles.backButtonText}>← Volver al Home</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Movimientos</Text>
              <Text style={styles.statValue}>{moves}</Text>
            </View>

            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Parejas</Text>
              <Text style={styles.statValue}>
                {matched.length} / {MARINE_CREATURES.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Encabezado */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Coral Reef Memorama 🐠</Text>
          <Text style={styles.subTitleText}>
            Encuentra las parejas marinas para ganar Sand Dollars 🐚
          </Text>
        </View>

        {/* Cuadrícula de Memorama */}
        <View style={styles.gridContainer}>
          {cards.map((card) => {
            const isCardFlipped = flipped.includes(card.uniqueId);
            const isCardMatched = matched.includes(card.id);

            return (
              <TouchableOpacity
                key={card.uniqueId}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  isMobile && styles.cardMobile,
                  isCardMatched
                    ? styles.cardMatched
                    : isCardFlipped
                    ? styles.cardUp
                    : styles.cardDown,
                ]}
                onPress={() => handleCardPress(card)}
              >
                {isCardFlipped || isCardMatched ? (
                  <>
                    <Text
                      style={[
                        styles.cardEmoji,
                        isMobile && styles.cardEmojiMobile,
                      ]}
                    >
                      {card.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.cardLabel,
                        isCardMatched && styles.cardLabelMatched,
                      ]}
                    >
                      {card.name}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.cardBackEmoji}>🌊</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón de Reinicio Rápido */}
        <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
          <Text style={styles.resetButtonText}>🔄 Reiniciar Memorama</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Victoria y Recompensa */}
      {showWinModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉🐙🐚</Text>
            <Text style={styles.modalTitle}>¡Arrecife Explorando con Éxito!</Text>
            <Text style={styles.modalSubtitle}>
              Completaste todas las parejas en {moves} movimientos.
            </Text>

            <View style={styles.rewardBadge}>
              <Text style={styles.rewardEmoji}>🪙</Text>
              <Text style={styles.rewardText}>
                ¡+{REWARD_AMOUNT} Sand Dollars Ganados!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => router.push('/homepage')}
            >
              <Text style={styles.modalPrimaryBtnText}>
                Ver mis Sand Dollars en Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={initializeGame}
            >
              <Text style={styles.modalSecondaryBtnText}>Jugar de Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}