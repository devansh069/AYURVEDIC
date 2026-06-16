// clinicApi.ts — Pure mock-data service (no backend required)
import { Clinic } from '../types';
import { MOCK_CLINICS } from './apiService';

export interface ClinicApiResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export const clinicApi = {
  getClinics: async (searchParams?: { name?: string; city?: string; service?: string }): Promise<ClinicApiResponse<Clinic[]>> => {
    let results = [...MOCK_CLINICS];
    if (searchParams) {
      const { name, city, service } = searchParams;
      if (name) results = results.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
      if (city) results = results.filter(c => c.city.toLowerCase() === city.toLowerCase());
      if (service) results = results.filter(c => c.services.some(s => s.toLowerCase() === service.toLowerCase()));
    }
    return { data: results, isFallback: true };
  },

  getClinicById: async (id: string): Promise<ClinicApiResponse<Clinic | undefined>> => {
    const found = MOCK_CLINICS.find(c => c.id === id);
    return { data: found, isFallback: true };
  },

  getPanchakarmaCenters: async (): Promise<ClinicApiResponse<Clinic[]>> => {
    const centers = MOCK_CLINICS.filter(c => c.type === 'Panchakarma Center');
    return { data: centers, isFallback: true };
  },

  getFeaturedClinics: async (): Promise<ClinicApiResponse<Clinic[]>> => {
    const featured = MOCK_CLINICS.filter(c => c.rating >= 4.8);
    return { data: featured, isFallback: true };
  },

  getCities: async (): Promise<ClinicApiResponse<string[]>> => {
    const cities = Array.from(new Set(MOCK_CLINICS.map(c => c.city)));
    return { data: cities, isFallback: true };
  },

  getServices: async (): Promise<ClinicApiResponse<string[]>> => {
    const servicesSet = new Set<string>();
    MOCK_CLINICS.forEach(c => c.services.forEach(s => servicesSet.add(s)));
    return { data: Array.from(servicesSet), isFallback: true };
  }
};

export default clinicApi;
