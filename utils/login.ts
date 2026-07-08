import { Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust this path if your lib folder is somewhere else

interface LoginParams {
  name: string;
  password: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

export const handleLoginLogic = async ({ name, password, setLoading, onSuccess }: LoginParams) => {
  if (!name.trim() || !password.trim()) {
    Alert.alert('¡Ups!', 'Please fill in all required fields 🐙');
    return;
  }

  setLoading(true);
  try {
    // 1. Buscar el idUsuario por nombreUsuario para obtener el email de auth.users
    const { data: usuario, error: userError } = await supabase
      .from('Usuario')
      .select('idUsuario')
      .eq('nombreUsuario', name.trim())
      .maybeSingle();

    if (userError || !usuario) {
      Alert.alert('¡Searching in the sea!', `We couldn't find any diver with that name. 🌊`);
      setLoading(false);
      return;
    }

    // 2. Buscar el email en auth.users por el id
    const { data: authData, error: authError } = await supabase
      .rpc('get_email_by_id', { user_id: usuario.idUsuario });

    if (authError || !authData) {
      Alert.alert('Error', `We couldn't find your account. Try again.`);
      setLoading(false);
      return;
    }

    // 3. Hacer login con email + password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authData,
      password: password.trim(),
    });

    if (signInError) {
      if (signInError.message.includes('Email not confirmed')) {
        Alert.alert('Confirm your email!', 'Check your inbox and confirm your email before entering. 📧');
      } else {
        Alert.alert('Incorrect password!', 'Check your password and try again. 🔒');
      }
      return;
    }

    // 4. Success!
    onSuccess();
  } catch (err: any) {
    Alert.alert('Error', 'There was a problem connecting to the reef.');
  } finally {
    setLoading(false);
  }
};