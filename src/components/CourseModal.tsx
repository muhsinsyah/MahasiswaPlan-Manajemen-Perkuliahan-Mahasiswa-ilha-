import React, { useState, useEffect } from 'react';
import { Course, DayOfWeek, TargetGrade } from '../types/academic';
import { BookOpen, Clock, MapPin, User, Check, X } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  courseToEdit?: Course | null;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const GRADES: TargetGrade[] = ['A', 'B+', 'B', 'C+', 'C', 'D'];
const THEME_COLORS = [
  { name: 'Hijau Kampus', hex: '#047857' },
  { name: 'Hijau Zamrud', hex: '#065F46' },
  { name: 'Teal Sains', hex: '#0F766E' },
  { name: 'Deep Forest', hex: '#115E59' },
  { name: 'Kuning Akademik', hex: '#B45309' },
];

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    nama: '',
    kode: '',
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '10:00',
    ruangan: '',
    dosen: '',
    sks: 3,
    targetNilai: 'A',
    warnaTema: '#047857',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (courseToEdit) {
      setFormData(courseToEdit);
    } else {
      setFormData({
        nama: '',
        kode: '',
        hari: 'Senin',
        jamMulai: '07:30',
        jamSelesai: '10:00',
        ruangan: '',
        dosen: '',
        sks: 3,
        targetNilai: 'A',
        warnaTema: '#047857',
      });
    }
    setErrors({});
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nama?.trim()) errs.nama = 'Nama mata kuliah wajib diisi';
    if (!formData.kode?.trim()) errs.kode = 'Kode mata kuliah wajib diisi';
    if (!formData.ruangan?.trim()) errs.ruangan = 'Ruangan perkuliahan wajib diisi';
    if (!formData.dosen?.trim()) errs.dosen = 'Nama dosen pengampu wajib diisi';
    if (!formData.jamMulai) errs.jamMulai = 'Jam mulai wajib diisi';
    if (!formData.jamSelesai) errs.jamSelesai = 'Jam selesai wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedCourse: Course = {
      id: courseToEdit ? courseToEdit.id : `course-${Date.now()}`,
      nama: formData.nama!.trim(),
      kode: formData.kode!.trim().toUpperCase(),
      hari: formData.hari as DayOfWeek,
      jamMulai: formData.jamMulai!,
      jamSelesai: formData.jamSelesai!,
      ruangan: formData.ruangan!.trim(),
      dosen: formData.dosen!.trim(),
      sks: Number(formData.sks) || 3,
      warnaTema: formData.warnaTema || '#047857',
      targetNilai: (formData.targetNilai as TargetGrade) || 'A',
      totalPertemuan: courseToEdit?.totalPertemuan || 16,
      jumlahHadir: courseToEdit?.jumlahHadir !== undefined ? courseToEdit.jumlahHadir : 16,
      ratingKeaktifan: courseToEdit?.ratingKeaktifan || 4,
      catatanEvaluasi: courseToEdit?.catatanEvaluasi || '',
      catatanList: courseToEdit?.catatanList || [],
      tugasList: courseToEdit?.tugasList || [],
    };

    onSave(savedCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Android Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2 sm:hidden" />
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white mt-1 sm:mt-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h2 className="font-heading font-semibold text-base">
              {courseToEdit ? 'Edit Jadwal Matkul' : 'Tambah Mata Kuliah'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Nama & Kode Matkul */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Mata Kuliah *
              </label>
              <input
                type="text"
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none ${
                  errors.nama ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.nama && <p className="text-[11px] text-red-600 mt-1">{errors.nama}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Matkul *
              </label>
              <input
                type="text"
                placeholder="Contoh: TI3101"
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none uppercase ${
                  errors.kode ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.kode && <p className="text-[11px] text-red-600 mt-1">{errors.kode}</p>}
            </div>
          </div>

          {/* Dosen & SKS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Dosen Pengampu & Gelar *
              </label>
              <input
                type="text"
                placeholder="Contoh: Dr. Muhammad Faisal, M.T."
                value={formData.dosen}
                onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none ${
                  errors.dosen ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.dosen && <p className="text-[11px] text-red-600 mt-1">{errors.dosen}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bobot SKS
              </label>
              <select
                value={formData.sks}
                onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                <option value={1}>1 SKS</option>
                <option value={2}>2 SKS</option>
                <option value={3}>3 SKS</option>
                <option value={4}>4 SKS</option>
                <option value={6}>6 SKS (Skripsi)</option>
              </select>
            </div>
          </div>

          {/* Hari & Ruangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hari Perkuliahan *
              </label>
              <select
                value={formData.hari}
                onChange={(e) => setFormData({ ...formData, hari: e.target.value as DayOfWeek })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ruangan / Gedung *
              </label>
              <input
                type="text"
                placeholder="Contoh: Gedung BJ Habibie R.302"
                value={formData.ruangan}
                onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none ${
                  errors.ruangan ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.ruangan && <p className="text-[11px] text-red-600 mt-1">{errors.ruangan}</p>}
            </div>
          </div>

          {/* Jam Mulai & Jam Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jam Mulai *
              </label>
              <input
                type="time"
                value={formData.jamMulai}
                onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jam Selesai *
              </label>
              <input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Target Nilai & Aksen Tema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Nilai Akhir
              </label>
              <div className="flex items-center gap-1.5">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetNilai: grade })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                      formData.targetNilai === grade
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aksen Warna Kampus
              </label>
              <div className="flex items-center gap-2 pt-1">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, warnaTema: color.hex })}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {formData.warnaTema === color.hex && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {courseToEdit ? 'Simpan Perubahan' : 'Tambahkan ke Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
