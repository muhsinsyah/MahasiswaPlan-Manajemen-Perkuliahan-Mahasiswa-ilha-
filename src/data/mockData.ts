import { Course, Presentation, ReminderConfig } from '../types/academic';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'matkul-1',
    kode: 'TI3101',
    nama: 'Rekayasa Perangkat Lunak',
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '10:00',
    ruangan: 'Gedung B.J. Habibie Lt. 3 (R.302)',
    dosen: 'Dr. Muhammad Faisal, M.T.',
    sks: 3,
    warnaTema: '#047857', // Emerald green
    targetNilai: 'A',
    totalPertemuan: 16,
    jumlahHadir: 14,
    ratingKeaktifan: 5,
    catatanEvaluasi: 'Paham konsep Scrum & Agile, perlu melatih pemodelan use case sequence diagram yang lebih detail.',
    catatanList: [
      {
        id: 'note-1',
        pertemuanKe: 3,
        judul: 'Arsitektur Microservices & Clean Architecture',
        isi: 'Perbedaan mendasar monolithic vs microservices. Pemisahan domain logic, data access layer, dan presentation layer untuk skalabilitas tinggi.',
        tanggal: '2026-09-15',
        poinPenting: [
          'Dependency Inversion Principle (DIP)',
          'Domain-Driven Design bounded context',
          'API Gateway sebagai single entry point'
        ]
      },
      {
        id: 'note-2',
        pertemuanKe: 5,
        judul: 'Metodologi Agile & User Story Mapping',
        isi: 'Penyusunan backlog sprint 1. Estimasi story points menggunakan Fibonacci series dan planning poker.',
        tanggal: '2026-09-29',
        poinPenting: [
          'Definisi DoD (Definition of Done)',
          'Daily Standup efektif maksimal 15 menit'
        ]
      }
    ],
    tugasList: [
      {
        id: 'task-1',
        judul: 'Menyusun SRS (Software Requirements Specification) Kelompok',
        deadline: '2026-10-12',
        selesai: false,
        prioritas: 'Tinggi'
      },
      {
        id: 'task-2',
        judul: 'Diagram Class & ERD Database Relasional',
        deadline: '2026-10-05',
        selesai: true,
        prioritas: 'Sedang'
      }
    ]
  },
  {
    id: 'matkul-2',
    kode: 'TI3102',
    nama: 'Struktur Data & Algoritma Lanjut',
    hari: 'Selasa',
    jamMulai: '09:30',
    jamSelesai: '12:00',
    ruangan: 'Lab Riset Komputasi C (FST)',
    dosen: 'Hani Nurhayati, M.Kom.',
    sks: 3,
    warnaTema: '#065F46', // Deep emerald
    targetNilai: 'A',
    totalPertemuan: 16,
    jumlahHadir: 15,
    ratingKeaktifan: 4,
    catatanEvaluasi: 'Topik Binary Search Tree dan Graph traversal sudah dikuasai, perlu latihan algoritma Dijkstra & Bellman-Ford.',
    catatanList: [
      {
        id: 'note-3',
        pertemuanKe: 4,
        judul: 'Penyeimbangan Pohon AVL & Red-Black Tree',
        isi: 'Operasi rotasi kiri dan kanan untuk memastikan tinggi pohon tetap O(log n). Menghindari degradasi performa menjadi O(n).',
        tanggal: '2026-09-22',
        poinPenting: [
          'Balance Factor = height(left) - height(right)',
          '4 Kasus Rotasi: LL, RR, LR, RL'
        ]
      }
    ],
    tugasList: [
      {
        id: 'task-3',
        judul: 'Implementasi Algoritma Kruskal & Prim untuk Minimum Spanning Tree',
        deadline: '2026-10-08',
        selesai: false,
        prioritas: 'Tinggi'
      }
    ]
  },
  {
    id: 'matkul-3',
    kode: 'UNI2103',
    nama: 'Studi Al-Qur\'an dan Hadis Tematik',
    hari: 'Rabu',
    jamMulai: '08:00',
    jamSelesai: '09:40',
    ruangan: 'Gedung Megawati Soekarnoputri (R.204)',
    dosen: 'Prof. Dr. H. M. Zainuddin, M.A.',
    sks: 2,
    warnaTema: '#047857',
    targetNilai: 'A',
    totalPertemuan: 16,
    jumlahHadir: 16,
    ratingKeaktifan: 5,
    catatanEvaluasi: 'Sangat menarik menghubungkan etika komputasi dan teknologi kecerdasan buatan dengan prinsip maqashid syariah.',
    catatanList: [
      {
        id: 'note-4',
        pertemuanKe: 2,
        judul: 'Integrasi Sains dan Nilai-nilai Keislaman (Ulul Albab)',
        isi: 'Konsep integrasi keilmuan UIN Malang: sains modern berpijak pada fondasi spiritual dan kemaslahatan umat manusia.',
        tanggal: '2026-09-09',
        poinPenting: [
          'Empat pilar Ulul Albab: Kedalaman spiritual, keagungan akhlak, keluasan ilmu, kematangan profesional'
        ]
      }
    ],
    tugasList: [
      {
        id: 'task-4',
        judul: 'Review Makalah: Etika AI dalam Pandangan Hermeneutika Kontemporer',
        deadline: '2026-10-15',
        selesai: false,
        prioritas: 'Sedang'
      }
    ]
  },
  {
    id: 'matkul-4',
    kode: 'TI3104',
    nama: 'Pemrograman Web Lanjut (Full-Stack)',
    hari: 'Kamis',
    jamMulai: '13:00',
    jamSelesai: '15:30',
    ruangan: 'Lab Rekayasa Perangkat Lunak 2',
    dosen: 'Ahmad Syahrul Romadhon, M.T.',
    sks: 3,
    warnaTema: '#0F766E', // Teal emerald
    targetNilai: 'A',
    totalPertemuan: 16,
    jumlahHadir: 13,
    ratingKeaktifan: 4,
    catatanEvaluasi: 'Materi state management dan server-side caching lancar. Perlu memperdalam implementasi WebSocket dan JWT refresh token rotation.',
    catatanList: [
      {
        id: 'note-5',
        pertemuanKe: 6,
        judul: 'Optimasi Frontend & Server-Side Rendering',
        isi: 'Perbedaan CSR, SSR, dan Static Site Generation. Penggunaan memoization dan lazy loading untuk menurunkan Largest Contentful Paint (LCP).',
        tanggal: '2026-10-01',
        poinPenting: [
          'Core Web Vitals metrics: LCP < 2.5s, CLS < 0.1',
          'Route prefetching dan code splitting'
        ]
      }
    ],
    tugasList: [
      {
        id: 'task-5',
        judul: 'Deploy Aplikasi Mini Project ke Cloud Platform',
        deadline: '2026-10-20',
        selesai: false,
        prioritas: 'Tinggi'
      }
    ]
  },
  {
    id: 'matkul-5',
    kode: 'TI3105',
    nama: 'Jaringan Komputer & Keamanan Siber',
    hari: 'Jumat',
    jamMulai: '07:30',
    jamSelesai: '10:00',
    ruangan: 'Ruang Teater FST Lt. 1',
    dosen: 'Rina Astuti Rahayu, Ph.D.',
    sks: 3,
    warnaTema: '#115E59',
    targetNilai: 'B+',
    totalPertemuan: 16,
    jumlahHadir: 13,
    ratingKeaktifan: 3,
    catatanEvaluasi: 'Materi subnetting VLSM dan CIDR sudah aman. Perlu belajar ekstra mengenai konfigurasi Firewall iptables dan kriptografi kunci publik (RSA/ECC).',
    catatanList: [
      {
        id: 'note-6',
        pertemuanKe: 3,
        judul: 'TCP Handshake, TLS 1.3, dan Enkripsi End-to-End',
        isi: 'Proses pertukaran kunci Diffie-Hellman dan sertifikat digital X.509. Mencegah serangan Man-in-the-Middle (MitM).',
        tanggal: '2026-09-18',
        poinPenting: [
          'TCP SYN -> SYN-ACK -> ACK',
          'Perfect Forward Secrecy (PFS)'
        ]
      }
    ],
    tugasList: [
      {
        id: 'task-6',
        judul: 'Simulasi Packet Tracer: Routing OSPF Multi-Area',
        deadline: '2026-10-09',
        selesai: true,
        prioritas: 'Sedang'
      }
    ]
  }
];

export const INITIAL_PRESENTATIONS: Presentation[] = [
  {
    id: 'pres-1',
    courseId: 'matkul-1',
    courseName: 'Rekayasa Perangkat Lunak',
    topik: 'Analisis Kebutuhan Sistem & Prototipe Desain UI/UX MahasiswaPlan',
    tanggal: '2026-10-02', // H-1 relative to current date (Oct 1)
    jam: '08:00',
    ruangan: 'Gedung B.J. Habibie R.302',
    anggotaKelompok: 'Ahmad Muhsin, Rizky Pratama, Siti Nurhaliza',
    status: 'Preparation',
    catatanPersiapan: 'Slide deck sudah 85%. Kurang demo klik prototype Figma dan pembagian giliran bicara 5 menit per orang.',
    slideUrl: 'https://docs.google.com/presentation/demo-rpl'
  },
  {
    id: 'pres-2',
    courseId: 'matkul-3',
    courseName: 'Studi Al-Qur\'an dan Hadis Tematik',
    topik: 'Etika Privasi Data Digital dalam Tinjauan Maqashid As-Syari\'ah',
    tanggal: '2026-10-01', // Hari-H!
    jam: '08:15',
    ruangan: 'Gedung Megawati R.204',
    anggotaKelompok: 'Mandiri (Presentasi Individu)',
    status: 'Done',
    catatanPersiapan: 'Kutipan ayat Surat Al-Hujurat ayat 12 tentang larangan mencari-cari kesalahan (tajassus) di era digital surveillance.',
    slideUrl: 'https://docs.google.com/presentation/demo-hadis'
  },
  {
    id: 'pres-3',
    courseId: 'matkul-2',
    courseName: 'Struktur Data & Algoritma Lanjut',
    topik: 'Komparasi Kinerja Algoritma Djikstra vs A* Search pada Graf Skala Besar',
    tanggal: '2026-10-13',
    jam: '09:45',
    ruangan: 'Lab Riset Komputasi C',
    anggotaKelompok: 'Ahmad Muhsin, Farhan Fadillah',
    status: 'To-Do',
    catatanPersiapan: 'Perlu membuat visualisasi grafik benchmark waktu komputasi Python dan C++ untuk datasets 100k nodes.',
    slideUrl: ''
  }
];

export const INITIAL_REMINDER_CONFIG: ReminderConfig = {
  durasiSebelumKelas: 15,
  bunyikanAlarm: true,
  notifikasiDesktop: false,
  pengingatHMin1Presentasi: true,
  pengingatHariHPresentasi: true
};
