import React, { useState } from 'react';
import { Course, TargetGrade } from '../types/academic';
import { 
  BarChart3, 
  Award, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Edit2, 
  Save, 
  HelpCircle 
} from 'lucide-react';

interface PerformanceViewProps {
  courses: Course[];
  onUpdateCourse: (updated: Course) => void;
  onSelectCourse: (course: Course) => void;
}

const GRADE_POINTS: Record<TargetGrade, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D': 1.0,
};

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  courses,
  onUpdateCourse,
  onSelectCourse,
}) => {
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editEvaluation, setEditEvaluation] = useState('');

  // Calculations
  const totalSks = courses.reduce((acc, c) => acc + c.sks, 0);
  
  const totalWeightedPoints = courses.reduce((acc, c) => {
    const point = GRADE_POINTS[c.targetNilai] || 4.0;
    return acc + point * c.sks;
  }, 0);

  const predictedGPA = totalSks > 0 ? (totalWeightedPoints / totalSks).toFixed(2) : '0.00';

  const averageAttendance =
    courses.length > 0
      ? Math.round(
          courses.reduce((acc, c) => acc + (c.jumlahHadir / (c.totalPertemuan || 16)) * 100, 0) /
            courses.length
        )
      : 100;

  const averageActivity =
    courses.length > 0
      ? (courses.reduce((acc, c) => acc + (c.ratingKeaktifan || 0), 0) / courses.length).toFixed(1)
      : '0.0';

  const atRiskCourses = courses.filter(
    (c) => Math.round((c.jumlahHadir / (c.totalPertemuan || 16)) * 100) < 75
  );

  const handleStartEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setEditEvaluation(course.catatanEvaluasi || '');
  };

  const handleSaveEdit = (course: Course) => {
    onUpdateCourse({
      ...course,
      catatanEvaluasi: editEvaluation,
    });
    setEditingCourseId(null);
  };

  const handleQuickGradeChange = (course: Course, grade: TargetGrade) => {
    onUpdateCourse({
      ...course,
      targetNilai: grade,
    });
  };

  const handleQuickRatingChange = (course: Course, star: number) => {
    onUpdateCourse({
      ...course,
      ratingKeaktifan: star,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
          Performa Akademik & Presensi
        </h2>
        <p className="text-[11px] text-slate-500">
          Target nilai, kelayakan ujian & indeks keaktifan kelas
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Prediksi IPK */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Prediksi IPK Semester</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-[#064E3B] font-mono tabular-nums">
            {predictedGPA}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Beban: <strong className="font-mono">{totalSks} SKS</strong> total
          </p>
        </div>

        {/* Rata-Rata Kehadiran */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Rata-rata Presensi</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className={`text-2xl sm:text-3xl font-heading font-bold font-mono tabular-nums ${
            averageAttendance < 75 ? 'text-amber-700' : 'text-[#064E3B]'
          }`}>
            {averageAttendance}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ambang batas aman ujian: <span className="font-mono">75%</span>
          </p>
        </div>

        {/* Rata-rata Keaktifan */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Indeks Keaktifan</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 font-mono tabular-nums">
            {averageActivity} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Partisipasi diskusi kelas
          </p>
        </div>

        {/* Status Kelayakan Ujian */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Kelayakan Ujian</span>
            <AlertTriangle className={`w-4 h-4 ${atRiskCourses.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-heading font-bold font-mono ${
            atRiskCourses.length > 0 ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            {atRiskCourses.length > 0 ? `${atRiskCourses.length} Matkul` : 'Aman (100%)'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {atRiskCourses.length > 0 ? 'Perlu konfirmasi presensi' : 'Semua matkul memenuhi syarat'}
          </p>
        </div>
      </div>

      {/* Alert banner if any course is at risk */}
      {atRiskCourses.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <strong className="font-semibold block mb-0.5">Peringatan Presensi Perkuliahan!</strong>
            Terdapat {atRiskCourses.length} mata kuliah dengan kehadiran di bawah 75% ({atRiskCourses.map(c => c.nama).join(', ')}). Sesuai aturan akademik kampus, kehadiran kurang dari 75% berisiko tidak diperkenankan mengikuti Ujian Akhir Semester (UAS).
          </div>
        </div>
      )}

      {/* Course Performance Breakdown Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-heading font-semibold text-slate-900 text-base">
              Matriks Evaluasi Mandiri Per Mata Kuliah
            </h3>
            <p className="text-xs text-slate-500">
              Ubah target nilai atau rating keaktifan secara langsung untuk memperbarui simulasi IPK.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.map((course) => {
            const attendancePct = Math.round((course.jumlahHadir / (course.totalPertemuan || 16)) * 100);
            const isAtRisk = attendancePct < 75;

            return (
              <div key={course.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Info Course */}
                  <div className="lg:w-1/3 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="font-semibold text-emerald-800">{course.kode}</span>
                      <span>·</span>
                      <span>{course.sks} SKS</span>
                      <span>·</span>
                      <span>{course.hari}</span>
                    </div>
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="font-heading font-semibold text-slate-900 text-base hover:text-emerald-800 text-left transition-colors cursor-pointer"
                    >
                      {course.nama}
                    </button>
                    <p className="text-xs text-slate-500">Dosen: {course.dosen}</p>
                  </div>

                  {/* Metrics Controls (Target Grade, Attendance, Rating) */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Target Grade Selector */}
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Nilai:
                      </span>
                      <div className="flex items-center gap-1">
                        {(['A', 'B+', 'B', 'C+', 'C'] as TargetGrade[]).map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => handleQuickGradeChange(course, grade)}
                            className={`px-2 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                              course.targetNilai === grade
                                ? 'bg-emerald-800 text-white border-emerald-800'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Attendance Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                        <span className="text-slate-600">Presensi:</span>
                        <span className={`font-mono ${isAtRisk ? 'text-amber-700' : 'text-emerald-800'}`}>
                          {attendancePct}% ({course.jumlahHadir}/{course.totalPertemuan})
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isAtRisk ? 'bg-amber-500' : 'bg-emerald-600'}`}
                          style={{ width: `${attendancePct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {isAtRisk ? '⚠️ Di bawah batas 75%' : '✓ Memenuhi syarat ujian'}
                      </span>
                    </div>

                    {/* Keaktifan Star Rating */}
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Keaktifan Diskusi:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleQuickRatingChange(course, star)}
                            className="cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= (course.ratingKeaktifan || 0)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono font-medium text-slate-600 ml-1">
                          {course.ratingKeaktifan}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Self-Assessment Note / Evaluasi Diri */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {editingCourseId === course.id ? (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Edit Catatan Refleksi & Evaluasi Diri:
                      </label>
                      <textarea
                        rows={2}
                        value={editEvaluation}
                        onChange={(e) => setEditEvaluation(e.target.value)}
                        placeholder="Tuliskan kendala materi, persiapan sebelum UTS/UAS, atau evaluasi mingguan..."
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCourseId(null)}
                          className="px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(course)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Evaluasi</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                      <div>
                        <strong className="text-slate-700">Refleksi Evaluasi Diri:</strong>{' '}
                        <span className="text-slate-600">
                          {course.catatanEvaluasi || 'Belum ada catatan evaluasi diri untuk mata kuliah ini.'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleStartEdit(course)}
                        className="text-slate-400 hover:text-emerald-800 p-1 shrink-0 cursor-pointer"
                        title="Edit catatan evaluasi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
