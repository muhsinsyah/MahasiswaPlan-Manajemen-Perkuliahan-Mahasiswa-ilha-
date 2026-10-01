import { Course, Presentation, ReminderConfig, UserProfile } from '../types/academic';
import { INITIAL_COURSES, INITIAL_PRESENTATIONS, INITIAL_REMINDER_CONFIG } from '../data/mockData';

const STORAGE_KEYS = {
  COURSES: 'mahasiswaplan_courses_v1',
  PRESENTATIONS: 'mahasiswaplan_presentations_v1',
  REMINDER_CONFIG: 'mahasiswaplan_reminders_v1',
  USER_PROFILE: 'mahasiswaplan_profile_v1',
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  nama: 'Ahmad Muhsin Syah',
  nim: '230201110088',
  email: 'muhsinsyah807@gmail.com',
  programStudi: 'Ilmu Hadis (ILHA)',
  fakultas: 'Ushuluddin dan Filsafat',
  semester: 5,
  tahunAngkatan: '2023',
  avatarUrl: 'emerald_student',
  isLoggedIn: true,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return INITIAL_USER_PROFILE;
    return { ...INITIAL_USER_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load user profile from localStorage', e);
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile to localStorage', e);
  }
}

export function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) return INITIAL_COURSES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COURSES;
  } catch (e) {
    console.error('Failed to load courses from localStorage', e);
    return INITIAL_COURSES;
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (e) {
    console.error('Failed to save courses to localStorage', e);
  }
}

export function loadPresentations(): Presentation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESENTATIONS);
    if (!raw) return INITIAL_PRESENTATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRESENTATIONS;
  } catch (e) {
    console.error('Failed to load presentations from localStorage', e);
    return INITIAL_PRESENTATIONS;
  }
}

export function savePresentations(presentations: Presentation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESENTATIONS, JSON.stringify(presentations));
  } catch (e) {
    console.error('Failed to save presentations to localStorage', e);
  }
}

export function loadReminderConfig(): ReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDER_CONFIG);
    if (!raw) return INITIAL_REMINDER_CONFIG;
    return { ...INITIAL_REMINDER_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load reminder config', e);
    return INITIAL_REMINDER_CONFIG;
  }
}

export function saveReminderConfig(config: ReminderConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDER_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save reminder config', e);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.COURSES);
  localStorage.removeItem(STORAGE_KEYS.PRESENTATIONS);
  localStorage.removeItem(STORAGE_KEYS.REMINDER_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}
