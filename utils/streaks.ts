import { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getUserSandDollars, addSandDollars } from './db';

export const MOBILE_BREAKPOINT = 768;

export interface NavItem {
  key: string;
  label: string;
  icon: any;
}

export interface DayData {
  name: string;
  completed: boolean;
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
  const [streakTotal, setStreakTotal] = useState<number>(0);
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [claimedMilestones, setClaimedMilestones] = useState<string[]>([]);

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const calculateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sandDollars = await getUserSandDollars(user.id);
      setCoins(sandDollars);

      let currentStreak = user.user_metadata?.streakTotal || 0;
      let lastDate = user.user_metadata?.lastStreakDate || '';
      let claimed = user.user_metadata?.claimedMilestones || [];

      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localTodayDate = new Date(today.getTime() - (offset * 60 * 1000));
      const todayStr = localTodayDate.toISOString().split('T')[0];

      let needsUpdate = false;

      if (lastDate === todayStr) {
        // Already logged in today
      } else {
        if (lastDate) {
          const last = new Date(lastDate);
          const todayObj = new Date(todayStr);
          const diffTime = Math.abs(todayObj.getTime() - last.getTime());
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
            claimed = [];
          }
        } else {
          currentStreak = 1;
          claimed = [];
        }
        lastDate = todayStr;
        needsUpdate = true;
      }

      setStreakTotal(currentStreak);
      setClaimedMilestones(claimed);

      if (needsUpdate) {
        await supabase.auth.updateUser({
          data: {
            streakTotal: currentStreak,
            lastStreakDate: lastDate,
            claimedMilestones: claimed
          }
        });
      }

      const currentWeekProgress = currentStreak % 7 === 0 && currentStreak > 0 ? 7 : currentStreak % 7;
      
      const newDaysData = Array.from({ length: 7 }).map((_, idx) => ({
        name: `Day ${idx + 1}`,
        completed: idx < currentWeekProgress
      }));

      setDaysData(newDaysData);

    } catch (err) {
      console.error('Error in streak logic:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      calculateStreak();
      
      const timer = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diff = tomorrow.getTime() - now.getTime();

        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${h}h ${m}m ${s}s`);
      }, 1000);

      return () => clearInterval(timer);
    }, [])
  );

  const claimMilestone = async (milestoneId: string) => {
    try {
      const milestone = MILESTONES.find(m => m.id === milestoneId);
      if (!milestone) return;

      if (streakTotal < milestone.days) return; // Not unlocked
      if (claimedMilestones.includes(milestoneId)) return; // Already claimed

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Add sand dollars
      await addSandDollars(user.id, milestone.reward);
      setCoins(prev => prev + milestone.reward);

      // Update claimed array
      const newClaimed = [...claimedMilestones, milestoneId];
      setClaimedMilestones(newClaimed);

      await supabase.auth.updateUser({
        data: {
          claimedMilestones: newClaimed
        }
      });
    } catch (err) {
      console.error('Error claiming milestone:', err);
    }
  };

  const visibleNavItems = isMobile
    ? NAV_ITEMS.filter(item => item.key !== 'profile')
    : NAV_ITEMS;

  return {
    coins,
    streakTotal,
    isMobile,
    visibleNavItems,
    DAYS_DATA: daysData.length > 0 ? daysData : Array.from({length: 7}).map((_, i) => ({name: `Day ${i+1}`, completed: false})),
    MILESTONES,
    timeLeft,
    claimedMilestones,
    claimMilestone,
  };
};