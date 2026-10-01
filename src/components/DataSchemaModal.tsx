import React, { useState } from 'react';
import { Database, Copy, Check, Code, Layers, Server, Shield, Sparkles } from 'lucide-react';

interface DataSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSchemaModal: React.FC<DataSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchema = `-- ========================================================
-- SKEMA DATABASE RELASIONAL (PostgreSQL / Cloud SQL)
-- MahasiswaPlan: Sistem Manajemen Perkuliahan Pribadi
-- ========================================================

-- 1. TABEL MATA KULIAH (COURSES)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(20) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    hari VARCHAR(15) NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(100) NOT NULL,
    dosen VARCHAR(150) NOT NULL,
    sks INT NOT NULL DEFAULT 3 CHECK (sks BETWEEN 1 AND 6),
    warna_tema VARCHAR(20) DEFAULT '#047857',
    
    -- Indikator Performa & Self-Assessment
    target_nilai VARCHAR(5) DEFAULT 'A' CHECK (target_nilai IN ('A', 'B+', 'B', 'C+', 'C', 'D')),
    total_pertemuan INT DEFAULT 16,
    jumlah_hadir INT DEFAULT 16,
    rating_keaktifan INT DEFAULT 5 CHECK (rating_keaktifan BETWEEN 1 AND 5),
    catatan_evaluasi TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL CATATAN PRIBADI PER PERTEMUAN (COURSE_NOTES)
CREATE TABLE course_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    pertemuan_ke INT NOT NULL CHECK (pertemuan_ke BETWEEN 1 AND 16),
    judul VARCHAR(200) NOT NULL,
    isi TEXT NOT NULL,
    poin_penting TEXT[] DEFAULT '{}',
    tanggal DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL TUGAS KULIAH (COURSE_TASKS)
CREATE TABLE course_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    selesai BOOLEAN DEFAULT FALSE,
    prioritas VARCHAR(15) DEFAULT 'Sedang' CHECK (prioritas IN ('Rendah', 'Sedang', 'Tinggi')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL TRACKER JADWAL PRESENTASI (PRESENTATIONS)
CREATE TABLE presentations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    topik VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    ruangan VARCHAR(100) NOT NULL,
    anggota_kelompok TEXT,
    status VARCHAR(20) DEFAULT 'To-Do' CHECK (status IN ('To-Do', 'Preparation', 'Done')),
    catatan_persiapan TEXT,
    slide_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL PREFERENSI NOTIFIKASI & ALARM (USER_REMINDER_SETTINGS)
CREATE TABLE user_reminder_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    durasi_sebelum_kelas INT DEFAULT 15 CHECK (durasi_sebelum_kelas IN (15, 30, 60)),
    bunyikan_alarm BOOLEAN DEFAULT TRUE,
    notifikasi_desktop BOOLEAN DEFAULT TRUE,
    pengingat_h1_presentasi BOOLEAN DEFAULT TRUE,
    pengingat_hari_h_presentasi BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const jsonSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MahasiswaPlanSchema",
  "type": "object",
  "properties": {
    "courses": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "kode", "nama", "hari", "jamMulai", "jamSelesai", "ruangan", "dosen", "sks"],
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "kode": { "type": "string", "example": "TI3101" },
          "nama": { "type": "string", "example": "Rekayasa Perangkat Lunak" },
          "hari": { "type": "string", "enum": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] },
          "jamMulai": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "jamSelesai": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "ruangan": { "type": "string" },
          "dosen": { "type": "string" },
          "sks": { "type": "integer", "minimum": 1, "maximum": 6 },
          "targetNilai": { "type": "string", "enum": ["A", "B+", "B", "C+", "C", "D"] },
          "totalPertemuan": { "type": "integer", "default": 16 },
          "jumlahHadir": { "type": "integer", "minimum": 0 },
          "ratingKeaktifan": { "type": "integer", "minimum": 1, "maximum": 5 },
          "catatanEvaluasi": { "type": "string" },
          "catatanList": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "pertemuanKe": { "type": "integer" },
                "judul": { "type": "string" },
                "isi": { "type": "string" },
                "tanggal": { "type": "string", "format": "date" },
                "poinPenting": { "type": "array", "items": { "type": "string" } }
              }
            }
          },
          "tugasList": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "judul": { "type": "string" },
                "deadline": { "type": "string", "format": "date" },
                "selesai": { "type": "boolean" },
                "prioritas": { "type": "string", "enum": ["Rendah", "Sedang", "Tinggi"] }
              }
            }
          }
        }
      }
    },
    "presentations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "courseId", "topik", "tanggal", "jam", "status"],
        "properties": {
          "id": { "type": "string" },
          "courseId": { "type": "string" },
          "courseName": { "type": "string" },
          "topik": { "type": "string" },
          "tanggal": { "type": "string", "format": "date" },
          "jam": { "type": "string" },
          "ruangan": { "type": "string" },
          "anggotaKelompok": { "type": "string" },
          "status": { "type": "string", "enum": ["To-Do", "Preparation", "Done"] },
          "catatanPersiapan": { "type": "string" },
          "slideUrl": { "type": "string" }
        }
      }
    },
    "reminderSettings": {
      "type": "object",
      "properties": {
        "durasiSebelumKelas": { "type": "integer", "enum": [15, 30, 60] },
        "bunyikanAlarm": { "type": "boolean" },
        "notifikasiDesktop": { "type": "boolean" },
        "pengingatHMin1Presentasi": { "type": "boolean" },
        "pengingatHariHPresentasi": { "type": "boolean" }
      }
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Android Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white mt-1 sm:mt-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800 text-emerald-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-base text-white">
                Skema Database & Stack
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                PostgreSQL DDL & JSON Document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Tech Stack Recommendation Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="font-heading font-semibold text-slate-900 text-base flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-emerald-700" />
              Rekomendasi Tech Stack Produksi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-md border border-slate-200">
                <span className="font-semibold text-emerald-900 block mb-1">Frontend Layer</span>
                <p className="text-slate-600 leading-relaxed">
                  React 19 + TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Web Audio API untuk procedural chime, Web Notifications API.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-md border border-slate-200">
                <span className="font-semibold text-emerald-900 block mb-1">Backend & API Layer</span>
                <p className="text-slate-600 leading-relaxed">
                  Node.js / Express (atau Next.js App Router) dengan Drizzle ORM / Prisma, validasi Zod, dan Web Push service worker.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-md border border-slate-200">
                <span className="font-semibold text-emerald-900 block mb-1">Database & Storage</span>
                <p className="text-slate-600 leading-relaxed">
                  PostgreSQL (Cloud SQL / Supabase) untuk relasi jadwal & presensi, atau Firestore NoSQL dengan offline persistence.
                </p>
              </div>
            </div>
          </div>

          {/* SQL Relational Schema */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-semibold text-slate-800 flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-700" />
                1. Skema Database Relasional (PostgreSQL DDL)
              </span>
              <button
                onClick={() => copyToClipboard(sqlSchema, 'sql')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              >
                {copiedSection === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-72">
              <code>{sqlSchema}</code>
            </pre>
          </div>

          {/* JSON Document Schema */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                2. Skema Dokumen NoSQL / JSON Schema
              </span>
              <button
                onClick={() => copyToClipboard(jsonSchema, 'json')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              >
                {copiedSection === 'json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-60">
              <code>{jsonSchema}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
