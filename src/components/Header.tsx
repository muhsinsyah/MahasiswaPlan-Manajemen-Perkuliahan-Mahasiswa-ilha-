import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Presentation as PresIcon, 
  BarChart3, 
  Database, 
  Plus, 
  Bell, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal,
  Clock,
  User,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile } from '../types/academic';

interface HeaderProps {
  activeTab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi' | 'skema';
  onSelectTab: (tab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi' | 'skema') => void;
  onOpenAddCourse: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onExportCSV: () => void;
  onToggleNotificationDrawer: () => void;
  unreadNotificationsCount: number;
  alarmSoundEnabled: boolean;
  onToggleAlarmSound: () => void;
  currentTimeString: string;
  userProfile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddCourse,
  onOpenSettings,
  onOpenProfile,
  onExportCSV,
  onToggleNotificationDrawer,
  unreadNotificationsCount,
  alarmSoundEnabled,
  onToggleAlarmSound,
  currentTimeString,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('dashboard')} 
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-emerald-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base sm:text-lg text-[#064E3B] tracking-tight leading-none">
                  Plan Mahasiswa Ilha
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Ilmu Hadis · UIN Maulana Malik Ibrahim
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-md cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('jadwal')}
              className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-md cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Jadwal Kuliah
            </button>
            <button
              onClick={() => onSelectTab('presentasi')}
              className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-md cursor-pointer ${
                activeTab === 'presentasi'
                  ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Presentasi
            </button>
            <button
              onClick={() => onSelectTab('evaluasi')}
              className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-md cursor-pointer ${
                activeTab === 'evaluasi'
                  ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Evaluasi & Performa
            </button>
            <button
              onClick={() => onSelectTab('skema')}
              className={`px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-md cursor-pointer ${
                activeTab === 'skema'
                  ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Skema Data
            </button>
          </nav>

          {/* Zone 3: Actions (Ekspor CSV, Profile Login, Sound, Notification, Settings, Quick Add) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Export CSV Button */}
            <button
              onClick={onExportCSV}
              title="Ekspor Jadwal ke Format CSV (Excel/Sheets)"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            {/* Profile Avatar / Login Button */}
            <button
              onClick={onOpenProfile}
              title="Profil Mahasiswa & Akun"
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold font-mono">
                {userProfile.nama ? userProfile.nama.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[110px]">
                  {userProfile.nama.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                  {userProfile.nim ? userProfile.nim.slice(-4) : 'ILHA'}
                </span>
              </div>
            </button>

            {/* Alarm Sound Toggle */}
            <button
              onClick={onToggleAlarmSound}
              title={alarmSoundEnabled ? 'Alarm Suara Aktif (Klik untuk mute)' : 'Alarm Suara Mati (Klik untuk aktifkan)'}
              className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                alarmSoundEnabled 
                  ? 'text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70' 
                  : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {alarmSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotificationDrawer}
              title="Notifikasi & Pengingat"
              className="relative p-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Comprehensive Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Pusat Pengaturan Semua Fitur"
              className="p-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddCourse}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Matkul</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs overflow-x-auto">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'dashboard' ? 'text-[#064E3B] font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('jadwal')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'jadwal' ? 'text-[#064E3B] font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Jadwal
          </button>
          <button
            onClick={() => onSelectTab('presentasi')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'presentasi' ? 'text-[#064E3B] font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Presentasi
          </button>
          <button
            onClick={() => onSelectTab('evaluasi')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'evaluasi' ? 'text-[#064E3B] font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Performa
          </button>
          <button
            onClick={() => onSelectTab('skema')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'skema' ? 'text-[#064E3B] font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Skema
          </button>
        </div>
      </div>
    </header>
  );
};
