import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { mockApi } from '../../services/mockApi';
import { CoordinatorAnalytics, StudentRisk } from '../../types';
import { deleteToken } from '../../services/authStorage';
import { Feather } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingOverlay from '../../components/LoadingOverlay';
import StudentRiskCard from '../../components/StudentRiskCard';
import EmptyState from '../../components/EmptyState';

type Props = {
  navigation: any; // Type hacking for generic auth flow
};

export default function CoordinatorDashboardScreen({ navigation }: Props) {
  const [analytics, setAnalytics] = useState<CoordinatorAnalytics | null>(null);
  const [atRiskStudents, setAtRiskStudents] = useState<StudentRisk[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentRisk[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await mockApi.getCoordinatorAnalytics();
      setAnalytics(data.analytics);
      setAtRiskStudents(data.atRisk);
      setFilteredStudents(data.atRisk);
    } catch (error) {
      console.log('Error loading coordinator analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredStudents(atRiskStudents);
    } else {
      const filtered = atRiskStudents.filter(
        student => student.ra.toLowerCase().includes(text.toLowerCase()) || 
                   student.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  const handleLogout = async () => {
    await deleteToken();
    navigation.replace('Login');
  };

  if (loading) return <LoadingOverlay />;

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <ScreenHeader 
        title="Coordenação" 
        rightButton={{
          label: 'Sair',
          onPress: handleLogout,
          variant: 'danger'
        }}
      />

      {/* Analytics Cards */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-sky-500 flex-1 rounded-xl p-4 mr-2 shadow-sm">
          <Feather name="users" size={24} color="white" className="mb-2" />
          <Text className="text-sky-100 font-medium">Total Alunos</Text>
          <Text className="text-white text-2xl font-black">{analytics?.totalStudents}</Text>
        </View>
        <View className="bg-indigo-500 flex-1 rounded-xl p-4 ml-2 shadow-sm">
          <Feather name="book-open" size={24} color="white" className="mb-2" />
          <Text className="text-indigo-100 font-medium">Turmas Ativas</Text>
          <Text className="text-white text-2xl font-black">{analytics?.activeClasses}</Text>
        </View>
      </View>

      <Text className="text-xl font-bold text-gray-800 mb-4">Alunos em Risco (&lt; 75%)</Text>

      {/* Search Bar */}
      <View className="bg-white rounded-lg p-3 mb-4 border border-gray-200 flex-row items-center">
        <Feather name="search" size={20} color="#94a3b8" />
        <TextInput
          className="flex-1 ml-2 text-gray-800 font-medium"
          placeholder="Buscar aluno por RA ou Nome"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StudentRiskCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState message={searchQuery ? 'Nenhum aluno encontrado na busca.' : 'Nenhum aluno em risco.'} />
        }
      />
    </View>
  );
}
