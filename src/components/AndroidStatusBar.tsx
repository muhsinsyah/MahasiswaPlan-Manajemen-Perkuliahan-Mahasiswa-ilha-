import React from 'react';
import { Wifi, Signal, Battery, Bell } from 'lucide-react';

interface AndroidStatusBarProps {
  currentTime: string;
  hasUnreadNotifications?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  currentTime,
  hasUnreadNotifications = false,
}) => {
  // Extract simple HH:MM from time string
  const timeOnly = currentTime.replace(' WIB', '');

  return (
    <div className="w-full bg-[#043E2E] text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-mono select-none tracking-tight shrink-0 z-40">
      {/* Left: Clock & Notifications */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-100">{timeOnly}</span>
        {hasUnreadNotifications && (
          <Bell className="w-3 h-3 text-emerald-300 fill-emerald-300 animate-pulse" />
        )}
      </div>

      {/* Center: Camera Notch punch hole (aesthetic) */}
      <div className="w-3.5 h-3.5 bg-black/80 rounded-full mx-auto hidden sm:block border border-slate-700/50" />

      {/* Right: Network & Battery Indicators */}
      <div className="flex items-center gap-1.5 text-slate-200">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium">98%</span>
          <Battery className="w-4 h-4 fill-slate-200" />
        </div>
      </div>
    </div>
  );
};
