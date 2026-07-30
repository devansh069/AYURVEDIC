import axios from 'axios';
import { RecoveryProgress } from '../types';

export interface RecoveryProgressApiResponse {
  data: RecoveryProgress & {
    weeklyMetrics: { name: string; progress: number; target: number }[];
    monthlyMetrics: { name: string; progress: number; target: number }[];
  };
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
      console.error(e);
    }
  }
  return {};
};

const MOCK_RECOVERY_LOCAL = {
  id: "rec-1",
  condition: "PCOS & Metabolic Imbalance",
  progress: 72,
  startDate: "2026-04-10",
  expectedCompletion: "2026-08-10",
  weeklyMetrics: [
    { name: "Wk 1", progress: 10, target: 15 },
    { name: "Wk 2", progress: 25, target: 30 }
  ],
  monthlyMetrics: [
    { name: "Apr", progress: 30, target: 40 }
  ]
};

export const patientRecoveryApi = {
  getRecoveryProgress: async (): Promise<RecoveryProgressApiResponse> => {
    try {
      const response = await client.get('/patient/recovery', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data, isFallback: false };
      }
      throw new Error('Failed to load recovery details');
    } catch (err: any) {
      return { data: MOCK_RECOVERY_LOCAL, isFallback: true, error: err.message };
    }
  },

  updateWellness: async (wellnessData: { dietAdherence: number; exerciseProgress: number; sleepQuality: number; waterIntake: number }): Promise<{ success: boolean }> => {
    try {
      const response = await client.post('/patient/wellness', wellnessData, { headers: getAuthHeaders() });
      return { success: response.data && response.data.success };
    } catch (err) {
      console.error('Failed to update wellness indicators', err);
      return { success: false };
    }
  },

  logProgressPoint: async (point: { chartType: 'weekly' | 'monthly'; name: string; progress: number; target: number }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await client.post('/patient/recovery/log', point, { headers: getAuthHeaders() });
      return { success: response.data && response.data.success };
    } catch (err: any) {
      console.error('Failed to log recovery progress', err);
      return { success: false, error: err.message };
    }
  }
};

export default patientRecoveryApi;
