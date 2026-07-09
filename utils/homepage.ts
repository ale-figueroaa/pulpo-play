import { useState, useEffect, useRef } from 'react';
import { Platform, LayoutAnimation, useWindowDimensions } from 'react-native';
import { supabase } from '../lib/supabase'; // Ajusta la ruta si es necesario

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
  { key: 'profile', label: 'Profile', icon: require('../assets/images/CoralReef.png') },
];

export const WORLDS_ARRAY = [
  { id: 0, image: require('../assets/images/SunkenShip.png'), route: '/SunkenShip' },
  { id: 1, image: require('../assets/images/CoralReef.png'), route: '/CoralReef' },
  { id: 2, image: require('../assets/images/SubmarineWorld.png'), route: '/SubmarineWorld' },
];

export const useHomeLogic = () => {
  const [coins, setCoins] = useState<number>(0);
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
        const { data, error } = await supabase
          .from('profiles') 
          .select('coins')
          .eq('id', user.id)
          .single();

        if (data && !error) setCoins(data.coins);
      }
    } catch (err) {
      console.error('Error cargando monedas:', err);
    }
  };

  useEffect(() => {
    fetchUserCoins();
  }, []);

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
    rightWorld: WORLDS_ARRAY[rightIndex]
  };
};