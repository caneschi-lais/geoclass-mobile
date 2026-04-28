import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { mockApi } from '../services/mockApi';
import { AttendanceLog } from '../types';
import { Feather } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await mockApi.getHistorico('aluno_id_mock');
      setLogs(data);
    } catch (error) {
      console.log('Error loading history', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: AttendanceLog }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border-l-4 border-l-sky-500 border border-y-gray-100 border-r-gray-100">
      <Text className="text-lg font-bold text-gray-800 mb-3">{item.subject}</Text>
      
      <View className="flex-row items-center justify-start gap-4">
        <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg">
          <Feather name="calendar" size={16} color="#64748b" />
          <Text className="text-gray-600 font-medium ml-2">{item.date}</Text>
        </View>
        
        <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg">
          <Feather name="clock" size={16} color="#64748b" />
          <Text className="text-gray-600 font-medium ml-2">{item.time}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-3xl font-extrabold text-gray-800 mb-2">Histórico</Text>
      <Text className="text-gray-500 font-medium mb-6">Registro das suas últimas presenças.</Text>
      
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            Nenhum registro encontrado.
          </Text>
        }
      />
    </View>
  );
}
