import React, { useState } from 'react';
import { Course, NoteItem, CourseTask, TargetGrade } from '../types/academic';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  FileText, 
  Star, 
  AlertTriangle, 
  X,
  Edit2
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (updatedCourse: Course) => void;
  onEditCourseSchedule: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onUpdateCourse,
  onEditCourseSchedule,
}) => {
  const [activeTab, setActiveTab] = useState<'catatan' | 'tugas' | 'evaluasi'>('catatan');

  // Form state for adding new note
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNotePertemuan, setNewNotePertemuan] = useState(1);
  const [newNoteJudul, setNewNoteJudul] = useState('');
  const [newNoteIsi, setNewNoteIsi] = useState('');
  const [newNotePoin, setNewNotePoin] = useState('');

  // Form state for adding new task
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskJudul, setNewTaskJudul] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPrioritas, setNewTaskPrioritas] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');

  // Evaluation editing state
  const [evaluasiNote, setEvaluasiNote] = useState(course?.catatanEvaluasi || '');
  const [activityRating, setActivityRating] = useState(course?.ratingKeaktifan || 4);
  const [targetGrade, setTargetGrade] = useState<TargetGrade>(course?.targetNilai || 'A');

  if (!isOpen || !course) return null;

  const attendancePercentage = Math.round((course.jumlahHadir / (course.totalPertemuan || 16)) * 100);
  const isAttendanceAtRisk = attendancePercentage < 75;

  const handleAttendanceChange = (delta: number) => {
    const updatedHadir = Math.max(0, Math.min(course.totalPertemuan, course.jumlahHadir + delta));
    const updated = { ...course, jumlahHadir: updatedHadir };
    onUpdateCourse(updated);
  };

  const handleSaveEvaluation = () => {
    const updated: Course = {
      ...course,
      catatanEvaluasi: evaluasiNote,
      ratingKeaktifan: activityRating,
      targetNilai: targetGrade,
    };
    onUpdateCourse(updated);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteJudul.trim()) return;

    const poinList = newNotePoin
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      pertemuanKe: newNotePertemuan,
      judul: newNoteJudul.trim(),
      isi: newNoteIsi.trim(),
      tanggal: new Date().toISOString().split('T')[0],
      poinPenting: poinList,
    };

    const updated = {
      ...course,
      catatanList: [newNote, ...(course.catatanList || [])],
    };
    onUpdateCourse(updated);
    setIsAddingNote(false);
    setNewNoteJudul('');
    setNewNoteIsi('');
    setNewNotePoin('');
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = {
      ...course,
      catatanList: course.catatanList.filter((n) => n.id !== noteId),
    };
    onUpdateCourse(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskJudul.trim() || !newTaskDeadline) return;

    const newTask: CourseTask = {
      id: `task-${Date.now()}`,
      judul: newTaskJudul.trim(),
      deadline: newTaskDeadline,
      selesai: false,
      prioritas: newTaskPrioritas,
    };

    const updated = {
      ...course,
      tugasList: [newTask, ...(course.tugasList || [])],
    };
    onUpdateCourse(updated);
    setIsAddingTask(false);
    setNewTaskJudul('');
    setNewTaskDeadline('');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = {
      ...course,
      tugasList: course.tugasList.map((t) => (t.id === taskId ? { ...t, selesai: !t.selesai } : t)),
    };
    onUpdateCourse(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = {
      ...course,
      tugasList: course.tugasList.filter((t) => t.id !== taskId),
    };
    onUpdateCourse(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Android Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2 sm:hidden" />
        
        {/* Course Header Banner */}
        <div 
          className="p-4 sm:p-5 text-white relative"
          style={{ backgroundColor: course.warnaTema || '#047857' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-100 mb-1">
                <span>{course.kode}</span>
                <span>·</span>
                <span>{course.sks} SKS</span>
                <span>·</span>
                <span>Target: Nilai {course.targetNilai}</span>
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
                {course.nama}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEditCourseSchedule(course)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Edit data jadwal matkul"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/20 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-200 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-emerald-200">Hari & Jam</span>
                <span className="font-medium">{course.hari}, {course.jamMulai} - {course.jamSelesai}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-200 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-emerald-200">Ruangan</span>
                <span className="font-medium truncate" title={course.ruangan}>{course.ruangan}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-200 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-emerald-200">Dosen</span>
                <span className="font-medium truncate" title={course.dosen}>{course.dosen}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-200 shrink-0" />
              <div>
                <span className="block text-[10px] text-emerald-200">Presensi ({course.jumlahHadir}/{course.totalPertemuan})</span>
                <span className="font-mono font-medium">{attendancePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('catatan')}
              className={`py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'catatan'
                  ? 'border-emerald-700 text-[#064E3B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Catatan Materi ({course.catatanList?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('tugas')}
              className={`py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'tugas'
                  ? 'border-emerald-700 text-[#064E3B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tugas & Deadline ({course.tugasList?.filter((t) => !t.selesai).length || 0} aktif)
            </button>
            <button
              onClick={() => setActiveTab('evaluasi')}
              className={`py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'evaluasi'
                  ? 'border-emerald-700 text-[#064E3B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Evaluasi Diri & Presensi
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {/* TAB 1: CATATAN MATERI PER PERTEMUAN */}
          {activeTab === 'catatan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 text-base">
                    Catatan Materi & Poin Penting Kuliah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dokumentasikan pembahasan per pertemuan dan rangkuman sebelum ujian.
                  </p>
                </div>
                {!isAddingNote && (
                  <button
                    onClick={() => setIsAddingNote(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Catatan</span>
                  </button>
                )}
              </div>

              {/* Form Tambah Catatan */}
              {isAddingNote && (
                <form onSubmit={handleAddNote} className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-emerald-950">
                      Tulis Catatan Pertemuan Baru
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Pertemuan Ke</label>
                      <select
                        value={newNotePertemuan}
                        onChange={(e) => setNewNotePertemuan(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                      >
                        {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            Pertemuan {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Topik / Judul Pembahasan *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Pengenalan Arsitektur MVC & Routing"
                        value={newNoteJudul}
                        onChange={(e) => setNewNoteJudul(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rangkuman / Catatan Materi</label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan ringkasan materi, teori dosen, atau studi kasus hari ini..."
                      value={newNoteIsi}
                      onChange={(e) => setNewNoteIsi(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Poin-poin Kunci / Rumus Penting (1 baris per poin)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh:&#10;Konsep State Immutability&#10;Rumus Kompleksitas O(n log n)"
                      value={newNotePoin}
                      onChange={(e) => setNewNotePoin(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded cursor-pointer"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </form>
              )}

              {/* Note List */}
              {(!course.catatanList || course.catatanList.length === 0) ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Belum ada catatan pertemuan</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik tombol "Tambah Catatan" untuk mulai merekam materi penting di kelas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.catatanList.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span className="font-semibold text-emerald-800">
                              Pertemuan {note.pertemuanKe}
                            </span>
                            <span>·</span>
                            <span>{note.tanggal}</span>
                          </div>
                          <h4 className="font-heading font-semibold text-slate-900 text-sm">
                            {note.judul}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                          title="Hapus catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {note.isi && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {note.isi}
                        </p>
                      )}

                      {note.poinPenting && note.poinPenting.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Poin Kunci:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                            {note.poinPenting.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TUGAS KULIAH & DEADLINE */}
          {activeTab === 'tugas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 text-base">
                    Tugas & Tenggat Waktu (Deadlines)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola checklist penugasan mandiri maupun kelompok untuk mata kuliah ini.
                  </p>
                </div>
                {!isAddingTask && (
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Tugas</span>
                  </button>
                )}
              </div>

              {/* Form Tambah Tugas */}
              {isAddingTask && (
                <form onSubmit={handleAddTask} className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-emerald-950">
                      Tambah Tugas Baru
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Judul Tugas *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Laporan Praktikum Modul 3 & Source Code"
                      value={newTaskJudul}
                      onChange={(e) => setNewTaskJudul(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Tenggat Waktu (Deadline) *</label>
                      <input
                        type="date"
                        value={newTaskDeadline}
                        onChange={(e) => setNewTaskDeadline(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Tingkat Prioritas</label>
                      <select
                        value={newTaskPrioritas}
                        onChange={(e) => setNewTaskPrioritas(e.target.value as 'Rendah' | 'Sedang' | 'Tinggi')}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                      >
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded cursor-pointer"
                    >
                      Simpan Tugas
                    </button>
                  </div>
                </form>
              )}

              {/* Task Checklist */}
              {(!course.tugasList || course.tugasList.length === 0) ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Tidak ada tugas aktif</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Semua penugasan sudah tuntas atau belum ditambahkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {course.tugasList.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                        task.selesai ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          {task.selesai ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div>
                          <p className={`text-xs font-medium ${task.selesai ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.judul}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>Deadline: <span className="font-mono">{task.deadline}</span></span>
                            <span>·</span>
                            <span className={`font-semibold ${
                              task.prioritas === 'Tinggi' ? 'text-amber-700' : 'text-slate-600'
                            }`}>
                              Prioritas: {task.prioritas}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SELF-ASSESSMENT & EVALUASI PERFORMA */}
          {activeTab === 'evaluasi' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading font-semibold text-slate-900 text-base">
                  Indikator Kualitas & Performa Kuliah
                </h3>
                <p className="text-xs text-slate-500">
                  Pantau kehadiran, target nilai, keaktifan diskusi, dan catatan evaluasi diri.
                </p>
              </div>

              {/* Attendance Tracker Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-heading font-semibold text-slate-900 text-sm block">
                      Persentase Kehadiran Kelas
                    </span>
                    <span className="text-xs text-slate-500">
                      Standar minimal kelayakan ujian UIN: 75% dari total 16 pertemuan.
                    </span>
                  </div>
                  <span className={`text-lg font-mono font-bold ${isAttendanceAtRisk ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {attendancePercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isAttendanceAtRisk ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Hadir: <strong className="font-mono text-slate-900">{course.jumlahHadir}</strong> dari{' '}
                    <span className="font-mono">{course.totalPertemuan}</span> pertemuan
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAttendanceChange(-1)}
                      disabled={course.jumlahHadir <= 0}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      -1 Absen
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(1)}
                      disabled={course.jumlahHadir >= course.totalPertemuan}
                      className="px-2 py-1 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-900 disabled:opacity-40 cursor-pointer"
                    >
                      +1 Hadir
                    </button>
                  </div>
                </div>

                {isAttendanceAtRisk && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Peringatan: Kehadiran di bawah 75%! Segera konfirmasi izin/sakit ke dosen agar tidak terancam gugur ujian.
                    </span>
                  </div>
                )}
              </div>

              {/* Target Nilai & Rating Keaktifan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Nilai */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <span className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Nilai Akhir
                  </span>
                  <p className="text-xs text-slate-500 mb-2">
                    Ekspektasi nilai yang ingin dicapai pada semester ini.
                  </p>
                  <div className="flex items-center gap-1.5">
                    {(['A', 'B+', 'B', 'C+', 'C'] as TargetGrade[]).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setTargetGrade(grade)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                          targetGrade === grade
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Keaktifan */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <span className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Keaktifan di Kelas (1 - 5 Bintang)
                  </span>
                  <p className="text-xs text-slate-500 mb-2">
                    Seberapa sering bertanya, menjawab, atau berpartisipasi.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setActivityRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        title={`${star} Bintang`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= activityRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-semibold text-slate-700 ml-1">
                      {activityRating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Catatan Evaluasi Diri */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Evaluasi Diri (Refleksi Mahasiswa)
                </label>
                <textarea
                  rows={3}
                  placeholder="Misal: 'Materi turunan parsial masih bingung, perlu latihan soal ekstra sebelum UTS' atau 'Fokus tingkatkan kehadiran'."
                  value={evaluasiNote}
                  onChange={(e) => setEvaluasiNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg transition-colors cursor-pointer"
                >
                  Perbarui Evaluasi Diri
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Kode: <span className="font-mono font-medium text-slate-800">{course.kode}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
