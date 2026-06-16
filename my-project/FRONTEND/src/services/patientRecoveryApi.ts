import { RecoveryProgress } from '../types';


export interface RecoveryProgressApiResponse {
  data: RecoveryProgress & {
    weeklyMetrics: { name: string; progress: number; target: number }[];
    monthlyMetrics: { name: string; progress: number; target: number }[];
  };
  isFallback: boolean;
  error?: string;
}


const MOCK_RECOVERY_LOCAL = {
  id: "rec-1",
  condition: "PCOS & Metabolic Imbalance",
  progress: 72,
  startDate: "2026-04-10",
  expectedCompletion: "2026-08-10",
  weeklyMetrics: [
    { name: "Wk 1", progress: 10, target: 15 },
    { name: "Wk 2", progress: 25, target: 30 },
    { name: "Wk 3", progress: 42, target: 45 },
    { name: "Wk 4", progress: 55, target: 60 },
    { name: "Wk 5", progress: 62, target: 70 },
    { name: "Wk 6", progress: 72, target: 80 }
  ],
  monthlyMetrics: [
    { name: "Apr", progress: 30, target: 40 },
    { name: "May", progress: 60, target: 70 },
    { name: "Jun", progress: 72, target: 80 }
  ]
};

export const patientRecoveryApi = {
  getRecoveryProgress: async (): Promise<RecoveryProgressApiResponse> => {
      return { data: MOCK_RECOVERY_LOCAL, isFallback: true };
  }
};

export default patientRecoveryApi;




