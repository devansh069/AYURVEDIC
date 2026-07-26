// FRONTEND/src/services/doctorRecommendationApi.ts
// Service fetching recommended doctors dynamically from MySQL backend based on treatment requirements.
import axios from 'axios';
import { Doctor } from '../types';

const BACKEND_URL = 'http://localhost:5174/api';

export interface DoctorRecommendationResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export const doctorRecommendationApi = {
  getRecommendedDoctors: async (treatmentId: string): Promise<DoctorRecommendationResponse<Doctor[]>> => {
    try {
      let specParam = '';
      const tid = treatmentId.toLowerCase();

      // Map treatment profile requirements to clinical specialization channels
      if (tid.includes('pancha') || tid.includes('basti') || tid.includes('virechana') || tid.includes('vamana') || tid.includes('rakta') || tid.includes('nasya')) {
        specParam = 'Panchakarma';
      } else if (tid.includes('shirodhara') || tid.includes('abhyanga') || tid.includes('udvartana') || tid.includes('massage') || tid.includes('steam')) {
        specParam = 'Massages';
      } else if (tid.includes('diab') || tid.includes('metabolic') || tid.includes('sugar')) {
        specParam = 'Diabetes';
      } else if (tid.includes('arthr') || tid.includes('joint') || tid.includes('basti') || tid.includes('spine')) {
        specParam = 'Arthritis';
      } else if (tid.includes('women') || tid.includes('pcos') || tid.includes('gynaec')) {
        specParam = 'Prasuti';
      } else if (tid.includes('skin') || tid.includes('psor') || tid.includes('hair')) {
        specParam = 'Skin';
      } else if (tid.includes('mental') || tid.includes('insom') || tid.includes('anx') || tid.includes('migr') || tid.includes('wellness')) {
        specParam = 'Mental';
      }

      // Live request to MySQL backend
      const res = await axios.get(`${BACKEND_URL}/doctors`, {
        params: { specialization: specParam }
      });

      if (res.data && res.data.length > 0) {
        return { data: res.data.slice(0, 6), isFallback: false };
      }

      // Default fallback: get general doctors
      const allRes = await axios.get(`${BACKEND_URL}/doctors`);
      return { data: allRes.data.slice(0, 6), isFallback: false };
    } catch (err: any) {
      console.warn('Recommended doctors fetch failed, fallback active:', err.message);
      return { data: [], isFallback: true, error: err.message };
    }
  }
};

export default doctorRecommendationApi;
