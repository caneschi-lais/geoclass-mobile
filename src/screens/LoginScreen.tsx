import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';
import { saveToken } from '../services/authStorage';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // Faz a requisição de login
      const response = await api.post('/login', { email, password });
      
      const token = response.data?.token;

      if (token) {
        await saveToken(token);
        // Redireciona para a tela inicial
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', 'Token não retornado pelo servidor.');
      }
    } catch (error: any) {
      console.log('Erro de login:', error);
      const message = error.response?.data?.message || 'Falha ao conectar com o servidor.';
      Alert.alert('Erro de Autenticação', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Image 
        source={require('../../assets/images/logo.jpg')} 
        className="w-32 h-32 mb-10"
        resizeMode="contain"
      />
      
      <Text className="text-3xl font-bold text-gray-800 mb-8">GeoClass</Text>

      <View className="w-full max-w-sm mb-4">
        <Text className="text-gray-600 mb-2 font-medium">E-mail</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-4 text-gray-800 border border-gray-200"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="w-full max-w-sm mb-8">
        <Text className="text-gray-600 mb-2 font-medium">Senha</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-4 text-gray-800 border border-gray-200"
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        className={`w-full max-w-sm rounded-lg p-4 items-center ${loading ? 'bg-sky-400' : 'bg-sky-500'}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-lg">Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
