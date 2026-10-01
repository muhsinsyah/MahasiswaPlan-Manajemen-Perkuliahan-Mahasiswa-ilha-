import React, { useState } from 'react';
import { ReminderConfig, Course, Presentation, UserProfile } from '../types/academic';
import { playChimeSound } from '../utils/audioChime';
import { exportCoursesToCSV, exportPresentationsToCSV, exportFullBackupJSON } from '../utils/csvExport';
import { 
  SlidersHorizontal, 
  Clock, 
  Bell, 
  Volume2, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  X 
} from 'lucide-react';

interface ComprehensiveSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReminderConfig;
  onSaveConfig: (newConfig: ReminderConfig) => void;
  courses: Course[];
  presentations: Presentation[];
  userProfile: UserProfile;
  onResetAllData: () => void;
  onImportData: (imported: { courses?: Course[]; presentations?: Presentation[]; reminderConfig?: ReminderConfig }) => void;
  onTriggerDemoAlarm: () => void;
}

export const ComprehensiveSettingsModal: React.FC<ComprehensiveSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  courses,
  presentations,
  userProfile,
  onResetAllData,
  onImportData,
  onTriggerDemoAlarm,
}) => {
  const [formData, setFormData] = useState<ReminderConfig>(config);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'alarm' | 'jadwal' | 'presensi' | 'data'>('alarm');
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const handleTestSound = () => {
    setIsPlayingTest(true);
    playChimeSound(formData.jenisNada || 'gentle_chime', formData.volumeAlarm ?? 0.8);
    setTimeout(() => setIsPlayingTest(false), 1600);
  };

  const handleRequestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung Web Notifications API.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        new Notification('Plan Mahasiswa Ilha', {
          body: 'Notifikasi berhasil diaktifkan! Pengingat jadwal kuliah siap dikirim.',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error('Error requesting notification permission', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        alert('Data berhasil diimpor!');
        onClose();
      } catch (err) {
        alert('File JSON tidak valid atau rusak.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Android Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white mt-1 sm:mt-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800 text-emerald-200">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-base">
                Pusat Pengaturan Aplikasi
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                Sesuaikan alarm, jadwal kuliah, presensi & CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSettingsTab('alarm')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer ${
              activeSettingsTab === 'alarm'
                ? 'border-emerald-700 text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Alarm & Suara
          </button>
          <button
            type="button"
            onClick={() => setActiveSettingsTab('jadwal')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer ${
              activeSettingsTab === 'jadwal'
                ? 'border-emerald-700 text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Jadwal & Format
          </button>
          <button
            type="button"
            onClick={() => setActiveSettingsTab('presensi')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer ${
              activeSettingsTab === 'presensi'
                ? 'border-emerald-700 text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Presensi & Evaluasi
          </button>
          <button
            type="button"
            onClick={() => setActiveSettingsTab('data')}
            className={`py-3 border-b-2 whitespace-nowrap cursor-pointer ${
              activeSettingsTab === 'data'
                ? 'border-emerald-700 text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ekspor & Cadangan Data
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* TAB 1: ALARM & SUARA */}
          {activeSettingsTab === 'alarm' && (
            <div className="space-y-4">
              {/* Lead Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Waktu Pemicu Pengingat Kelas
                </label>
                <p className="text-xs text-slate-500 mb-2.5">
                  Berapa lama sebelum jadwal kuliah alarm pengingat visual/suara berbunyi.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([15, 30, 45, 60] as const).map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormData({ ...formData, durasiSebelumKelas: mins })}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        formData.durasiSebelumKelas === mins
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mins === 60 ? '1 Jam Sebelum' : `${mins} Menit Sebelum`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Melody Selection */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-800 block">
                      Aktifkan Melodi Alarm Audio
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Suara procedural chime ramah telinga tanpa delay unduh.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.bunyikanAlarm}
                    onChange={(e) => setFormData({ ...formData, bunyikanAlarm: e.target.checked })}
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-700 cursor-pointer"
                  />
                </div>

                {formData.bunyikanAlarm && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Pilihan Nada Alarm:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'gentle_chime', label: 'Harmoni 2-Nada' },
                          { id: 'digital_bell', label: 'Lonceng Kampus' },
                          { id: 'marimba', label: 'Akustik Marimba' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                jenisNada: m.id as 'gentle_chime' | 'digital_bell' | 'marimba',
                              })
                            }
                            className={`py-1.5 px-2 text-xs font-medium rounded border transition-colors cursor-pointer ${
                              (formData.jenisNada || 'gentle_chime') === m.id
                                ? 'bg-emerald-800 text-white border-emerald-800'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 flex-1 mr-4">
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600">Volume:</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={formData.volumeAlarm ?? 0.8}
                          onChange={(e) =>
                            setFormData({ ...formData, volumeAlarm: parseFloat(e.target.value) })
                          }
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleTestSound}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors cursor-pointer shrink-0"
                      >
                        {isPlayingTest ? 'Memutar...' : 'Tes Bunyi'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Browser Push Permission */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-emerald-950 block">
                    Notifikasi Desktop / Layar Kunci
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Status izin browser: <strong className="font-mono">{browserPermission}</strong>
                  </span>
                </div>
                {browserPermission !== 'granted' ? (
                  <button
                    type="button"
                    onClick={handleRequestBrowserPermission}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded transition-colors cursor-pointer"
                  >
                    Izinkan Notifikasi
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Terverifikasi
                  </span>
                )}
              </div>

              {/* Instant Test Alert */}
              <button
                type="button"
                onClick={() => {
                  onTriggerDemoAlarm();
                  onClose();
                }}
                className="w-full py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simulasi Alarm Sekarang (Uji Notifikasi Langsung)</span>
              </button>
            </div>
          )}

          {/* TAB 2: JADWAL & FORMAT */}
          {activeSettingsTab === 'jadwal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Format Penulisan Jam Kuliah
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, formatJam: '24' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-left ${
                      (formData.formatJam || '24') === '24'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Format 24 Jam (Contoh: 13:00 - 15:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, formatJam: '12' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-left ${
                      formData.formatJam === '12'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Format 12 Jam (Contoh: 01:00 PM)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Standar Total Pertemuan Semester
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Jumlah tatap muka default yang digunakan untuk menghitung persentase kehadiran per mata kuliah.
                </p>
                <select
                  value={formData.targetTotalPertemuanDefault || 16}
                  onChange={(e) =>
                    setFormData({ ...formData, targetTotalPertemuanDefault: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value={14}>14 Pertemuan (Format Khusus)</option>
                  <option value={16}>16 Pertemuan (Standar Nasional / UIN Malang)</option>
                  <option value={18}>18 Pertemuan (Termasuk UTS & UAS)</option>
                </select>
              </div>

              {/* Presentations Alert Flags */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Notifikasi Jadwal Presentasi
                </span>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <span className="text-xs text-slate-700">Pengingat H-2 Presentasi (Persiapan Bahan & Slide)</span>
                  <input
                    type="checkbox"
                    checked={formData.pengingatHMin2Presentasi ?? false}
                    onChange={(e) =>
                      setFormData({ ...formData, pengingatHMin2Presentasi: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <span className="text-xs text-slate-700">Pengingat H-1 Presentasi (Malam Sebelum Tampil)</span>
                  <input
                    type="checkbox"
                    checked={formData.pengingatHMin1Presentasi}
                    onChange={(e) =>
                      setFormData({ ...formData, pengingatHMin1Presentasi: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <span className="text-xs text-slate-700">Pengingat Hari-H Presentasi (Pagi Hari Kelas)</span>
                  <input
                    type="checkbox"
                    checked={formData.pengingatHariHPresentasi}
                    onChange={(e) =>
                      setFormData({ ...formData, pengingatHariHPresentasi: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-700 rounded border-slate-300"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: PRESENSI & EVALUASI */}
          {activeSettingsTab === 'presensi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  Ambang Batas Kehadiran Kelayakan Ujian (%)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Jika kehadiran Anda di suatu mata kuliah berada di bawah persentase ini, sistem akan memberikan label bahaya "Rawan Tidak Boleh Ujian".
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[70, 75, 80].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setFormData({ ...formData, ambangBatasPresensi: pct })}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        (formData.ambangBatasPresensi || 75) === pct
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Minimal {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900 block">
                  Informasi Perhitungan Nilai & IPK
                </span>
                <p>
                  Sistem menghitung prediksi IPK semester dengan menjumlahkan hasil kali (Bobot Nilai Target × SKS) dibagi total SKS yang Anda tempuh semester ini:
                </p>
                <div className="font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800 text-[11px]">
                  A = 4.0 · B+ = 3.5 · B = 3.0 · C+ = 2.5 · C = 2.0 · D = 1.0
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EKSPOR & CADANGAN DATA */}
          {activeSettingsTab === 'data' && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-xs text-slate-800 block mb-1">
                  Ekspor Jadwal & Presentasi ke CSV
                </span>
                <p className="text-xs text-slate-500 mb-3">
                  Unduh data jadwal kuliah Anda ke format CSV standar agar mudah dibuka di Microsoft Excel, Google Sheets, atau dicetak.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => exportCoursesToCSV(courses, userProfile.nama, userProfile.nim)}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-700 rounded-lg flex items-center gap-3 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">
                        Ekspor Jadwal Kuliah (.CSV)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {courses.length} mata kuliah semester ini
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportPresentationsToCSV(presentations)}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-700 rounded-lg flex items-center gap-3 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">
                        Ekspor Presentasi (.CSV)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {presentations.length} agenda presentasi
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Total JSON Backup */}
              <div className="pt-3 border-t border-slate-100">
                <span className="font-semibold text-xs text-slate-800 block mb-1">
                  Cadangan Penuh (Full JSON Backup) & Impor
                </span>
                <p className="text-xs text-slate-500 mb-2.5">
                  Simpan seluruh data mata kuliah, catatan materi per pertemuan, tugas, dan presentasi ke satu file JSON.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      exportFullBackupJSON({
                        courses,
                        presentations,
                        reminderConfig: formData,
                        userProfile,
                        exportedAt: new Date().toISOString(),
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Cadangan JSON</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pulihkan dari File JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Data */}
              <div className="pt-3 border-t border-slate-100">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-red-900 block">
                      Reset Data ke Awal (Default)
                    </span>
                    <span className="text-[11px] text-red-700">
                      Kembalikan jadwal contoh awal UIN Maulana Malik Ibrahim.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Yakin ingin mereset seluruh data jadwal dan catatan ke data awal?')) {
                        onResetAllData();
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-300 hover:bg-red-100 rounded transition-colors cursor-pointer"
                  >
                    Reset Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
