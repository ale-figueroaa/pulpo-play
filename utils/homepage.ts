import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, LayoutAnimation, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase'; // Ajusta la ruta si es necesario
import { getUserSandDollars } from './db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORE_ITEMS_DATA, StoreItem } from './store';

const BASIC_ITEM: StoreItem = STORE_ITEMS_DATA.find(item => item.id === 'basic') || STORE_ITEMS_DATA[0];
export const MOBILE_BREAKPOINT = 768;

export interface NavItem {
  key: string;
  label: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'worlds', label: 'Worlds', icon: require('../assets/images/Worlds.png') },
  { key: 'streak', label: 'Streak', icon: require('../assets/images/Streak.png') },
  { key: 'store', label: 'Store', icon: require('../assets/images/Store.png') },
];

export const WORLDS_ARRAY = [
  { id: 0, name: 'Sunken Ship Maze', image: require('../assets/images/SunkenShip.png'), route: '/SunkenShip' },
  { id: 1, name: 'Coral Reef Memory', image: require('../assets/images/CoralReef.png'), route: '/coralReef' },
  { id: 2, name: 'Submarine Sort', image: require('../assets/images/SubmarineWorld.png'), route: '/SubmarineWorld' },
];

export const useHomeLogic = () => {
  const [coins, setCoins] = useState<number>(0);
  const [equippedItem, setEquippedItem] = useState<StoreItem>(BASIC_ITEM);
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const touchStartX = useRef(0);
  
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const visibleNavItems = isMobile 
    ? NAV_ITEMS.filter(item => item.key !== 'profile') 
    : NAV_ITEMS;

  const changeWorld = (direction: 'next' | 'prev') => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setActiveIndex((prev) => {
      if (direction === 'next') {
        return prev === WORLDS_ARRAY.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? WORLDS_ARRAY.length - 1 : prev - 1;
      }
    });
  };

  const fetchUserCoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Obtenemos los Sand Dollars de la tabla Usuario vinculados por FK (idUsuario === auth.users.id)
        const sandDollars = await getUserSandDollars(user.id);
        setCoins(sandDollars);

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
          } else {
            setEquippedItem(BASIC_ITEM);
          }
        }
      }
    } catch (err) {
      console.error('Error cargando Sand Dollars:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserCoins();
    }, [])
  );

  const leftIndex = activeIndex === 0 ? WORLDS_ARRAY.length - 1 : activeIndex - 1;
  const rightIndex = activeIndex === WORLDS_ARRAY.length - 1 ? 0 : activeIndex + 1;

  return {
    coins,
    showDialog,
    setShowDialog,
    touchStartX,
    changeWorld,
    isMobile,
    visibleNavItems,
    leftWorld: WORLDS_ARRAY[leftIndex],
    centerWorldItem: WORLDS_ARRAY[activeIndex],
    rightWorld: WORLDS_ARRAY[rightIndex],
    equippedItem
  };
};