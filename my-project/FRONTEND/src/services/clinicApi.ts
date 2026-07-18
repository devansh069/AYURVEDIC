import axios from 'axios';
import { Clinic } from '../types';
import { MOCK_CLINICS } from './apiService';

export interface ClinicApiResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

const client = axios.create({
  baseURL: 'http://localhost:5174/api',
  timeout: 25000
});

export const clinicApi = {
  getClinics: async (searchParams?: { name?: string; city?: string; service?: string }): Promise<ClinicApiResponse<Clinic[]>> => {
    try {
      const response = await client.get('/clinics', { params: searchParams });
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      let results = [...MOCK_CLINICS];
      if (searchParams) {
        const { name, city, service } = searchParams;
        if (name) results = results.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
        if (city) results = results.filter(c => c.city.toLowerCase() === city.toLowerCase());
        if (service) results = results.filter(c => c.services.some(s => s.toLowerCase() === service.toLowerCase()));
      }
      return { data: results, isFallback: true, error: err.message };
    }
  },

  getClinicById: async (id: string): Promise<ClinicApiResponse<Clinic | undefined>> => {
    try {
      const response = await client.get(`/clinics/${id}`);
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      const found = MOCK_CLINICS.find(c => c.id === id);
      return { data: found, isFallback: true, error: err.message };
    }
  },

  getPanchakarmaCenters: async (): Promise<ClinicApiResponse<Clinic[]>> => {
    try {
      const response = await client.get('/panchakarma-centers');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      const centers = MOCK_CLINICS.filter(c => c.type === 'Panchakarma Center');
      return { data: centers, isFallback: true, error: err.message };
    }
  },

  getFeaturedClinics: async (): Promise<ClinicApiResponse<Clinic[]>> => {
    try {
      const response = await client.get('/featured-clinics');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      const featured = MOCK_CLINICS.filter(c => c.rating >= 4.8);
      return { data: featured, isFallback: true, error: err.message };
    }
  },

  getCities: async (): Promise<ClinicApiResponse<string[]>> => {
    try {
      const response = await client.get('/cities');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      const cities = Array.from(new Set(MOCK_CLINICS.map(c => c.city)));
      return { data: cities, isFallback: true, error: err.message };
    }
  },

  getServices: async (): Promise<ClinicApiResponse<string[]>> => {
    try {
      const response = await client.get('/services');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      const servicesSet = new Set<string>();
      MOCK_CLINICS.forEach(c => c.services.forEach(s => servicesSet.add(s)));
      return { data: Array.from(servicesSet), isFallback: true, error: err.message };
    }
  },

  updateClinicLocation: async (id: string, latitude: number, longitude: number): Promise<ClinicApiResponse<Clinic | null>> => {
    try {
      const response = await client.put(`/clinics/${id}/location`, { latitude, longitude });
      return { data: response.data.clinic, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  }
};

export default clinicApi;
