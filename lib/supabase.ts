import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl='https://chexcatdzxejsfxqmrpc.supabase.co';
const supabaseAnonKey='sb_publishable_UaIOWCVCcg6yR371AStngg_ZxKz4ddn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});