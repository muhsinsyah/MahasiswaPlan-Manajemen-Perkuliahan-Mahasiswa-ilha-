import React from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidTopBar } from './AndroidTopBar';
import { AndroidBottomNav } from './AndroidBottomNav';
import { UserProfile } from '../types/academic';
import { Smartphone, Monitor } from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi';
  onSelectTab: (tab: 'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi') => void;
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
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
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
  isFrameMode,
  onToggleFrameMode,
}) => {
  // If frame mode is enabled on desktop (>= sm), render phone chassis
  return (
    <div className={`min-h-screen ${isFrameMode ? 'sm:py-6 sm:px-4 bg-slate-900/90 flex flex-col items-center justify-center' : 'bg-[#F8FAF9]'}`}>
      {/* Desktop Mode Switcher Bar */}
      {isFrameMode && (
        <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Format HP Android (Pixel / Galaxy)</span>
          </div>
          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-white/10"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Layar Lebar</span>
          </button>
        </div>
      )}

      {/* Main Container: Android Phone Mockup Chassis on Desktop, Full-Screen Fluid on Mobile */}
      <div
        className={`w-full bg-[#F8FAF9] flex flex-col transition-all duration-300 relative ${
          isFrameMode
            ? 'sm:max-w-[425px] sm:h-[890px] sm:max-h-[95vh] sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 sm:shadow-2xl sm:shadow-black/70 sm:ring-1 sm:ring-white/20 overflow-hidden'
            : 'max-w-2xl mx-auto min-h-screen'
        }`}
      >
        {/* Android Speaker Grill Slot on Phone Chassis */}
        {isFrameMode && (
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-700 rounded-full z-50 pointer-events-none" />
        )}

        {/* 1. Android Status Bar */}
        <AndroidStatusBar
          currentTime={currentTimeString}
          hasUnreadNotifications={unreadNotificationsCount > 0}
        />

        {/* 2. Top App Bar */}
        <AndroidTopBar
          onOpenSettings={onOpenSettings}
          onOpenProfile={onOpenProfile}
          onExportCSV={onExportCSV}
          onToggleNotificationDrawer={onToggleNotificationDrawer}
          unreadNotificationsCount={unreadNotificationsCount}
          alarmSoundEnabled={alarmSoundEnabled}
          onToggleAlarmSound={onToggleAlarmSound}
          userProfile={userProfile}
          isFrameMode={isFrameMode}
          onToggleFrameMode={onToggleFrameMode}
        />

        {/* 3. Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 pb-6 space-y-4 scroll-smooth">
          {children}
        </div>

        {/* 4. Android Bottom Navigation Bar */}
        <AndroidBottomNav
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenAddCourse={onOpenAddCourse}
          onOpenProfile={onOpenProfile}
        />
      </div>
    </div>
  );
};
