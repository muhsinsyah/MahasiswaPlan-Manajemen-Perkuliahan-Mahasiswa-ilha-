import { Course, Presentation } from '../types/academic';

/**
 * Escapes CSV values and wraps in quotes if containing commas, quotes, or newlines
 */
function escapeCSVValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports courses schedule to CSV format for Excel/Google Sheets backup and printing
 */
export function exportCoursesToCSV(courses: Course[], studentName?: string, nim?: string): void {
  const headers = [
    'Hari',
    'Jam Mulai',
    'Jam Selesai',
    'Kode Matkul',
    'Nama Mata Kuliah',
    'SKS',
    'Ruangan',
    'Dosen Pengampu',
    'Target Nilai',
    'Jumlah Hadir',
    'Total Pertemuan',
    'Persentase Presensi (%)',
    'Tingkat Keaktifan (1-5)',
    'Catatan Evaluasi Diri'
  ];

  const rows: string[] = [];

  // Metadata headers for student verification
  if (studentName || nim) {
    rows.push(`"JADWAL PERKULIAHAN - PLAN MAHASISWA ILHA"`);
    rows.push(`"Mahasiswa: ${studentName || '-'} | NIM: ${nim || '-'}"`);
    rows.push(`"Dicadangkan pada: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`);
    rows.push('');
  }

  rows.push(headers.map((h) => `"${h}"`).join(','));

  // Sort by day order
  const dayOrder: Record<string, number> = {
    'Senin': 1,
    'Selasa': 2,
    'Rabu': 3,
    'Kamis': 4,
    'Jumat': 5,
    'Sabtu': 6
  };

  const sortedCourses = [...courses].sort((a, b) => {
    const dayDiff = (dayOrder[a.hari] || 7) - (dayOrder[b.hari] || 7);
    if (dayDiff !== 0) return dayDiff;
    return a.jamMulai.localeCompare(b.jamMulai);
  });

  for (const c of sortedCourses) {
    const attendancePct = Math.round((c.jumlahHadir / (c.totalPertemuan || 16)) * 100);
    const row = [
      escapeCSVValue(c.hari),
      escapeCSVValue(c.jamMulai),
      escapeCSVValue(c.jamSelesai),
      escapeCSVValue(c.kode),
      escapeCSVValue(c.nama),
      escapeCSVValue(c.sks),
      escapeCSVValue(c.ruangan),
      escapeCSVValue(c.dosen),
      escapeCSVValue(c.targetNilai),
      escapeCSVValue(c.jumlahHadir),
      escapeCSVValue(c.totalPertemuan || 16),
      escapeCSVValue(`${attendancePct}%`),
      escapeCSVValue(c.ratingKeaktifan || 4),
      escapeCSVValue(c.catatanEvaluasi || '-')
    ];
    rows.push(row.join(','));
  }

  // Prepend UTF-8 BOM (\uFEFF) so Excel respects UTF-8 encoding
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Jadwal_Kuliah_Plan_Mahasiswa_Ilha_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports presentations list to CSV format
 */
export function exportPresentationsToCSV(presentations: Presentation[]): void {
  const headers = [
    'Tanggal',
    'Jam',
    'Mata Kuliah',
    'Topik Presentasi',
    'Ruangan',
    'Pemateri / Anggota Kelompok',
    'Status Progres',
    'Catatan Persiapan',
    'Tautan Slide'
  ];

  const rows: string[] = [];
  rows.push(`"AGENDA PRESENTASI - PLAN MAHASISWA ILHA"`);
  rows.push(`"Dicadangkan pada: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`);
  rows.push('');
  rows.push(headers.map((h) => `"${h}"`).join(','));

  const sortedPres = [...presentations].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  for (const p of sortedPres) {
    const row = [
      escapeCSVValue(p.tanggal),
      escapeCSVValue(p.jam),
      escapeCSVValue(p.courseName),
      escapeCSVValue(p.topik),
      escapeCSVValue(p.ruangan),
      escapeCSVValue(p.anggotaKelompok),
      escapeCSVValue(p.status),
      escapeCSVValue(p.catatanPersiapan || '-'),
      escapeCSVValue(p.slideUrl || '-')
    ];
    rows.push(row.join(','));
  }

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Jadwal_Presentasi_Plan_Mahasiswa_Ilha_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all academic data to JSON for total backup
 */
export function exportFullBackupJSON(data: Record<string, unknown>): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Backup_Lengkap_Plan_Mahasiswa_Ilha_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
