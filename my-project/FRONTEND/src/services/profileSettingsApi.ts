import { FullUserProfile, AccountOverview, ActivityLog, SavedContentItem, WellnessGoalItem } from '../types';


export const MOCK_FULL_PROFILE: FullUserProfile = {
  id: 'user-1',
  fullName: 'Priyanshi Sharma',
  email: 'priyanshi.sharma@email.com',
  phone: '+91 98765 43210',
  gender: 'Female',
  dateOfBirth: '2002-03-15',
  age: 24,
  profilePhoto: '',
  city: 'Jaipur',
  state: 'Rajasthan',
  country: 'India',
  doshaType: 'Pitta-Vata',
  healthGoals: ['Hormonal Balance', 'Stress Management', 'Digestive Health'],
  medicalConditions: ['PCOS', 'Mild Anxiety'],
  joinedDate: '2025-11-10',
  lifestylePreference: 'Active',
  dietPreference: 'Vegetarian',
  exercisePreference: 'Yoga & Walking',

};

export const MOCK_ACCOUNT_OVERVIEW: AccountOverview = {
  appointments: 12,

  savedTreatments: 8,
  medicalRecords: 15,
  recoveryPlans: 3,
};

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'al-1', title: 'Profile Updated', type: 'Profile Update', timestamp: '2026-06-12T10:30:00Z', details: 'Updated health goals and diet preferences', icon: '✏️' },
  { id: 'al-2', title: 'Appointment Booked', type: 'Appointment', timestamp: '2026-06-11T14:15:00Z', details: 'Dr. Arun Sharma - Panchakarma Consultation', icon: '📅' },
  { id: 'al-3', title: 'Successful Login', type: 'Login', timestamp: '2026-06-11T09:00:00Z', details: 'Chrome on Windows - Jaipur, India', icon: '🔐' },
  { id: 'al-4', title: 'Report Downloaded', type: 'Download', timestamp: '2026-06-10T16:45:00Z', details: 'Blood Test Report - June 2026', icon: '📥' },
  { id: 'al-5', title: 'Settings Changed', type: 'Settings', timestamp: '2026-06-09T11:20:00Z', details: 'Enabled two-factor authentication', icon: '⚙️' },
  { id: 'al-6', title: 'Successful Login', type: 'Login', timestamp: '2026-06-08T08:30:00Z', details: 'Safari on iPhone - Jaipur, India', icon: '🔐' },
];

export const MOCK_SAVED_CONTENT: SavedContentItem[] = [
  { id: 'sc-1', title: 'Dr. Arun Sharma', type: 'Doctor', subtitle: 'Panchakarma Specialist • Jaipur', savedDate: '2026-06-10' },
  { id: 'sc-2', title: 'AyurVeda Wellness Center', type: 'Clinic', subtitle: 'Multi-specialty Clinic • Delhi', savedDate: '2026-06-08' },
  { id: 'sc-3', title: 'Shirodhara Therapy', type: 'Treatment', subtitle: 'Stress Relief & Mental Clarity', savedDate: '2026-06-05' },
  { id: 'sc-4', title: 'Pitta Diet Guide', type: 'Article', subtitle: 'Complete Pitta pacifying food list', savedDate: '2026-06-01' },
  { id: 'sc-5', title: 'Dr. Meera Patel', type: 'Doctor', subtitle: 'Gynecology Ayurveda • Mumbai', savedDate: '2026-05-28' },
  { id: 'sc-6', title: 'Abhyanga Massage', type: 'Treatment', subtitle: 'Full body oil therapy', savedDate: '2026-05-25' },
];

export const MOCK_WELLNESS_GOALS: WellnessGoalItem[] = [
  { id: 'wg-1', title: 'Weight Management', category: 'Weight', target: '58 kg', current: '62 kg', progress: 65, unit: 'kg' },
  { id: 'wg-2', title: 'PCOS Recovery', category: 'Recovery', target: 'Balanced Hormones', current: 'Improving', progress: 45, unit: '' },
  { id: 'wg-3', title: 'Daily Sattvic Diet', category: 'Diet', target: '100% Compliance', current: '78%', progress: 78, unit: '%' },
  { id: 'wg-4', title: 'Yoga Practice', category: 'Exercise', target: '30 min/day', current: '20 min/day', progress: 67, unit: 'min' },
];

export const profileSettingsApi = {
  async getProfile(): Promise<{ data: FullUserProfile; isFallback: boolean }> {
      return { data: MOCK_FULL_PROFILE, isFallback: true };
  },

  async updateProfile(profile: Partial<FullUserProfile>): Promise<{ data: FullUserProfile; isFallback: boolean }> {
      return { data: { ...MOCK_FULL_PROFILE, ...profile }, isFallback: true };
  },

  async getAccountOverview(): Promise<{ data: AccountOverview; isFallback: boolean }> {
      return { data: MOCK_ACCOUNT_OVERVIEW, isFallback: true };
  },

  async getActivityLogs(): Promise<{ data: ActivityLog[]; isFallback: boolean }> {
      return { data: MOCK_ACTIVITY_LOGS, isFallback: true };
  },

  async getSavedContent(): Promise<{ data: SavedContentItem[]; isFallback: boolean }> {
      return { data: MOCK_SAVED_CONTENT, isFallback: true };
  },

  async getWellnessGoals(): Promise<{ data: WellnessGoalItem[]; isFallback: boolean }> {
      return { data: MOCK_WELLNESS_GOALS, isFallback: true };
  },
};

export default profileSettingsApi;



