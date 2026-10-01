import React from 'react';
import { 
  GraduationCap, 
  Bell, 
  SlidersHorizontal, 
  Volume2, 
  VolumeX, 
  FileSpreadsheet,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { UserProfile } from '../types/academic';

interface AndroidTopBarProps {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onExportCSV: () => void;
  onToggleNotificationDrawer: () => void;
  unreadNotificationsCount: number;
  alarmSoundEnabled: boolean;
  onToggleAlarmSound: () => void;
  userProfile: UserProfile;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  onOpenSettings,
  onOpenProfile,
  onExportCSV,
  onToggleNotificationDrawer,
  unreadNotificationsCount,
  alarmSoundEnabled,
  onToggleAlarmSound,
  userProfile,
  isFrameMode,
  onToggleFrameMode,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Brand & Student Program Lockup */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-heading font-bold text-xs shadow-xs border border-emerald-300/40 cursor-pointer active:scale-95 transition-transform"
          title="Buka Profil Mahasiswa"
        >
          {userProfile.nama ? userProfile.nama.charAt(0).toUpperCase() : 'M'}
        </button>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-sm text-[#064E3B] leading-none tracking-tight">
              Plan Mahasiswa Ilha
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
            {userProfile.programStudi} · Sem {userProfile.semester}
          </span>
        </div>
      </div>

      {/* Action Controls in Android Compact Bar */}
      <div className="flex items-center gap-1">
        {/* Quick CSV Export */}
        <button
          onClick={onExportCSV}
          title="Ekspor Jadwal ke CSV"
          className="p-2 rounded-full text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
        </button>

        {/* Alarm Sound Toggle */}
        <button
          onClick={onToggleAlarmSound}
          title={alarmSoundEnabled ? 'Mute Suara Alarm' : 'Aktifkan Suara Alarm'}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            alarmSoundEnabled ? 'text-emerald-800 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
          }`}
        >
          {alarmSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onToggleNotificationDrawer}
          title="Notifikasi & Pengingat"
          className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Pengaturan"
          className="p-2 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Toggle Frame Mode (Mockup Device vs Fullscreen) on desktop */}
        <button
          onClick={onToggleFrameMode}
          title={isFrameMode ? 'Ubah ke Tampilan Lebar' : 'Ubah ke Format Mockup Android'}
          className="hidden md:inline-flex p-2 rounded-full text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          {isFrameMode ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
