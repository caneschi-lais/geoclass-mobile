import * as SecureStore from 'expo-secure-store';
import { UserRole } from '../types';

const TOKEN_KEY = 'geoclass_jwt_token';
const ROLE_KEY = 'geoclass_user_role';

export async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
}

export async function saveRole(role: UserRole) {
  try {
    await SecureStore.setItemAsync(ROLE_KEY, role);
  } catch (error) {
    console.error('Erro ao salvar role:', error);
  }
}

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
}

export async function getRole(): Promise<UserRole | null> {
  try {
    const role = await SecureStore.getItemAsync(ROLE_KEY);
    return role as UserRole | null;
  } catch (error) {
    console.error('Erro ao recuperar role:', error);
    return null;
  }
}

export async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
  } catch (error) {
    console.error('Erro ao deletar dados de auth:', error);
  }
}
