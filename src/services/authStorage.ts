import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'geoclass_jwt_token';

export async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
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

export async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao deletar token:', error);
  }
}
