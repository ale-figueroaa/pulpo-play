import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginWithUsernameOrEmail } from './db';

interface LoginParams {
  name: string;
  password: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onError: (title: string, message: string) => void;
}

export const handleLoginLogic = async ({ name, password, setLoading, onSuccess, onError }: LoginParams) => {
  if (!name.trim() || !password.trim()) {
    onError('Oops!', 'Please fill in all required fields 🐙');
    return;
  }

  setLoading(true);
  try {
    const { userId, error } = await loginWithUsernameOrEmail(name, password);

    if (error || !userId) {
      onError('Uncharted Ocean!', error || 'We could not verify your account. 🌊');
      return;
    }

    try {
      await AsyncStorage.setItem(`pulpo_last_password_${userId}`, password.trim());
    } catch (e) {
      console.log('No se pudo guardar la contraseña localmente:', e);
    }

    // 4. Success!
    onSuccess();
  } catch (err: any) {
    onError('Error', 'There was a problem connecting to the reef.');
  } finally {
    setLoading(false);
  }
};