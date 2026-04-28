import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { deleteToken } from '../services/authStorage';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  navigation: any;
};

export default function PrivacyScreen({ navigation }: Props) {
  
  const handleLogout = async () => {
    await deleteToken();
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <ScreenHeader 
        title="Privacidade" 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-3">
            <Feather name="map-pin" size={24} color="#0ea5e9" className="mr-3" />
            <Text className="text-xl font-bold text-gray-800 ml-2">Uso da Localização</Text>
          </View>
          <Text className="text-gray-600 leading-relaxed mb-4">
            O GeoClass solicita acesso à sua localização <Text className="font-bold">apenas durante o uso</Text> do aplicativo e estritamente no momento em que você clica em "Confirmar Presença".
          </Text>
          <Text className="text-gray-600 leading-relaxed">
            Nós usamos o GPS unicamente para calcular a distância entre você e a sala de aula. Não rastreamos seus movimentos em segundo plano nem fora do horário de aula.
          </Text>
        </View>

        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-3">
            <Feather name="trash-2" size={24} color="#10b981" className="mr-3" />
            <Text className="text-xl font-bold text-gray-800 ml-2">Exclusão de Dados</Text>
          </View>
          <Text className="text-gray-600 leading-relaxed mb-4">
            A sua privacidade é levada a sério. Por padrão, nosso servidor apaga periodicamente os registros brutos de coordenadas logo após o cálculo e a gravação oficial da sua presença no diário de classe.
          </Text>
          <Text className="text-gray-600 leading-relaxed">
            O identificador do seu dispositivo é salvo de forma criptografada apenas para evitar fraudes (várias presenças no mesmo aparelho).
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleLogout} 
          className="bg-red-50 p-4 rounded-xl flex-row items-center justify-center border border-red-100 mt-4"
        >
          <Feather name="log-out" size={20} color="#dc2626" />
          <Text className="text-red-600 font-bold text-lg ml-2">Sair da Conta (Logout)</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
