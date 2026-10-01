export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export type TargetGrade = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';

export type PresentationStatus = 'To-Do' | 'Preparation' | 'Done';

export interface NoteItem {
  id: string;
  pertemuanKe: number;
  judul: string;
  isi: string;
  tanggal: string;
  poinPenting: string[];
}

export interface CourseTask {
  id: string;
  judul: string;
  deadline: string;
  selesai: boolean;
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi';
}

export interface Course {
  id: string;
  kode: string;
  nama: string;
  hari: DayOfWeek;
  jamMulai: string; // "07:30"
  jamSelesai: string; // "10:00"
  ruangan: string;
  dosen: string;
  sks: number;
  warnaTema: string; // hex or tailwind class identifier
  
  // Fitur 4: Self-Assessment & Performa
  targetNilai: TargetGrade;
  totalPertemuan: number; // default 16
  jumlahHadir: number; // e.g. 14
  ratingKeaktifan: number; // 1 - 5 stars
  catatanEvaluasi: string;
  
  // Fitur 2: Catatan Pribadi & Tugas
  catatanList: NoteItem[];
  tugasList: CourseTask[];
}

export interface Presentation {
  id: string;
  courseId: string;
  courseName: string;
  topik: string;
  tanggal: string; // YYYY-MM-DD
  jam: string; // "08:00"
  ruangan: string;
  anggotaKelompok: string;
  status: PresentationStatus;
  catatanPersiapan: string;
  slideUrl?: string;
}

export interface ReminderConfig {
  durasiSebelumKelas: 15 | 30 | 45 | 60; // minutes
  bunyikanAlarm: boolean;
  jenisNada?: 'gentle_chime' | 'digital_bell' | 'marimba';
  volumeAlarm?: number; // 0.1 to 1.0
  notifikasiDesktop: boolean;
  pengingatHMin1Presentasi: boolean;
  pengingatHariHPresentasi: boolean;
  pengingatHMin2Presentasi?: boolean;
  ambangBatasPresensi?: number; // e.g. 75%
  targetTotalPertemuanDefault?: number; // e.g. 16
  formatJam?: '24' | '12';
}

export interface UserProfile {
  id: string;
  nama: string;
  nim: string;
  email: string;
  programStudi: string;
  fakultas: string;
  semester: number;
  tahunAngkatan: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export interface SystemNotification {
  id: string;
  tipe: 'kelas' | 'presentasi_h1' | 'presentasi_hari_h' | 'evaluasi';
  judul: string;
  pesan: string;
  timestamp: string;
  sudahDibaca: boolean;
  courseId?: string;
  presentationId?: string;
}
