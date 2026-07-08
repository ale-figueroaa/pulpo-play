import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { supabase } from '../lib/supabase';

const MOBILE_BREAKPOINT = 768;

export interface NavItem {
  key: string;
  label: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'worlds', label: 'Worlds', icon: require('../../assets/images/Worlds.png') },
  { key: 'streak', label: 'Streak', icon: require('../../assets/images/Streak.png') },
  { key: 'store', label: 'Store', icon: require('../../assets/images/Store.png') },
  { key: 'profile', label: 'Profile', icon: require('../../assets/images/CoralReef.png') },
];

export interface DayData {
  name: string;
  completed: boolean;
}

export interface MilestoneData {
  id: string;
  days: number;
  reward: number;
}

export const DAYS_DATA = [
  { name: 'Mon', completed: true },
  { name: 'Tue', completed: true },
  { name: 'Wed', completed: true },
  { name: 'Thu', completed: true },
  { name: 'Fri', completed: true },
  { name: 'Sat', completed: false },
  { name: 'Sun', completed: false },
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

  useEffect(() => {
    fetchUserCoins();
  }, []);

  const fetchUserCoins = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user.id)
          .single();

        if (data && !error) setCoins(data.coins);
      }
    } catch (err) {
      console.error('Error cargando monedas en streaks:', err);
    }
  };

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