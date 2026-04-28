import axios from 'axios';

// Usar API local, mude para IP real do seu backend ou emulador/dispositivo
// Exemplo: http://10.0.2.2:3000 (Emulador Android) ou http://192.168.x.x:3000 (Celular Físico)
const api = axios.create({
  baseURL: 'http://localhost:3000', // Mude para URL real quando existir
  timeout: 10000,
});

export default api;
