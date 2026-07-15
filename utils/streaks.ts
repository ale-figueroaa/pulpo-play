import { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getUserSandDollars } from './db';

export const MOBILE_BREAKPOINT = 768;

export interface NavItem {
  key: string;
  label: string;
  icon: any;
}

export interface DayData {
  day: string;
  active: boolean;
}

export interface MilestoneData {
  id: string;
  days: number;
  reward: number;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'worlds', label: 'Worlds', icon: require('../assets/images/Worlds.png') },
  { key: 'streak', label: 'Streak', icon: require('../assets/images/Streak.png') },
  { key: 'store', label: 'Store', icon: require('../assets/images/Store.png') },
  { key: 'profile', label: 'Profile', icon: require('../assets/images/Perfil.png') },
];

export const DAYS_DATA = [
  { day: 'Lun', active: true },
  { day: 'Mar', active: true },
  { day: 'Mié', active: false },
  { day: 'Jue', active: false },
  { day: 'Vie', active: false },
  { day: 'Sáb', active: false },
  { day: 'Dom', active: false },
];

export const MILESTONES = [
  { id: '1', days: 2, reward: 10 },
  { id: '2', days: 3, reward: 50 },
  { id: '3', days: 10, reward: 100 },
  { id: '4', days: 15, reward: 150 },
  { id: '5', days: 20, reward: 200 },
];

export const useStreaksLogic = () => {
  const [coins, setCoins] = useState<number>(0);
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const fetchUserCoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sandDollars = await getUserSandDollars(user.id);
        setCoins(sandDollars);
      }
    } catch (err) {
      console.error('Error cargando monedas en streaks:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserCoins();
    }, [])
  );

  const visibleNavItems = isMobile
    ? NAV_ITEMS.filter(item => item.key !== 'profile')
    : NAV_ITEMS;

  return {
    coins,
    isMobile,
    visibleNavItems,
    DAYS_DATA,
    MILESTONES,
  };
};