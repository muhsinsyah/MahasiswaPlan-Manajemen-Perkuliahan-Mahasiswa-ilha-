import React, { useState, useEffect } from 'react';
import { Presentation, Course, PresentationStatus } from '../types/academic';
import { Presentation as PresIcon, Calendar, Clock, MapPin, Users, Link2, X } from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (presentation: Presentation) => void;
  presentationToEdit?: Presentation | null;
  courses: Course[];
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  presentationToEdit,
  courses,
}) => {
  const [formData, setFormData] = useState<Partial<Presentation>>({
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.nama || '',
    topik: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam: '08:00',
    ruangan: '',
    anggotaKelompok: '',
    status: 'To-Do',
    catatanPersiapan: '',
    slideUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (presentationToEdit) {
      setFormData(presentationToEdit);
    } else if (courses.length > 0) {
      setFormData({
        courseId: courses[0].id,
        courseName: courses[0].nama,
        topik: '',
        tanggal: new Date().toISOString().split('T')[0],
        jam: '08:00',
        ruangan: courses[0].ruangan,
        anggotaKelompok: '',
        status: 'To-Do',
        catatanPersiapan: '',
        slideUrl: '',
      });
    }
    setErrors({});
  }, [presentationToEdit, courses, isOpen]);

  if (!isOpen) return null;

  const handleCourseChange = (cId: string) => {
    const selected = courses.find((c) => c.id === cId);
    setFormData({
      ...formData,
      courseId: cId,
      courseName: selected ? selected.nama : '',
      ruangan: selected ? selected.ruangan : formData.ruangan,
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.topik?.trim()) errs.topik = 'Topik presentasi wajib diisi';
    if (!formData.tanggal) errs.tanggal = 'Tanggal presentasi wajib ditentukan';
    if (!formData.jam) errs.jam = 'Jam presentasi wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedPres: Presentation = {
      id: presentationToEdit ? presentationToEdit.id : `pres-${Date.now()}`,
      courseId: formData.courseId || (courses[0]?.id || 'matkul-1'),
      courseName: formData.courseName || (courses[0]?.nama || 'Mata Kuliah'),
      topik: formData.topik!.trim(),
      tanggal: formData.tanggal!,
      jam: formData.jam!,
      ruangan: formData.ruangan?.trim() || 'Ruang Kelas',
      anggotaKelompok: formData.anggotaKelompok?.trim() || 'Mandiri',
      status: (formData.status as PresentationStatus) || 'To-Do',
      catatanPersiapan: formData.catatanPersiapan?.trim() || '',
      slideUrl: formData.slideUrl?.trim() || '',
    };

    onSave(savedPres);
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
            <PresIcon className="w-5 h-5 text-emerald-300" />
            <h2 className="font-heading font-semibold text-base">
              {presentationToEdit ? 'Edit Presentasi' : 'Jadwalkan Presentasi'}
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
          {/* Terhubung dengan Mata Kuliah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mata Kuliah Terkait *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white text-xs"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.kode} - {c.nama} ({c.hari})
                </option>
              ))}
            </select>
          </div>

          {/* Topik / Judul Presentasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topik / Judul Materi Presentasi *
            </label>
            <input
              type="text"
              placeholder="Contoh: Analisis Kebutuhan Sistem & UI Prototype"
              value={formData.topik}
              onChange={(e) => setFormData({ ...formData, topik: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs ${
                errors.topik ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.topik && <p className="text-[11px] text-red-600 mt-1">{errors.topik}</p>}
          </div>

          {/* Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Presentasi *
              </label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-xs"
              />
              {errors.tanggal && <p className="text-[11px] text-red-600 mt-1">{errors.tanggal}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jam Presentasi *
              </label>
              <input
                type="time"
                value={formData.jam}
                onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* Ruangan & Anggota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ruangan
              </label>
              <input
                type="text"
                placeholder="Contoh: Gedung BJ Habibie R.302"
                value={formData.ruangan}
                onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anggota Tim / Kelompok
              </label>
              <input
                type="text"
                placeholder="Contoh: Mandiri atau Nama Teman 1, 2"
                value={formData.anggotaKelompok}
                onChange={(e) => setFormData({ ...formData, anggotaKelompok: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Status Presentasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Progres Presentasi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['To-Do', 'Preparation', 'Done'] as PresentationStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    formData.status === status
                      ? status === 'Done'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : status === 'Preparation'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {status === 'To-Do' ? 'To-Do (Belum)' : status === 'Preparation' ? 'Preparation' : 'Done (Selesai)'}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan Persiapan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Persiapan & Pembagian Tugas
            </label>
            <textarea
              rows={2}
              placeholder="Misal: 'Slide deck sudah 80%, tinggal siapkan demo coding dan Q&A'."
              value={formData.catatanPersiapan}
              onChange={(e) => setFormData({ ...formData, catatanPersiapan: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs"
            />
          </div>

          {/* Link Slide / Drive */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tautan Slide / Google Slides (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://docs.google.com/presentation/..."
              value={formData.slideUrl}
              onChange={(e) => setFormData({ ...formData, slideUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs"
            />
          </div>

          {/* Actions */}
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
              {presentationToEdit ? 'Simpan Perubahan' : 'Jadwalkan Presentasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
