import axios from 'axios';
import { getToken } from './authStorage';

// Usar API local, mude para IP real do seu backend ou emulador/dispositivo
const api = axios.create({
  baseURL: 'http://localhost:3000', // Mude para URL real quando existir
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    // Busca o token do Secure Store de forma assíncrona
    const token = await getToken();
    
    // Se existir, injeta automaticamente no cabeçalho
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lógica para deslogar usuário caso o token expire (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido. O usuário deve ser deslogado.');
      // O AppNavigator ou um contexto global lidaria com o redirecionamento aqui
    }
    return Promise.reject(error);
  }
);

export default api;
