import axios from 'axios';
import { Patient, HealthGoal, WellnessMetric, AIRecommendation, MedicalRecord } from '../types';

export interface PatientDashboardData {
  profile: Patient;
  wellness: WellnessMetric;
  aiRecommendations: AIRecommendation;
  healthGoals: HealthGoal[];
  records: MedicalRecord[];
}

export interface ApiResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

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
      console.error('Error reading auth headers', e);
    }
  }
  return {};
};

// Local mock fallbacks for offline resilience
const MOCK_WELLNESS_LOCAL: WellnessMetric = {
  dietAdherence: 85,
  exerciseProgress: 90,
  sleepQuality: 80,
  waterIntake: 75
};

const MOCK_PROFILE_LOCAL: Patient = {
  id: 'pat-123',
  name: 'Priyanshi Sharma',
  email: 'priyanshi@ayurvedaconnect.com',
  phone: '+91 98765 43210',
  age: 28,
  gender: 'Female',
  profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  city: 'New Delhi',
  doshaType: 'Pitta-Kapha',
  healthGoals: ['PCOS Management', 'Stress Reduction', 'Improved Digestion'],
  joinedDate: '2026-01-15'
};

const MOCK_AI_RECOMMENDATIONS_LOCAL: AIRecommendation = {
  suggestedDiet: [
    'Warm cooked grains (Quinoa, Barley, Brown Rice).',
    'Favor bitter, pungent, and astringent tastes to pacify Kapha.',
    'Avoid raw salads and heavy cold dairy after sunset.'
  ],
  recommendedTreatment: 'Shirodhara (3 sessions) for stress reduction and hormonal alignment.',
  lifestyleTips: [
    'Practice cooling breath Sheetali pranayama for 10 minutes daily.',
    'Retire to bed by 10:30 PM to optimize Pitta liver detox cycles.',
    'Daily gentle self-Abhyanga foot massage with organic coconut oil.'
  ],
  doctorFollowUpReminder: 'Schedule standard diagnostic checkup with Dr. Vikram Chauhan in 3 weeks.'
};

const MOCK_HEALTH_GOALS_LOCAL: HealthGoal[] = [
  { id: 'goal-1', title: 'Weight Management', progress: 68, target: 'Reduce Kapha weight by 5kg' },
  { id: 'goal-2', title: 'PCOS Management', progress: 75, target: 'Cycle regularity & hormonal balance' },
  { id: 'goal-3', title: 'Stress Reduction', progress: 80, target: 'Increase mindfulness and sleep hours' }
];

const MOCK_RECORDS_LOCAL: MedicalRecord[] = [
  {
    id: 'rec-doc-1',
    title: 'Thyroid & Doshic Profile Blood Test',
    type: 'Report',
    date: '2026-05-18',
    doctorName: 'Dr. Vikram Chauhan',
    fileSize: '2.4 MB',
    fileUrl: '#'
  }
];

export const patientApi = {
  getPatientDashboard: async (): Promise<ApiResponse<PatientDashboardData>> => {
    try {
      const response = await client.get('/patient/dashboard', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data, isFallback: false };
      }
      throw new Error('Failed to load patient dashboard from backend');
    } catch (err: any) {
      console.warn('Backend patient dashboard failed, using mock fallbacks:', err.message);
      return {
        data: {
          profile: MOCK_PROFILE_LOCAL,
          wellness: MOCK_WELLNESS_LOCAL,
          aiRecommendations: MOCK_AI_RECOMMENDATIONS_LOCAL,
          healthGoals: MOCK_HEALTH_GOALS_LOCAL,
          records: MOCK_RECORDS_LOCAL
        },
        isFallback: true,
        error: err.message
      };
    }
  },

  getPatientProfile: async (): Promise<ApiResponse<Patient>> => {
    try {
      const response = await client.get('/patient/dashboard', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data.profile, isFallback: false };
      }
      throw new Error('Failed to load profile');
    } catch (err: any) {
      return { data: MOCK_PROFILE_LOCAL, isFallback: true, error: err.message };
    }
  },

  uploadMedicalRecord: async (recordData: { title: string; type: string; doctorName?: string }): Promise<ApiResponse<MedicalRecord>> => {
    try {
      const response = await client.post('/patient/medical-records', recordData, { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data, isFallback: false };
      }
      throw new Error('Failed to upload record to backend');
    } catch (err: any) {
      const offlineRecord: MedicalRecord = {
        id: `rec-doc-${Date.now()}`,
        title: recordData.title || 'Uploaded Document',
        type: (recordData.type as any) || 'Document',
        date: new Date().toISOString().split('T')[0],
        doctorName: recordData.doctorName || 'Self Uploaded',
        fileSize: '1.2 MB',
        fileUrl: '#'
      };
      MOCK_RECORDS_LOCAL.unshift(offlineRecord);
      return { data: offlineRecord, isFallback: true, error: err.message };
    }
  }
};

export default patientApi;
