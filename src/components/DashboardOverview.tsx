import React from 'react';
import { Course, Presentation, ReminderConfig } from '../types/academic';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Presentation as PresIcon, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Plus, 
  ArrowUpRight,
  Sparkles,
  FileText
} from 'lucide-react';

interface DashboardOverviewProps {
  courses: Course[];
  presentations: Presentation[];
  onSelectCourse: (course: Course) => void;
  onOpenAddCourse: () => void;
  onOpenAddPresentation: () => void;
  onNavigateToTab: (tab: 'jadwal' | 'presentasi' | 'evaluasi' | 'skema') => void;
  currentDay: string;
  currentTime: string;
  reminderConfig: ReminderConfig;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  courses,
  presentations,
  onSelectCourse,
  onOpenAddCourse,
  onOpenAddPresentation,
  onNavigateToTab,
  currentDay,
  currentTime,
  reminderConfig,
}) => {
  // Find courses scheduled today
  const todayCourses = courses.filter((c) => c.hari === currentDay);

  // Find upcoming presentations within next 7 days
  const todayStr = '2026-10-01';
  const upcomingPresentations = presentations
    .map((p) => {
      const diffDays = Math.ceil(
        (new Date(p.tanggal).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24)
      );
      return { ...p, diffDays };
    })
    .sort((a, b) => a.diffDays - b.diffDays);

  const urgentPresentations = upcomingPresentations.filter(
    (p) => p.diffDays >= 0 && p.diffDays <= 2 && p.status !== 'Done'
  );

  // All incomplete tasks from all courses
  const allPendingTasks = courses
    .flatMap((c) =>
      (c.tugasList || [])
        .filter((t) => !t.selesai)
        .map((t) => ({ ...t, courseName: c.nama, courseCode: c.kode, courseWarna: c.warnaTema }))
    )
    .slice(0, 5);

  // Quick stats
  const totalSks = courses.reduce((acc, c) => acc + c.sks, 0);
  const totalNotes = courses.reduce((acc, c) => acc + (c.catatanList?.length || 0), 0);
  const avgAttendance =
    courses.length > 0
      ? Math.round(
          courses.reduce((acc, c) => acc + (c.jumlahHadir / (c.totalPertemuan || 16)) * 100, 0) /
            courses.length
        )
      : 100;

  return (
    <div className="space-y-4">
      {/* Hero Welcome & Quick Context */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] rounded-2xl p-4 sm:p-5 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-200">
              <span className="font-semibold">{currentDay}, 01 Okt 2026</span>
              <span aria-hidden="true">·</span>
              <span>Semester 5</span>
            </div>
            <h1 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight leading-tight">
              Plan Mahasiswa Ilha
            </h1>
            <p className="text-[11px] sm:text-xs text-emerald-100/90 leading-relaxed">
              Jadwal kuliah, catatan materi, dan persiapan presentasi Ilmu Hadis UIN Malang.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenAddCourse}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#064E3B] bg-white hover:bg-emerald-50 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Jadwal Matkul</span>
            </button>
            <button
              onClick={onOpenAddPresentation}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-400/30 rounded-lg transition-colors cursor-pointer"
            >
              <PresIcon className="w-3.5 h-3.5" />
              <span>+ Presentasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Presentation Alert Banner (H-1 or Hari-H) */}
      {urgentPresentations.length > 0 && (
        <div className="space-y-2">
          {urgentPresentations.map((pres) => (
            <div
              key={pres.id}
              className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-950">
                    <span>
                      {pres.diffDays === 0
                        ? '🔥 Peringatan Hari-H Presentasi Hari Ini!'
                        : '⚠️ Pengingat H-1: Jadwal Presentasi Besok!'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded">
                      {pres.jam} WIB
                    </span>
                  </div>
                  <p className="text-amber-800 font-medium">
                    {pres.courseName}: "{pres.topik}"
                  </p>
                  <p className="text-amber-700">
                    Ruang: {pres.ruangan} · Tim: {pres.anggotaKelompok} · Status:{' '}
                    <strong>{pres.status}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('presentasi')}
                className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-300 rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Academic Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateToTab('jadwal')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Mata Kuliah</span>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-heading font-bold text-slate-900 font-mono">
            {courses.length} <span className="text-xs font-normal text-slate-500">Matkul</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">{totalSks} SKS Semester Ini</p>
        </div>

        <div 
          onClick={() => onNavigateToTab('presentasi')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Agenda Presentasi</span>
            <PresIcon className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-heading font-bold text-slate-900 font-mono">
            {presentations.length} <span className="text-xs font-normal text-slate-500">Jadwal</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            {presentations.filter((p) => p.status !== 'Done').length} Belum Selesai
          </p>
        </div>

        <div 
          onClick={() => onNavigateToTab('evaluasi')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Rata-Rata Presensi</span>
            <Calendar className="w-4 h-4 text-emerald-700" />
          </div>
          <div className={`text-2xl font-heading font-bold font-mono ${
            avgAttendance < 75 ? 'text-amber-700' : 'text-[#064E3B]'
          }`}>
            {avgAttendance}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Standar Kampus: Min. 75%</p>
        </div>

        <div 
          onClick={() => onNavigateToTab('evaluasi')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Catatan Materi</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-heading font-bold text-slate-900 font-mono">
            {totalNotes} <span className="text-xs font-normal text-slate-500">Rangkuman</span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-1 font-medium">Tersimpan rapi per kelas</p>
        </div>
      </div>

      {/* Main Grid: Kelas Hari Ini + Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Jadwal Kuliah Hari Ini */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Perkuliahan Hari Ini ({currentDay})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Alarm otomatis akan mengingatkan Anda {reminderConfig.durasiSebelumKelas} menit sebelum kelas dimulai.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('jadwal')}
              className="text-xs text-[#064E3B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Semua Jadwal Mingguan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayCourses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tidak ada jadwal kuliah hari ini</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                Waktu yang tepat untuk meninjau materi catatan, mengerjakan tugas, atau latihan presentasi.
              </p>
              <button
                onClick={() => onNavigateToTab('jadwal')}
                className="px-3.5 py-1.5 text-xs font-medium text-[#064E3B] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                Lihat Jadwal Hari Lain
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-2.5 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: course.warnaTema || '#047857' }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span className="font-semibold text-emerald-800">{course.kode}</span>
                        <span>·</span>
                        <span>{course.sks} SKS</span>
                        <span>·</span>
                        <span className="text-slate-700 font-medium">Target Nilai {course.targetNilai}</span>
                      </div>
                      <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                        {course.nama}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          {course.jamMulai} - {course.jamSelesai} WIB
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          {course.ruangan}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-emerald-700" />
                          {course.dosen}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                    <span className="text-[11px] font-mono text-slate-500">
                      Presensi: {Math.round((course.jumlahHadir / (course.totalPertemuan || 16)) * 100)}%
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-1 group-hover:translate-x-0.5 transition-transform">
                      Buka Catatan & Tugas
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 3: Tugas Mendesak & Akses Arsitektur */}
        <div className="space-y-5">
          {/* Box Tugas Mendesak */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-slate-900 text-sm">
                Tenggat Tugas Terdekat
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {allPendingTasks.length} pending
              </span>
            </div>

            {allPendingTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Semua tugas kuliah saat ini sudah selesai! 🎉
              </p>
            ) : (
              <div className="space-y-2.5">
                {allPendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-900 text-[11px]">
                        {task.courseCode} · {task.courseName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {task.deadline}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{task.judul}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className={`font-semibold ${
                        task.prioritas === 'Tinggi' ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        Prioritas: {task.prioritas}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Banner Skema & Rekomendasi Tech Stack */}
          <div className="bg-[#064E3B]/5 border border-[#064E3B]/20 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B]">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Kerangka Arsitektur & Skema DB</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tinjau skema database relasional (PostgreSQL), model JSON dokumen, dan rekomendasi stack full-stack yang telah dirancang.
            </p>
            <button
              onClick={() => onNavigateToTab('skema')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-[#053D2E] pt-1 cursor-pointer"
            >
              <span>Buka Dokumentasi Skema</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
