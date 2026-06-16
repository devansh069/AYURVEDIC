import { DoctorAnalyticsModel } from '../types';


export const MOCK_DOCTOR_ANALYTICS: DoctorAnalyticsModel = {
  revenueTrend: [
    { month: 'Jan', amount: 150000 },
    { month: 'Feb', amount: 180000 },
    { month: 'Mar', amount: 200000 },
    { month: 'Apr', amount: 165000 },
    { month: 'May', amount: 220000 },
    { month: 'Jun', amount: 110000 },
  ],
  patientGrowth: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 145 },
    { month: 'Mar', count: 160 },
    { month: 'Apr', count: 130 },
    { month: 'May', count: 175 },
    { month: 'Jun', count: 90 },
  ],
  consultationTypes: [
    { name: 'Online Video', value: 45 },
    { name: 'In-Clinic', value: 55 },
  ],
  recoverySuccess: [
    { metric: 'Fully Recovered', value: 75 },
    { metric: 'Improving', value: 20 },
    { metric: 'No Change', value: 5 },
  ]
};

export const analyticsApi = {
  async getAnalytics(): Promise<{ data: DoctorAnalyticsModel; isFallback: boolean }> {
      return { data: MOCK_DOCTOR_ANALYTICS, isFallback: true };
  }
};

export default analyticsApi;



