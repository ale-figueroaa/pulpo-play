import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // Ajusta la ruta si tu carpeta lib está en otro lado

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void; // Función para navegar cuando termine
  onShowConfirmEmail?: () => void;
}

export const handleSignUpLogic = async ({ name, email, password, setLoading, onSuccess, onShowConfirmEmail }: SignUpParams) => {
  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  if (!name.trim() || !email.trim() || !password.trim()) {
    showAlert('¡Ups!', 'Please complete all fields for your new character 🐙');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    showAlert('Invalid email!', 'Please enter a valid email address 📧');
    return;
  }
  if (password.trim().length < 6) {
    showAlert('Too short!', 'The password must be at least 6 characters long 🔒');
    return;
  }

  setLoading(true);
  try {
    // 1. Verificar si el nombreUsuario ya existe en la tabla Usuario
    const { data: existingUser } = await supabase
      .from('Usuario')
      .select('nombreUsuario')
      .eq('nombreUsuario', name.trim())
      .maybeSingle();

    if (existingUser) {
      showAlert('Unavailable!', `That diver's name is already taken. Try another one! 🐬`);
      setLoading(false);
      return;
    }

    // 2. Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          nombreUsuario: name.trim(), // el trigger lo lee de raw_user_meta_data
        }
      }
    });

    if (error) throw error;

    if (data?.user?.id) {
      try {
        await AsyncStorage.setItem(`pulpo_last_password_${data.user.id}`, password.trim());
      } catch (e) {
        console.log('Could not save password locally during signup:', e);
      }
    }

    // 3. Éxito
    if (onShowConfirmEmail) {
      onShowConfirmEmail();
    } else {
      onSuccess();
    }
  } catch (err: any) {
    console.log('Full error:', JSON.stringify(err, null, 2));
    if (Platform.OS === 'web') {
      window.alert(err.message);
    } else {
      Alert.alert('Error', err.message);
    }
  } finally {
    setLoading(false);
  }
};