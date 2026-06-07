import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TU_URL_DE_SUPABASE';
const supabaseAnonKey = 'TU_KEY_DE_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Si es Web, usa localStorage normal; si es móvil, usa AsyncStorage
    storage: Platform.OS === 'web' && typeof window !== 'undefined' 
      ? window.localStorage 
      : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});