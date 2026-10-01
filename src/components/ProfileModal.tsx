import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/academic';
import { User, GraduationCap, Mail, Hash, BookOpen, Calendar, Check, LogOut, LogIn, X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { id: 'emerald_student', bg: 'bg-[#064E3B]', label: 'Hijau Kampus' },
  { id: 'amber_student', bg: 'bg-[#B45309]', label: 'Kuning Akademik' },
  { id: 'teal_student', bg: 'bg-[#0F766E]', label: 'Teal Ilmiah' },
  { id: 'indigo_student', bg: 'bg-[#4338CA]', label: 'Biru Intelektual' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      isLoggedIn: true,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    onSaveProfile({
      ...formData,
      isLoggedIn: false,
    });
    setIsEditing(false);
  };

  const handleLogin = () => {
    onSaveProfile({
      ...formData,
      isLoggedIn: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Android Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white mt-1 sm:mt-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-base">Profil Mahasiswa</h2>
              <p className="text-[11px] text-emerald-200/80">Plan Mahasiswa Ilha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isEditing ? (
          /* Profile Card View */
          <div className="p-6 space-y-5 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-heading font-bold text-xl shadow-xs border-2 border-emerald-200">
                {formData.nama ? formData.nama.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-lg leading-tight">
                  {formData.nama || 'Mahasiswa Ilha'}
                </h3>
                <p className="text-xs font-mono text-emerald-800 font-semibold mt-0.5">
                  NIM: {formData.nim || '230201110088'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-900 font-medium mt-1">
                  <span>Mahasiswa Aktif</span>
                  <span>·</span>
                  <span>Semester {formData.semester}</span>
                </div>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  Program Studi
                </span>
                <span className="font-semibold text-slate-800">{formData.programStudi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  Fakultas
                </span>
                <span className="font-semibold text-slate-800">{formData.fakultas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  Tahun Angkatan
                </span>
                <span className="font-mono font-semibold text-slate-800">{formData.tahunAngkatan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  Email
                </span>
                <span className="font-mono text-slate-700 truncate max-w-[180px]">{formData.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
              {formData.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Masuk</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Ubah / Buat Profil Baru
              </button>
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Mahasiswa *
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Ahmad Muhsin Syah"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Induk (NIM) *
                </label>
                <input
                  type="text"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  placeholder="230201110088"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Semester Berjalan
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Program Studi
              </label>
              <input
                type="text"
                value={formData.programStudi}
                onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                placeholder="Ilmu Hadis (ILHA)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fakultas
                </label>
                <input
                  type="text"
                  value={formData.fakultas}
                  onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                  placeholder="Ushuluddin dan Filsafat"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tahun Angkatan
                </label>
                <input
                  type="text"
                  value={formData.tahunAngkatan}
                  onChange={(e) => setFormData({ ...formData, tahunAngkatan: e.target.value })}
                  placeholder="2023"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@mahasiswa.uin-malang.ac.id"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Simpan Profil Mahasiswa
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
