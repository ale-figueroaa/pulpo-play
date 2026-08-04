import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // Ajusta la ruta si tu carpeta lib está en otro lado

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void; // Función para navegar cuando termine
}

export const handleSignUpLogic = async ({ name, email, password, setLoading, onSuccess }: SignUpParams) => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    Alert.alert('¡Ups!', 'Please complete all fields for your new character 🐙');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    Alert.alert('Invalid email!', 'Please enter a valid email address 📧');
    return;
  }
  if (password.trim().length < 6) {
    Alert.alert('Too short!', 'The password must be at least 6 characters long 🔒');
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
      Alert.alert('Unavailable!', `That diver's name is already taken. Try another one! 🐬`);
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
        console.log('No se pudo guardar la contraseña localmente en registro:', e);
      }
    }

    // 3. Éxito
    Alert.alert(
      'Success!',
      'Your account has been created! Check your email to confirm it before logging in. 🌊',
      [{ text: 'Brilliant!', onPress: onSuccess }]
    );
  } catch (err: any) {
    console.log('Error completo:', JSON.stringify(err, null, 2));
    Alert.alert('Error', err.message + '\n\nCode: ' + err.code + '\n\nDetails: ' + err.details);
  } finally {
    setLoading(false);
  }
};