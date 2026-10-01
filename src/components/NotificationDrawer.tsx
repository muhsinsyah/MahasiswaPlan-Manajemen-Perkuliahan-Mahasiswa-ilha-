import React from 'react';
import { SystemNotification } from '../types/academic';
import { Bell, CheckCheck, Clock, Calendar, AlertCircle, X, ChevronRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: SystemNotification) => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-heading font-semibold text-sm">Pusat Notifikasi & Alarm</h3>
              <p className="text-[11px] text-emerald-200/80">Pengingat kelas dan jadwal presentasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Total {notifications.length} notifikasi
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tandai Dibaca
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-red-600 cursor-pointer"
            >
              Bersihkan
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium text-slate-600">Tidak ada notifikasi saat ini</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pengingat kelas dan jadwal presentasi akan muncul otomatis di sini.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  notif.sudahDibaca
                    ? 'bg-white border-slate-200 hover:border-slate-300 opacity-80'
                    : 'bg-emerald-50/70 border-emerald-200 shadow-2xs hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    {notif.tipe === 'kelas' ? (
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span>{notif.judul}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.pesan}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Sistem pengingat aktif memantau jadwal kuliah hari ini.
          </p>
        </div>
      </div>
    </div>
  );
};
