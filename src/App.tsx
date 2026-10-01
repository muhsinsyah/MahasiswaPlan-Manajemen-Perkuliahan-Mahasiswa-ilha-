/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Course, 
  Presentation, 
  ReminderConfig, 
  SystemNotification, 
  DayOfWeek,
  PresentationStatus,
  UserProfile
} from './types/academic';
import { 
  loadCourses, 
  saveCourses, 
  loadPresentations, 
  savePresentations, 
  loadReminderConfig, 
  saveReminderConfig,
  loadUserProfile,
  saveUserProfile,
  resetAllDataToDefault
} from './utils/storage';
import { playChimeSound } from './utils/audioChime';
import { exportCoursesToCSV } from './utils/csvExport';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { DashboardOverview } from './components/DashboardOverview';
import { ScheduleView } from './components/ScheduleView';
import { PresentationView } from './components/PresentationView';
import { PerformanceView } from './components/PerformanceView';
import { CourseModal } from './components/CourseModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { PresentationModal } from './components/PresentationModal';
import { ComprehensiveSettingsModal } from './components/ComprehensiveSettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { DataSchemaModal } from './components/DataSchemaModal';
import { Bell, X } from 'lucide-react';
import { INITIAL_COURSES, INITIAL_PRESENTATIONS, INITIAL_REMINDER_CONFIG } from './data/mockData';

export default function App() {
  // Main Data States
  const [courses, setCourses] = useState<Course[]>(() => loadCourses());
  const [presentations, setPresentations] = useState<Presentation[]>(() => loadPresentations());
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() => loadReminderConfig());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jadwal' | 'presentasi' | 'evaluasi'>('dashboard');

  // Android Viewport Mode (Phone Mockup vs Full Fluid Width)
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  // Modals & Drawers States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);
  const [presentationToEdit, setPresentationToEdit] = useState<Presentation | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Notifications & Active Alerts
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-init-1',
      tipe: 'presentasi_hari_h',
      judul: 'Presentasi Hari Ini (H-0)',
      pesan: 'Jadwal presentasi "Etika Privasi Data Digital" di Gedung Megawati R.204 pukul 08:15 WIB.',
      timestamp: '07:00 WIB',
      sudahDibaca: false,
    },
    {
      id: 'notif-init-2',
      tipe: 'presentasi_h1',
      judul: 'Pengingat H-1: Presentasi RPL Besok',
      pesan: 'Presentasi "Analisis Kebutuhan Sistem MahasiswaPlan" dijadwalkan besok 08:00 WIB di R.302.',
      timestamp: 'Kemarin',
      sudahDibaca: false,
    },
    {
      id: 'notif-init-3',
      tipe: 'kelas',
      judul: 'Kelas Hari Ini: Pemrograman Web Lanjut',
      pesan: 'Kelas dimulai pukul 13:00 WIB di Lab Rekayasa Perangkat Lunak 2.',
      timestamp: '06:30 WIB',
      sudahDibaca: true,
    }
  ]);

  const [floatingAlert, setFloatingAlert] = useState<SystemNotification | null>(null);

  // Time & Day state
  const [currentDay, setCurrentDay] = useState<DayOfWeek>('Kamis');
  const [currentTimeString, setCurrentTimeString] = useState<string>('14:18 WIB');

  // Save changes to localStorage
  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    savePresentations(presentations);
  }, [presentations]);

  useEffect(() => {
    saveReminderConfig(reminderConfig);
  }, [reminderConfig]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Live Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeString(`${hours}:${minutes} WIB`);

      const dayNames: DayOfWeek[] = ['Senin', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayIndex = now.getDay();
      const indonesianDay = dayIndex === 0 ? 'Senin' : dayNames[dayIndex];
      setCurrentDay(indonesianDay);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Handlers for Courses
  const handleSaveCourse = (savedCourse: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === savedCourse.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCourse.id ? savedCourse : c));
      }
      return [savedCourse, ...prev];
    });

    if (selectedCourseDetail?.id === savedCourse.id) {
      setSelectedCourseDetail(savedCourse);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (selectedCourseDetail?.id === courseId) {
      setSelectedCourseDetail(null);
    }
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    setSelectedCourseDetail(updatedCourse);
  };

  // CRUD Handlers for Presentations
  const handleSavePresentation = (savedPres: Presentation) => {
    setPresentations((prev) => {
      const exists = prev.some((p) => p.id === savedPres.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPres.id ? savedPres : p));
      }
      return [savedPres, ...prev];
    });
  };

  const handleDeletePresentation = (presentationId: string) => {
    setPresentations((prev) => prev.filter((p) => p.id !== presentationId));
  };

  const handleUpdatePresentationStatus = (presentationId: string, newStatus: PresentationStatus) => {
    setPresentations((prev) =>
      prev.map((p) => (p.id === presentationId ? { ...p, status: newStatus } : p))
    );
  };

  // CSV Export Trigger
  const handleExportScheduleCSV = () => {
    exportCoursesToCSV(courses, userProfile.nama, userProfile.nim);
  };

  // Reset & Import Handlers
  const handleResetAllData = () => {
    resetAllDataToDefault();
    setCourses(INITIAL_COURSES);
    setPresentations(INITIAL_PRESENTATIONS);
    setReminderConfig(INITIAL_REMINDER_CONFIG);
  };

  const handleImportData = (imported: {
    courses?: Course[];
    presentations?: Presentation[];
    reminderConfig?: ReminderConfig;
  }) => {
    if (imported.courses && Array.isArray(imported.courses)) {
      setCourses(imported.courses);
    }
    if (imported.presentations && Array.isArray(imported.presentations)) {
      setPresentations(imported.presentations);
    }
    if (imported.reminderConfig) {
      setReminderConfig(imported.reminderConfig);
    }
  };

  // Trigger Demo Alarm & Real-time Notification
  const handleTriggerDemoAlarm = () => {
    if (reminderConfig.bunyikanAlarm) {
      playChimeSound(reminderConfig.jenisNada || 'gentle_chime', reminderConfig.volumeAlarm ?? 0.8);
    }

    const demoNotif: SystemNotification = {
      id: `alert-${Date.now()}`,
      tipe: 'kelas',
      judul: `Pengingat Kelas (${reminderConfig.durasiSebelumKelas} Menit Lagi)`,
      pesan: `Kuliah "Pemrograman Web Lanjut" akan dimulai pukul 13:00 WIB di Lab RPL 2. Siapkan modul praktikum Anda!`,
      timestamp: 'Baru saja',
      sudahDibaca: false,
    };

    setNotifications((prev) => [demoNotif, ...prev]);
    setFloatingAlert(demoNotif);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(demoNotif.judul, {
        body: demoNotif.pesan,
        icon: '/favicon.ico',
      });
    }

    setTimeout(() => {
      setFloatingAlert(null);
    }, 6000);
  };

  const unreadCount = notifications.filter((n) => !n.sudahDibaca).length;

  return (
    <AndroidPhoneFrame
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenAddCourse={() => {
        setCourseToEdit(null);
        setIsCourseModalOpen(true);
      }}
      onOpenSettings={() => setIsSettingsModalOpen(true)}
      onOpenProfile={() => setIsProfileModalOpen(true)}
      onExportCSV={handleExportScheduleCSV}
      onToggleNotificationDrawer={() => setIsNotificationDrawerOpen((prev) => !prev)}
      unreadNotificationsCount={unreadCount}
      alarmSoundEnabled={reminderConfig.bunyikanAlarm}
      onToggleAlarmSound={() => {
        const nextState = !reminderConfig.bunyikanAlarm;
        setReminderConfig({ ...reminderConfig, bunyikanAlarm: nextState });
        if (nextState) {
          playChimeSound(reminderConfig.jenisNada || 'gentle_chime', reminderConfig.volumeAlarm ?? 0.8);
        }
      }}
      currentTimeString={currentTimeString}
      userProfile={userProfile}
      isFrameMode={isFrameMode}
      onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
    >
      {/* 1. Dashboard View */}
      {activeTab === 'dashboard' && (
        <DashboardOverview
          courses={courses}
          presentations={presentations}
          onSelectCourse={(course) => setSelectedCourseDetail(course)}
          onOpenAddCourse={() => {
            setCourseToEdit(null);
            setIsCourseModalOpen(true);
          }}
          onOpenAddPresentation={() => {
            setPresentationToEdit(null);
            setIsPresentationModalOpen(true);
          }}
          onNavigateToTab={(tab) => {
            if (tab === 'skema') {
              setIsSchemaModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          currentDay={currentDay}
          currentTime={currentTimeString}
          reminderConfig={reminderConfig}
        />
      )}

      {/* 2. Jadwal Perkuliahan View */}
      {activeTab === 'jadwal' && (
        <ScheduleView
          courses={courses}
          onOpenAddCourse={() => {
            setCourseToEdit(null);
            setIsCourseModalOpen(true);
          }}
          onOpenEditCourse={(course) => {
            setCourseToEdit(course);
            setIsCourseModalOpen(true);
          }}
          onSelectCourse={(course) => setSelectedCourseDetail(course)}
          onDeleteCourse={handleDeleteCourse}
          onExportCSV={handleExportScheduleCSV}
        />
      )}

      {/* 3. Tracker Presentasi View */}
      {activeTab === 'presentasi' && (
        <PresentationView
          presentations={presentations}
          courses={courses}
          onOpenAddPresentation={() => {
            setPresentationToEdit(null);
            setIsPresentationModalOpen(true);
          }}
          onOpenEditPresentation={(pres) => {
            setPresentationToEdit(pres);
            setIsPresentationModalOpen(true);
          }}
          onDeletePresentation={handleDeletePresentation}
          onUpdatePresentationStatus={handleUpdatePresentationStatus}
        />
      )}

      {/* 4. Evaluasi & Performa View */}
      {activeTab === 'evaluasi' && (
        <PerformanceView
          courses={courses}
          onUpdateCourse={handleUpdateCourse}
          onSelectCourse={(course) => setSelectedCourseDetail(course)}
        />
      )}

      {/* Ephemeral Alert Toast */}
      {floatingAlert && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm bg-emerald-950 text-white p-3.5 rounded-xl shadow-2xl border border-emerald-700/50 flex items-start justify-between gap-3 animate-slide-up">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-emerald-800 text-emerald-200 rounded-lg shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <span className="font-heading font-semibold text-xs text-emerald-200 block">
                {floatingAlert.judul}
              </span>
              <p className="text-[11px] text-slate-100 leading-relaxed">
                {floatingAlert.pesan}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFloatingAlert(null)}
            className="text-emerald-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourseDetail}
        isOpen={!!selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
        onUpdateCourse={handleUpdateCourse}
        onEditCourseSchedule={(course) => {
          setSelectedCourseDetail(null);
          setCourseToEdit(course);
          setIsCourseModalOpen(true);
        }}
      />

      {/* Presentation Modal */}
      <PresentationModal
        isOpen={isPresentationModalOpen}
        onClose={() => {
          setIsPresentationModalOpen(false);
          setPresentationToEdit(null);
        }}
        onSave={handleSavePresentation}
        presentationToEdit={presentationToEdit}
        courses={courses}
      />

      {/* Comprehensive Settings Modal */}
      <ComprehensiveSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={reminderConfig}
        onSaveConfig={(newConfig) => setReminderConfig(newConfig)}
        courses={courses}
        presentations={presentations}
        userProfile={userProfile}
        onResetAllData={handleResetAllData}
        onImportData={handleImportData}
        onTriggerDemoAlarm={handleTriggerDemoAlarm}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={(updatedProfile) => setUserProfile(updatedProfile)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, sudahDibaca: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotification={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, sudahDibaca: true } : n))
          );
          if (notif.tipe.includes('presentasi')) {
            setActiveTab('presentasi');
          } else {
            setActiveTab('jadwal');
          }
          setIsNotificationDrawerOpen(false);
        }}
      />

      {/* Schema Modal */}
      <DataSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </AndroidPhoneFrame>
  );
}
