import React, { useState } from 'react';
import { Presentation, Course, PresentationStatus } from '../types/academic';
import { 
  Presentation as PresIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle,
  Clock3,
  FileSpreadsheet
} from 'lucide-react';
import { exportPresentationsToCSV } from '../utils/csvExport';

interface PresentationViewProps {
  presentations: Presentation[];
  courses: Course[];
  onOpenAddPresentation: () => void;
  onOpenEditPresentation: (presentation: Presentation) => void;
  onDeletePresentation: (presentationId: string) => void;
  onUpdatePresentationStatus: (presentationId: string, newStatus: PresentationStatus) => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  presentations,
  courses,
  onOpenAddPresentation,
  onOpenEditPresentation,
  onDeletePresentation,
  onUpdatePresentationStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<PresentationStatus | 'Semua'>('Semua');

  // Today reference for comparison (in 2026 current time context)
  const todayStr = '2026-10-01';

  const getDayDiff = (targetDate: string) => {
    const d1 = new Date(todayStr);
    const d2 = new Date(targetDate);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredPresentations = presentations.filter((p) => {
    if (filterStatus === 'Semua') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
            Tracker Presentasi
          </h2>
          <p className="text-[11px] text-slate-500">
            {presentations.length} agenda · Jadwal kelompok & tugas
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => exportPresentationsToCSV(presentations)}
            title="Ekspor CSV"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={onOpenAddPresentation}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Jadwal</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-lg w-fit">
        {(['Semua', 'To-Do', 'Preparation', 'Done'] as (PresentationStatus | 'Semua')[]).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === st
                ? 'bg-[#064E3B] text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'Semua' ? 'Semua Jadwal' : st === 'To-Do' ? 'To-Do' : st === 'Preparation' ? 'Persiapan' : 'Selesai'}
          </button>
        ))}
      </div>

      {/* Presentations List */}
      {filteredPresentations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <PresIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-slate-800 text-base">
            Tidak ada agenda presentasi
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Belum ada presentasi dengan status ini atau belum dijadwalkan.
          </p>
          <button
            onClick={onOpenAddPresentation}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Presentasi Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPresentations.map((pres) => {
            const diffDays = getDayDiff(pres.tanggal);
            const isToday = diffDays === 0;
            const isTomorrow = diffDays === 1; // H-1
            const isPast = diffDays < 0;

            return (
              <div
                key={pres.id}
                className={`p-5 rounded-xl border transition-all ${
                  isToday
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                    : isTomorrow
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    {/* Unboxed Metadata & Course Tag */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-900">
                        {pres.courseName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {pres.tanggal} ({pres.jam} WIB)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {pres.ruangan}
                      </span>
                    </div>

                    {/* Presentation Title */}
                    <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg">
                      {pres.topik}
                    </h3>

                    {/* Team Members */}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Pemateri: <strong className="text-slate-800">{pres.anggotaKelompok}</strong></span>
                    </div>

                    {/* Preparation Notes */}
                    {pres.catatanPersiapan && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                        <strong className="text-slate-700">Catatan Persiapan:</strong> {pres.catatanPersiapan}
                      </p>
                    )}

                    {/* Slide URL Link */}
                    {pres.slideUrl && (
                      <a
                        href={pres.slideUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Tautan Slide Presentasi</span>
                      </a>
                    )}
                  </div>

                  {/* Right Column: Status & Countdown & Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    {/* Countdown Indicator */}
                    <div className="text-right">
                      {isToday && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>HARI INI (H-0)</span>
                        </div>
                      )}
                      {isTomorrow && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>BESOK (H-1 PENGINGAT)</span>
                        </div>
                      )}
                      {!isToday && !isTomorrow && !isPast && (
                        <span className="text-xs font-mono text-slate-500">
                          {diffDays} hari lagi
                        </span>
                      )}
                      {isPast && (
                        <span className="text-xs font-mono text-slate-400">
                          Sudah lewat
                        </span>
                      )}
                    </div>

                    {/* Status Switcher Buttons */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {(['To-Do', 'Preparation', 'Done'] as PresentationStatus[]).map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => onUpdatePresentationStatus(pres.id, statusOption)}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                            pres.status === statusOption
                              ? statusOption === 'Done'
                                ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                                : statusOption === 'Preparation'
                                ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                                : 'bg-slate-800 text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {statusOption === 'To-Do' ? 'To-Do' : statusOption === 'Preparation' ? 'Persiapan' : 'Done'}
                        </button>
                      ))}
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditPresentation(pres)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                        title="Edit Presentasi"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus jadwal presentasi "${pres.topik}"?`)) {
                            onDeletePresentation(pres.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
