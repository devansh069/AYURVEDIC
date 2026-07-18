import axios from 'axios';
import { Treatment, TreatmentCategory } from '../types';

const BACKEND_URL = 'http://localhost:5174/api';

export interface TreatmentResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export interface TreatmentBookingData {
  treatmentId: string;
  treatmentName: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
}

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000
});

export const treatmentApi = {
  getTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
    try {
      const res = await client.get('/treatments');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  getTreatmentById: async (id: string): Promise<TreatmentResponse<Treatment | undefined>> => {
    try {
      const res = await client.get(`/treatments/${id}`);
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: undefined, isFallback: true, error: err.message };
    }
  },

  getTreatmentCategories: async (): Promise<TreatmentResponse<TreatmentCategory[]>> => {
    try {
      const res = await client.get('/treatment-categories');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  getPopularTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
    try {
      const res = await client.get('/popular-treatments');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  getRecommendedTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
    try {
      const res = await client.get('/recommended-treatments');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  syncTreatments: async (): Promise<TreatmentResponse<any>> => {
    try {
      const res = await client.post('/treatments/sync');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  },

  bookTreatment: async (booking: TreatmentBookingData): Promise<TreatmentResponse<any>> => {
    try {
      const res = await client.post('/treatments/book', booking);
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  }
};

export default treatmentApi;
