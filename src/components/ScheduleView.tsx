import React, { useState } from 'react';
import { Course, DayOfWeek } from '../types/academic';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  FileText, 
  CheckSquare, 
  Award,
  ChevronRight,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

interface ScheduleViewProps {
  courses: Course[];
  onOpenAddCourse: () => void;
  onOpenEditCourse: (course: Course) => void;
  onSelectCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onExportCSV: () => void;
}

const ALL_DAYS: (DayOfWeek | 'Semua')[] = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  courses,
  onOpenAddCourse,
  onOpenEditCourse,
  onSelectCourse,
  onDeleteCourse,
  onExportCSV,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((c) => {
    const matchDay = selectedDay === 'Semua' || c.hari === selectedDay;
    const matchSearch =
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dosen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ruangan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDay && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
            Jadwal Mata Kuliah
          </h2>
          <p className="text-[11px] text-slate-500">
            {courses.length} matkul · Ketuk kartu untuk catatan & tugas
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onExportCSV}
            title="Ekspor Jadwal ke CSV"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={onOpenAddCourse}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Search + Days) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mata kuliah, kode, dosen, atau ruangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Days Filter Pills/Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ALL_DAYS.map((day) => {
            const count =
              day === 'Semua'
                ? courses.length
                : courses.filter((c) => c.hari === day).length;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedDay === day
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{day}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  selectedDay === day ? 'bg-emerald-900/60 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-slate-800 text-base">
            Tidak ada jadwal mata kuliah
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Tidak ditemukan jadwal yang cocok dengan filter atau kata kunci pencarian.
          </p>
          <button
            onClick={onOpenAddCourse}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mata Kuliah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => {
            const attendancePct = Math.round((course.jumlahHadir / (course.totalPertemuan || 16)) * 100);
            const activeTasksCount = course.tugasList?.filter((t) => !t.selesai).length || 0;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-800/30 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                onClick={() => onSelectCourse(course)}
              >
                {/* Accent Top Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: course.warnaTema || '#047857' }}
                />

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header info with unboxed typography */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-semibold text-emerald-800">{course.kode}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.sks} SKS</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditCourse(course);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit Jadwal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Yakin ingin menghapus mata kuliah ${course.nama}?`)) {
                              onDeleteCourse(course.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Hapus Mata Kuliah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {course.nama}
                    </h3>

                    {/* Details Rows */}
                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          <strong className="text-slate-800">{course.hari}</strong>, {course.jamMulai} - {course.jamSelesai} WIB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate" title={course.ruangan}>{course.ruangan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate" title={course.dosen}>{course.dosen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Meta Summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" title="Catatan Materi">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>{course.catatanList?.length || 0} catatan</span>
                      </span>
                      {activeTasksCount > 0 && (
                        <span className="flex items-center gap-1 text-amber-700 font-medium" title="Tugas Aktif">
                          <CheckSquare className="w-3 h-3" />
                          <span>{activeTasksCount} tugas</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-800 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
