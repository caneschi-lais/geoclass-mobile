export interface ClassData {
  id: string;
  subject: string;
  professor: string;
  time: string; // "HH:mm"
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface DashboardStat {
  id: string;
  subject: string;
  attendancePercentage: number;
  status: 'Aprovado' | 'Reprovado' | 'Em Risco';
}

export interface AttendanceLog {
  id: string;
  date: string;
  time: string;
  subject: string;
}

