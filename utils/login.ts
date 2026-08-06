import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginWithUsernameOrEmail } from './db';

interface LoginParams {
  name: string;
  password: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const handleLoginLogic = async ({ name, password, setLoading, onSuccess, onError }: LoginParams) => {
  if (!name.trim() || !password.trim()) {
    onError('Please fill in all required fields 🐙');
    return;
  }

  setLoading(true);
  try {
    const { userId, error } = await loginWithUsernameOrEmail(name, password);

    if (error || !userId) {
      onError(error || 'We could not verify your account. 🌊');
      return;
    }

    try {
      await AsyncStorage.setItem(`pulpo_last_password_${userId}`, password.trim());
    } catch (e) {
      console.log('Could not save password locally:', e);
    }

    // 4. Success!
    onSuccess();
  } catch (err: any) {
    onError('There was a problem connecting to the reef.');
  } finally {
    setLoading(false);
  }
};