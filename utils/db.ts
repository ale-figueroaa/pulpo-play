import { supabase } from '../lib/supabase';

/**
 * Archivo central de conexión a la Base de Datos para Pulpo Play.
 * Trabaja sobre el esquema:
 *  - Tabla "Usuario" con idUsuario (UUID FK a auth.users.id), nombreUsuario, sandDollars, experienceLevel
 */

export interface UsuarioData {
  idUsuario: string;
  nombreUsuario: string;
  sandDollars: number;
  experienceLevel?: number;
}

/**
 * Inicia sesión verificando si el identificador es correo electrónico o nombre de usuario (nombreUsuario)
 * junto con su contraseña. Retorna el id del usuario autenticado.
 */
export const loginWithUsernameOrEmail = async (
  identifier: string,
  password: string
): Promise<{ userId: string | null; error: string | null }> => {
  try {
    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    let emailToUse = cleanIdentifier;

    // Si no contiene '@', buscamos en la tabla Usuario por nombreUsuario para obtener el idUsuario
    if (!cleanIdentifier.includes('@')) {
      const { data: usuario, error: userError } = await supabase
        .from('Usuario')
        .select('idUsuario')
        .eq('nombreUsuario', cleanIdentifier)
        .maybeSingle();

      if (userError || !usuario) {
        return {
          userId: null,
          error: 'No diver found with that username.',
        };
      }

      // Buscamos el correo asociado a ese idUsuario en auth.users a través de la función RPC
      const { data: authEmail, error: rpcError } = await supabase.rpc(
        'get_email_by_id',
        { user_id: usuario.idUsuario }
      );

      if (rpcError || !authEmail) {
        return {
          userId: null,
          error: 'Could not verify the account associated with this user.',
        };
      }

      emailToUse = authEmail;
    }

    // Autenticamos contra Supabase Auth usando el correo y contraseña
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: cleanPassword,
      });

    if (signInError || !authData.user) {
      return {
        userId: null,
        error: signInError?.message || 'Incorrect username or password.',
      };
    }

    return { userId: authData.user.id, error: null };
  } catch (err: any) {
    console.error('Error in loginWithUsernameOrEmail:', err);
    return { userId: null, error: 'Database connection error.' };
  }
};

/**
 * Obtiene la cantidad de Sand Dollars vinculados al id del usuario (por Foreign Key idUsuario)
 */
export const getUserSandDollars = async (userId: string): Promise<number> => {
  try {
    // 1. Consultar tabla Usuario por idUsuario
    const { data, error } = await supabase
      .from('Usuario')
      .select('sandDollars')
      .eq('idUsuario', userId)
      .maybeSingle();

    if (!error && data && data.sandDollars !== undefined && data.sandDollars !== null) {
      return Number(data.sandDollars);
    }

    // 2. Respaldo por si la columna en la BD se llama saldoSandDollars
    const { data: altData } = await supabase
      .from('Usuario')
      .select('saldoSandDollars')
      .eq('idUsuario', userId)
      .maybeSingle();

    if (altData && altData.saldoSandDollars !== undefined && altData.saldoSandDollars !== null) {
      return Number(altData.saldoSandDollars);
    }

    return 0;
  } catch (error) {
    console.error('Error al consultar sandDollars en Usuario:', error);
    return 0;
  }
};

/**
 * Obtiene los datos completos del buzo en la tabla Usuario
 */
export const getUserProfileByAuthId = async (
  userId: string
): Promise<UsuarioData | null> => {
  try {
    const { data, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('idUsuario', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as UsuarioData;
  } catch (error) {
    console.error('Error al consultar perfil de Usuario:', error);
    return null;
  }
};

/**
 * Incrementa los Sand Dollars del buzo en la tabla Usuario (por FK idUsuario)
 */
export const addSandDollars = async (
  userId: string,
  amount: number
): Promise<{ success: boolean; newTotal: number }> => {
  try {
    const current = await getUserSandDollars(userId);
    const newTotal = current + amount;

    // Actualizamos la columna sandDollars de la tabla Usuario
    const { error } = await supabase
      .from('Usuario')
      .update({ sandDollars: newTotal })
      .eq('idUsuario', userId);

    if (error) {
      // Intentar fallback sobre saldoSandDollars por si aplica
      await supabase
        .from('Usuario')
        .update({ saldoSandDollars: newTotal })
        .eq('idUsuario', userId);
    }

    return { success: true, newTotal };
  } catch (error) {
    console.error('Error al agregar Sand Dollars:', error);
    return { success: false, newTotal: 0 };
  }
};

/**
 * Incrementa la experiencia del buzo en la tabla Usuario (por FK idUsuario)
 */
export const addExperience = async (
  userId: string,
  amount: number
): Promise<{ success: boolean; newTotal: number }> => {
  try {
    const profile = await getUserProfileByAuthId(userId);
    const current = profile?.experienceLevel || 0;
    const newTotal = current + amount;

    const { error } = await supabase
      .from('Usuario')
      .update({ experienceLevel: newTotal })
      .eq('idUsuario', userId);

    if (error) {
      console.error('Error de Supabase al agregar XP:', error);
      return { success: false, newTotal: current };
    }

    return { success: true, newTotal };
  } catch (error) {
    console.error('Error al agregar experiencia:', error);
    return { success: false, newTotal: 0 };
  }
};

/**
 * Guarda los resultados de una sesión de juego en la tabla GameSession.
 */
export const saveGameSession = async (
  userId: string,
  gameName: string,
  minutesPlayed: number,
  correctAnswers: number,
  xpEarned: number
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase.from('GameSession').insert({
      idUsuario: userId,
      gameName,
      minutesPlayed,
      correctAnswers,
      xpEarned,
    });
    if (error) {
      console.error('Error saving game session:', error);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error('Exception saving game session:', err);
    return { success: false };
  }
};

/**
 * Obtiene y agrega el progreso (minutesPlayed y correctAnswers) de los últimos 7 días.
 * Devuelve un arreglo de 7 elementos, ordenado de más antiguo (ayer-6) a hoy (índice 6).
 */
export const getWeeklyProgress = async (userId: string) => {
  try {
    // Calcular el rango de fechas (últimos 7 días)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    lastWeek.setHours(0, 0, 0, 0);

    // Inicializar los últimos 7 días con 0s
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push({
        day: daysArr[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        minutes: 0,
        correct: 0
      });
    }

    const { data, error } = await supabase
      .from('GameSession')
      .select('createdAt, minutesPlayed, correctAnswers')
      .eq('idUsuario', userId)
      .neq('gameName', 'Debug Game')
      .gte('createdAt', lastWeek.toISOString());

    if (error || !data) {
      console.error('Error fetching weekly progress:', error);
      return result; // Always return the default 7 days structure
    }

    // Agregar la data a los días
    data.forEach((session) => {
      // Ajuste local simple de fecha
      const sessionDate = new Date(session.createdAt).toISOString().split('T')[0];
      const targetDay = result.find(r => r.dateStr === sessionDate);
      if (targetDay) {
        targetDay.minutes += (session.minutesPlayed || 0);
        targetDay.correct += (session.correctAnswers || 0);
      }
    });

    return result;
  } catch (err) {
    console.error('Exception fetching weekly progress:', err);
    return [];
  }
};

/**
 * Obtiene la actividad reciente del buzo (últimas X sesiones de juego)
 */
export const getRecentActivity = async (userId: string, limit: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('GameSession')
      .select('gameName, minutesPlayed, correctAnswers, xpEarned, createdAt')
      .eq('idUsuario', userId)
      .neq('gameName', 'Debug Game')
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('Error fetching recent activity:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Exception fetching recent activity:', err);
    return [];
  }
};
