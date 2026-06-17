import axios from 'axios';
import { Patient, HealthGoal, WellnessMetric, AIRecommendation, MedicalRecord } from '../types';

const BACKEND_URL = 'http://127.0.0.1:5174/api';

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
  baseURL: BACKEND_URL,
  timeout: 1500
});

// Standalone local fallbacks
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
  },
  {
    id: 'rec-doc-2',
    title: 'PCOS Hormone Analysis Summary',
    type: 'Report',
    date: '2026-04-12',
    doctorName: 'Dr. Smita Naram',
    fileSize: '1.8 MB',
    fileUrl: '#'
  },
  {
    id: 'rec-doc-3',
    title: 'Vata-Reducing Herbal Decoction Guide',
    type: 'Prescription',
    date: '2026-05-15',
    doctorName: 'Dr. Vikram Chauhan',
    fileSize: '840 KB',
    fileUrl: '#'
  }
];

const getActivePatient = (): Patient => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      if (parsed.role === 'patient') {
        return parsed.profile;
      }
    } catch (e) {
      console.error('Error reading active patient', e);
    }
  }
  return MOCK_PROFILE_LOCAL;
};

export const patientApi = {
  getPatientDashboard: async (): Promise<ApiResponse<PatientDashboardData>> => {
    try {
      const res = await client.get('/patient/dashboard');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      console.warn('API /patient/dashboard failed, using local fallback. Error:', err.message);
      return {
        data: {
          profile: getActivePatient(),
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
      const res = await client.get('/patient/profile');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      console.warn('API /patient/profile failed, using local fallback. Error:', err.message);
      return { data: getActivePatient(), isFallback: true, error: err.message };
    }
  },

  uploadMedicalRecord: async (recordData: { title: string; type: string; doctorName?: string }): Promise<ApiResponse<MedicalRecord>> => {
    try {
      const res = await client.post('/patient/records/upload', recordData);
      return { data: res.data.data, isFallback: false };
    } catch (err: any) {
      console.warn('API /patient/records/upload failed, using local fallback. Error:', err.message);
      const offlineRecord: MedicalRecord = {
        id: `rec-doc-${Date.now()}`,
        title: recordData.title || 'Uploaded Document',
        type: (recordData.type as any) || 'Document',
        date: new Date().toISOString().split('T')[0],
        doctorName: recordData.doctorName || 'Self Uploaded',
        fileSize: '1.2 MB',
        fileUrl: '#'
      };
      // Keep local records up to date in cache
      MOCK_RECORDS_LOCAL.unshift(offlineRecord);
      return { data: offlineRecord, isFallback: true, error: err.message };
    }
  }
};

export default patientApi;
