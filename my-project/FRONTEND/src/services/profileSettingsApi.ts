import axios from 'axios';
import { FullUserProfile, AccountOverview, ActivityLog, SavedContentItem, WellnessGoalItem } from '../types';

const client = axios.create({
  baseURL: 'http://localhost:5174/api',
  timeout: 25000
});

const getAuthHeaders = () => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      return {
        'x-user-id': parsed.profile.id,
        'x-user-role': parsed.role
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {};
};

export const MOCK_FULL_PROFILE: FullUserProfile = {
  id: 'pat-123',
  fullName: 'Priyanshi Sharma',
  email: 'priyanshi@ayurvedaconnect.com',
  phone: '+91 98765 43210',
  gender: 'Female',
  dateOfBirth: '2002-03-15',
  age: 28,
  profilePhoto: '',
  city: 'New Delhi',
  state: 'Delhi',
  country: 'India',
  doshaType: 'Pitta-Kapha',
  healthGoals: ['PCOS Management', 'Stress Reduction', 'Improved Digestion'],
  medicalConditions: ['PCOS'],
  joinedDate: '2026-01-15',
  lifestylePreference: 'Active',
  dietPreference: 'Vegetarian',
  exercisePreference: 'Yoga & Walking'
};

export const MOCK_ACCOUNT_OVERVIEW: AccountOverview = {
  appointments: 3,
  savedTreatments: 4,
  medicalRecords: 3,
  recoveryPlans: 1
};

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'al-1', title: 'Profile Updated', type: 'Profile Update', timestamp: '2026-06-12T10:30:00Z', details: 'Updated health goals and diet preferences', icon: '✏️' },
  { id: 'al-3', title: 'Successful Login', type: 'Login', timestamp: '2026-06-11T09:00:00Z', details: 'Chrome on Windows - Delhi, India', icon: '🔐' }
];

export const MOCK_SAVED_CONTENT: SavedContentItem[] = [
  { id: 'sc-1', title: 'Dr. Vikram Chauhan', type: 'Doctor', subtitle: 'Kayachikitsa Expert • Delhi', savedDate: '2026-06-10' },
  { id: 'sc-3', title: 'Shirodhara Therapy', type: 'Treatment', subtitle: 'Stress Relief & Mental Clarity', savedDate: '2026-06-05' }
];

export const MOCK_WELLNESS_GOALS: WellnessGoalItem[] = [
  { id: 'wg-1', title: 'Weight Management', category: 'Weight', target: '58 kg', current: '62 kg', progress: 65, unit: 'kg' },
  { id: 'wg-2', title: 'PCOS Recovery', category: 'Recovery', target: 'Balanced Hormones', current: 'Improving', progress: 45, unit: '' }
];

export const profileSettingsApi = {
  async getProfile(): Promise<{ data: FullUserProfile; isFallback: boolean }> {
    try {
      const response = await client.get('/patient/dashboard', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        const dbPat = response.data.data.profile;
        const profile: FullUserProfile = {
          ...MOCK_FULL_PROFILE,
          id: dbPat.id,
          fullName: dbPat.name,
          email: dbPat.email,
          phone: dbPat.phone,
          age: dbPat.age,
          gender: dbPat.gender,
          city: dbPat.city,
          doshaType: dbPat.doshaType,
          healthGoals: dbPat.healthGoals
        };
        return { data: profile, isFallback: false };
      }
      throw new Error('Fallback to local mock profile');
    } catch (err) {
      return { data: MOCK_FULL_PROFILE, isFallback: true };
    }
  },

  async updateProfile(profile: Partial<FullUserProfile>): Promise<{ data: FullUserProfile; isFallback: boolean }> {
    try {
      const dbFormat = {
        name: profile.fullName,
        phone: profile.phone,
        age: profile.age,
        gender: profile.gender,
        city: profile.city,
        doshaType: profile.doshaType,
        healthGoals: profile.healthGoals
      };
      const response = await client.put('/patient/profile', dbFormat, { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        // Also update local storage session profile
        const active = localStorage.getItem('activeUser');
        if (active) {
          try {
            const parsed = JSON.parse(active);
            parsed.profile = {
              ...parsed.profile,
              name: profile.fullName || parsed.profile.name,
              phone: profile.phone || parsed.profile.phone,
              age: Number(profile.age) || parsed.profile.age,
              gender: profile.gender || parsed.profile.gender,
              city: profile.city || parsed.profile.city,
              doshaType: profile.doshaType || parsed.profile.doshaType,
              healthGoals: profile.healthGoals || parsed.profile.healthGoals
            };
            localStorage.setItem('activeUser', JSON.stringify(parsed));
          } catch (e) {
            console.error(e);
          }
        }
        return { data: { ...MOCK_FULL_PROFILE, ...profile }, isFallback: false };
      }
      throw new Error('Failed backend profile update');
    } catch (err) {
      return { data: { ...MOCK_FULL_PROFILE, ...profile }, isFallback: true };
    }
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
