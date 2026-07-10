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
          error: 'No se encontró ningún buzo con ese nombre de usuario.',
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
          error: 'No se pudo verificar la cuenta asociada a este usuario.',
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
        error: signInError?.message || 'Contraseña o usuario incorrecto.',
      };
    }

    return { userId: authData.user.id, error: null };
  } catch (err: any) {
    console.error('Error en loginWithUsernameOrEmail:', err);
    return { userId: null, error: 'Error de conexión con la base de datos.' };
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
