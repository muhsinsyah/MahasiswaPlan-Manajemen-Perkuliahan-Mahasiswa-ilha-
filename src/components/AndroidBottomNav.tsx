import React from 'react';
import { 
  Home, 
  CalendarDays, 
  Presentation as PresIcon, 
  BarChart3, 
  User, 
  Plus
} from 'lucide-react';

interface AndroidBottomNavProps {
  activeTab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi';
  onSelectTab: (tab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi') => void;
  onOpenAddCourse: () => void;
  onOpenProfile: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddCourse,
  onOpenProfile,
}) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg shrink-0">
      <div className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'dashboard' ? 'text-[#064E3B] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-100 text-[#064E3B]' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Beranda</span>
        </button>

        {/* Tab 2: Jadwal */}
        <button
          onClick={() => onSelectTab('jadwal')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'jadwal' ? 'text-[#064E3B] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'jadwal' ? 'bg-emerald-100 text-[#064E3B]' : ''}`}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Jadwal</span>
        </button>

        {/* Center: Material Design Action FAB */}
        <div className="flex items-center justify-center h-full">
          <button
            onClick={onOpenAddCourse}
            title="Tambah Jadwal Perkuliahan"
            className="w-12 h-12 -mt-4 rounded-full bg-[#064E3B] hover:bg-[#053D2E] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer border-2 border-white"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Presentasi */}
        <button
          onClick={() => onSelectTab('presentasi')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'presentasi' ? 'text-[#064E3B] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'presentasi' ? 'bg-emerald-100 text-[#064E3B]' : ''}`}>
            <PresIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Presentasi</span>
        </button>

        {/* Tab 4: Performa */}
        <button
          onClick={() => onSelectTab('evaluasi')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-colors ${
            activeTab === 'evaluasi' ? 'text-[#064E3B] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'evaluasi' ? 'bg-emerald-100 text-[#064E3B]' : ''}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Performa</span>
        </button>
      </div>

      {/* Android Bottom Home Gesture Pill Bar */}
      <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mb-1.5" />
    </nav>
  );
};
