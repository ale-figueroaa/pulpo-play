import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chexcatdzxejsfxqmrpc.supabase.co';
const supabaseAnonKey = 'sb_publishable_UaIOWCVCcg6yR371AStngg_ZxKz4ddn';

// Objeto temporal en memoria para evitar que la librería AsyncStorage explote en Node.js
const serverMemoryStorage: Record<string, string> = {};

const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    // Si estamos en el servidor (Node), usamos la memoria local temporal en lugar de AsyncStorage
    if (Platform.OS === 'web') {
      return serverMemoryStorage[key] || null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    } else if (Platform.OS === 'web') {
      serverMemoryStorage[key] = value;
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    } else if (Platform.OS === 'web') {
      delete serverMemoryStorage[key];
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});