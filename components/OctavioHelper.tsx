import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, Text, View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORE_ITEMS_DATA, StoreItem } from '../utils/store';
import { useFocusEffect } from 'expo-router';

const BASIC_ITEM = STORE_ITEMS_DATA.find(item => item.id === 'basic') || STORE_ITEMS_DATA[0];

const AFFIRMATIONS = [
  "Keep going!",
  "You're doing great!",
  "Almost there!",
  "Fantastic job!",
  "You're a star!",
  "Wow, so smart!",
  "Keep it up!",
  "Way to go!",
  "Awesome!",
];

interface Props {
  hideMessage?: boolean;
}

export default function OctavioHelper({ hideMessage = false }: Props) {
  const { width, height } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web';
  const [equippedItem, setEquippedItem] = useState<StoreItem>(BASIC_ITEM);
  const [message, setMessage] = useState(AFFIRMATIONS[0]);
  const floatAnim = useRef(new Animated.Value(0)).current;

  const fetchEquipped = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const metadata = user.user_metadata || {};
        if (metadata.equippedItem) {
          try {
            setEquippedItem(typeof metadata.equippedItem === 'string' ? JSON.parse(metadata.equippedItem) : metadata.equippedItem);
          } catch (e) {
            setEquippedItem(BASIC_ITEM);
          }
        } else {
          const storedEquipped = await AsyncStorage.getItem(`pulpo_equipped_item_${user.id}`);
          if (storedEquipped) {
            try {
              setEquippedItem(JSON.parse(storedEquipped));
            } catch (e) {
              setEquippedItem(BASIC_ITEM);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEquipped();
    }, [])
  );

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) })
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [floatAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
    }, 15000); // Change message every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const octavioTranslateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  // On very small screens, maybe hide him so he doesn't block the game
  const minDim = Math.min(width, height);
  if (minDim < 250) return null;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]} pointerEvents="none">
      <Animated.Image 
        source={equippedItem?.image} 
        style={[styles.octavio, isMobile && styles.octavioMobile, { transform: [{ translateY: octavioTranslateY }] }]} 
      />
      {!hideMessage && (
        <View style={[styles.dialogWrapper, isMobile && styles.dialogWrapperMobile]}>
          <View style={styles.dialogBubble}>
            <Text style={styles.dialogText}>{message}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerMobile: {
    bottom: 40,
    left: 10,
  },
  octavio: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  octavioMobile: {
    width: 80,
    height: 80,
  },
  dialogWrapper: {
    marginLeft: 20,
    position: 'relative',
  },
  dialogWrapperMobile: {
    marginLeft: 6,
    marginTop: -10, // Adjust vertically so tail aligns with mouth better
  },
  dialogBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 3,
    borderColor: '#E2EEFF',
    maxWidth: 200,
    ...Platform.select({
      web: { boxShadow: '0px 4px 0px rgba(0,0,0,0.05)' as any },
      default: { elevation: 3 }
    })
  },
  dialogText: {
    color: '#3B629B',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  dialogTail: {
    position: 'absolute',
    top: '50%',
    left: -12,
    marginTop: -8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 12,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
});
