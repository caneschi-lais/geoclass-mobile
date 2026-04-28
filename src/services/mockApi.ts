import { ClassData } from '../types';

// Calcula a distância entre duas coordenadas usando a Fórmula de Haversine
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Raio da Terra em metros
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Simulando um banco de dados
const MOCK_CLASSES: ClassData[] = [
  {
    id: '1',
    subject: 'Matemática Aplicada',
    professor: 'Prof. Carlos',
    // Mockando para o horário atual pra não falhar por tempo sempre
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
    latitude: -23.5505, // Coordenada da sala de aula (Ex: Praça da Sé)
    longitude: -46.6333,
    radiusMeters: 50, // Permite check-in num raio de 50m
  },
  {
    id: '2',
    subject: 'História da Computação',
    professor: 'Profa. Ana',
    time: '08:00', // Aula antiga (vai falhar por tempo)
    latitude: -23.5505,
    longitude: -46.6333,
    radiusMeters: 50,
  }
];

export const mockApi = {
  getAulasHoje: async (): Promise<ClassData[]> => {
    // Simula tempo de rede
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CLASSES), 1000));
  },

  registrarPresenca: async (aulaId: string, lat: number, lon: number, deviceId: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const aula = MOCK_CLASSES.find(c => c.id === aulaId);
        if (!aula) {
          return reject(new Error('Aula não encontrada.'));
        }

        // 1. Validação de Distância
        const distance = getDistanceInMeters(lat, lon, aula.latitude, aula.longitude);
        if (distance > aula.radiusMeters) {
          // Se for uma aula mock e vc estiver testando em casa, provavelmente vai falhar de verdade
          // Por isso os "Mocks" são legais para testar a real lógica.
          return reject(new Error(`Fora do raio permitido. Você está a ${Math.round(distance)}m da sala de aula (Máx: ${aula.radiusMeters}m).`));
        }

        // 2. Validação de Tempo (> 15 min de atraso)
        const [classHour, classMin] = aula.time.split(':').map(Number);
        const classDate = new Date();
        classDate.setHours(classHour, classMin, 0, 0);

        const now = new Date();
        const diffMs = now.getTime() - classDate.getTime();
        const diffMins = Math.floor(diffMs / 1000 / 60);

        if (diffMins > 15) {
          return reject(new Error(`Atraso não permitido. Você chegou ${diffMins} minutos atrasado (Tolerância: 15 min).`));
        }
        
        if (diffMins < -60) {
           return reject(new Error('Muito cedo para registrar presença nesta aula.'));
        }

        // Sucesso
        console.log(`Presença registrada com sucesso usando Device ID: ${deviceId}`);
        resolve({ success: true, message: 'Presença confirmada!' });
      }, 1500);
    });
  }
};
