import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { deleteToken } from '../services/authStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { mockApi } from '../services/mockApi';
import { ClassData } from '../types';
import ClassCard from '../components/ClassCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // 1. Pedir permissão de localização ao abrir a tela
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'A permissão de localização é necessária para registrar presença.');
      }

      // 2. Buscar aulas do dia (Mock)
      const aulas = await mockApi.getAulasHoje();
      setClasses(aulas);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar os dados.');
    } finally {
      setLoadingInitial(false);
    }
  };

  const getUniqueDeviceId = async () => {
    let deviceId = '';
    if (Platform.OS === 'android') {
      deviceId = Application.getAndroidId();
    } else {
      deviceId = await Application.getIosIdForVendorAsync() || Device.osBuildId || 'unknown_ios';
    }
    return deviceId;
  };

  const handleConfirmAttendance = async (aula: ClassData) => {
    setProcessingId(aula.id);

    try {
      // 1. Checar se tem permissão novamente
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Acesso Negado', 'Precisamos da sua localização para confirmar a presença.');
        setProcessingId(null);
        return;
      }

      // 2. Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      // 3. Obter ID do dispositivo
      const deviceId = await getUniqueDeviceId();

      // 4. Enviar para a API
      const result = await mockApi.registrarPresenca(aula.id, lat, lon, deviceId);
      
      Alert.alert('Sucesso', 'Presença registrada com sucesso!');
      
    } catch (error: any) {
      console.log('Erro ao registrar:', error);
      Alert.alert('Não foi possível registrar', error.message || 'Erro desconhecido.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await deleteToken();
    navigation.replace('Login');
  };

  if (loadingInitial) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="mt-4 text-gray-500 font-medium">Buscando aulas de hoje...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-extrabold text-gray-800">Aulas de Hoje</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-red-100 px-3 py-2 rounded-lg">
          <Text className="text-red-600 font-bold">Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassCard 
            aula={item} 
            onConfirm={handleConfirmAttendance}
            isLoading={processingId === item.id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            Nenhuma aula programada para hoje.
          </Text>
        }
      />
    </View>
  );
}
