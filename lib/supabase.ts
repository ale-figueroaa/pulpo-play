import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
  
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ¡Faltan las variables de entorno de Supabase en el archivo .env!');
}

const serverMemoryStorage: Record<string, string> = {};

const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return serverMemoryStorage[key] || null;
    }
    return AsyncStorage?.getItem ? await AsyncStorage.getItem(key) : null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      } else {
        serverMemoryStorage[key] = value;
      }
    } else {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem(key, value);
      }
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      } else {
        delete serverMemoryStorage[key];
      }
    } else {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(key);
      }
    }
  },
};

// Inicializamos el cliente usando las variables seguras
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});