import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { deleteToken } from '../../services/authStorage';
import { ExportService } from '../../services/ExportService';
import ScreenHeader from '../../components/ScreenHeader';
import LoadingOverlay from '../../components/LoadingOverlay';
import EmptyState from '../../components/EmptyState';
import ExportModal from '../../components/ExportModal';

type SemesterData = {
  id: string;
  name: string;
  absencePercentage: number;
};

type Props = {
  navigation: any;
};

export default function SemestersScreen({ navigation }: Props) {
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      const response = await api.get('/coordenador/semestres');
      setSemesters(response.data);
    } catch (error) {
      console.log('Error loading semesters', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await deleteToken();
    navigation.replace('Login');
  };

  const handleExport = async (format: 'pdf' | 'excel', includeDetails: boolean) => {
    setExportModalVisible(false);
    setExporting(true);
    try {
      const response = await api.get(`/coordenador/relatorio?level=semesters&includeDetails=${includeDetails}`);
      const data = response.data;
      
      if (format === 'excel') {
        let excelData = [];
        data.forEach((s: any) => {
          excelData.push({ 'Semestre': s.semester, 'Faltas (%)': s.absencePercentage, 'Detalhes': '' });
          if (includeDetails && s.details) {
            s.details.forEach((d: any) => {
              excelData.push({ 'Semestre': '', 'Faltas (%)': d.absencePercentage, 'Detalhes': `Aluno: ${d.name} (RA: ${d.ra})` });
            });
          }
        });
        await ExportService.exportToExcel(excelData, 'Relatorio_Semestres');
      } else {
        const headers = includeDetails ? ['Semestre', 'Aluno', 'RA', 'Faltas (%)'] : ['Semestre', 'Faltas (%)'];
        let rows: any[] = [];
        data.forEach((s: any) => {
          if (!includeDetails) {
            rows.push([s.semester, `${s.absencePercentage}%`]);
          } else {
            rows.push([`<strong style="color:#0ea5e9">${s.semester}</strong>`, '', '', `<strong style="color:#0ea5e9">${s.absencePercentage}%</strong>`]);
            if (s.details) {
              s.details.forEach((d: any) => {
                const percHtml = d.absencePercentage >= 25 ? `<span class="high-absence">${d.absencePercentage}%</span>` : `${d.absencePercentage}%`;
                rows.push(['', d.name, d.ra, percHtml]);
              });
            }
          }
        });
        const html = ExportService.generateHTMLTable('Relatório de Semestres', headers, rows);
        await ExportService.exportToPDF(html, 'Relatorio_Semestres');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar relatório.');
    } finally {
      setExporting(false);
    }
  };

  const renderItem = ({ item }: { item: SemesterData }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-xl mb-3 shadow-sm flex-row items-center justify-between border border-gray-100"
      onPress={() => navigation.navigate('StudentsList', { semesterId: item.id })}
    >
      <View className="flex-row items-center">
        <View className="bg-sky-100 p-3 rounded-full mr-4">
          <Feather name="calendar" size={24} color="#0ea5e9" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-800">Semestre {item.name}</Text>
          <Text className="text-gray-500 mt-1">Clique para ver alunos</Text>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="text-xs text-gray-400 mb-1">Faltas Geral</Text>
        <Text className={`text-lg font-black ${item.absencePercentage >= 25 ? 'text-red-500' : 'text-emerald-500'}`}>
          {item.absencePercentage}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingOverlay message="Carregando semestres..." />;

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      {exporting && <LoadingOverlay message="Gerando relatório..." />}
      
      <ScreenHeader 
        title="Gestão Acadêmica" 
        rightButton={{
          label: 'Sair',
          onPress: handleLogout,
          variant: 'danger'
        }}
      />

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Semestres Ativos</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-gray-200 px-3 py-2 rounded-lg"
          onPress={() => setExportModalVisible(true)}
        >
          <Feather name="download" size={16} color="#475569" />
          <Text className="text-slate-600 font-bold ml-2">Exportar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={semesters}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState message="Nenhum semestre encontrado." />}
      />

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        title="Exportar Visão Geral"
      />
    </View>
  );
}
