import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { mockApi } from '../../services/mockApi';
import { ClassData } from '../../types';
import { deleteToken } from '../../services/authStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfessorStackParamList } from '../../navigation/ProfessorNavigator';
import { Feather } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingOverlay from '../../components/LoadingOverlay';
import EmptyState from '../../components/EmptyState';

type Props = {
  navigation: NativeStackNavigationProp<ProfessorStackParamList, 'Classes'>;
};

export default function ProfessorClassesScreen({ navigation }: Props) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await mockApi.getProfessorTurmas('prof_id_mock');
      setClasses(data);
    } catch (error) {
      console.log('Error loading classes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await deleteToken();
    navigation.replace('Login' as any); // Type hacking for generic auth flow
  };

  const renderItem = ({ item }: { item: ClassData }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('Attendance', { classId: item.id, subjectName: item.subject })}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-bold text-gray-800">{item.subject}</Text>
          <Text className="text-gray-500 font-medium mt-1">{item.time}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingOverlay />;

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <ScreenHeader 
        title="Minhas Turmas" 
        subtitle="Selecione uma turma para ver a presença de hoje." 
        rightButton={{
          label: 'Sair',
          onPress: handleLogout,
          variant: 'danger'
        }}
      />
      
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<EmptyState message="Nenhuma turma cadastrada." />}
      />
    </View>
  );
}
