import React, { useState } from 'react';
import { ReminderConfig } from '../types/academic';
import { playChimeSound } from '../utils/audioChime';
import { 
  Bell, 
  Volume2, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  X 
} from 'lucide-react';

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReminderConfig;
  onSaveConfig: (newConfig: ReminderConfig) => void;
  onTriggerDemoAlarm: () => void;
}

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTriggerDemoAlarm,
}) => {
  const [formData, setFormData] = useState<ReminderConfig>(config);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  if (!isOpen) return null;

  const handleTestSound = () => {
    setIsTestPlaying(true);
    playChimeSound();
    setTimeout(() => setIsTestPlaying(false), 1500);
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
        new Notification('MahasiswaPlan - UIN Malang', {
          body: 'Notifikasi aktif! Anda akan menerima pengingat kelas dan jadwal presentasi.',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error('Error requesting notification permission', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-300" />
            <h2 className="font-heading font-semibold text-base sm:text-lg">
              Pengaturan Notifikasi & Alarm Otomatis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* Durasi Pengingat Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              Waktu Pengingat Sebelum Kuliah Dimulai
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Aplikasi akan memicu alarm dan notifikasi visual sebelum jadwal kuliah aktif.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([15, 30, 60] as const).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setFormData({ ...formData, durasiSebelumKelas: mins })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    formData.durasiSebelumKelas === mins
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mins === 60 ? '1 Jam Sebelumnya' : `${mins} Menit Sebelumnya`}
                </button>
              ))}
            </div>
          </div>

          {/* Alarm Suara (Audio Chime) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white border border-slate-200 text-emerald-800">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-800 block">
                  Bunyikan Melodi Alarm Suara
                </span>
                <span className="text-[11px] text-slate-500">
                  Chime harmonis Web Audio API tanpa perlu file eksternal.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestSound}
                className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors cursor-pointer"
              >
                {isTestPlaying ? 'Memutar...' : 'Tes Suara'}
              </button>
              <input
                type="checkbox"
                checked={formData.bunyikanAlarm}
                onChange={(e) => setFormData({ ...formData, bunyikanAlarm: e.target.checked })}
                className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Pengingat Khusus Presentasi (H-1 & Hari-H) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Notifikasi Khusus Jadwal Presentasi
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <div>
                  <span className="text-xs font-medium text-slate-800 block">
                    Pengingat H-1 Presentasi (Besok)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mengingatkan untuk gladi resik dan cek kelengkapan slide malam sebelumnya.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pengingatHMin1Presentasi}
                  onChange={(e) => setFormData({ ...formData, pengingatHMin1Presentasi: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <div>
                  <span className="text-xs font-medium text-slate-800 block">
                    Pengingat Hari-H Presentasi
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Peringatan penting di pagi hari agar siap tampil di kelas.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pengingatHariHPresentasi}
                  onChange={(e) => setFormData({ ...formData, pengingatHariHPresentasi: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-700 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Izin Notifikasi Browser Push */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-emerald-950 block">
                Notifikasi Browser (Desktop/Mobile)
              </span>
              <span className="text-[11px] text-slate-600">
                Status saat ini: <strong className="font-mono">{browserPermission}</strong>
              </span>
            </div>
            {browserPermission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded transition-colors cursor-pointer"
              >
                Aktifkan
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Aktif
              </span>
            )}
          </div>

          {/* Demo Trigger Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onTriggerDemoAlarm();
                onClose();
              }}
              className="w-full py-2 px-3 text-xs font-medium text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Simulasi Alarm Sekarang (Uji Notifikasi Langsung)</span>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
