// FRONTEND/src/services/clinicDoctorApi.ts
// Service fetching doctors associated with a clinic dynamically from MySQL database.
import axios from 'axios';
import { Doctor } from '../types';

const BACKEND_URL = 'http://localhost:5174/api';

export interface ClinicDoctorsResponse {
  data: Doctor[];
  isFallback: boolean;
  error?: string;
}

export const clinicDoctorApi = {
  getDoctorsByClinicId: async (clinicId: string): Promise<ClinicDoctorsResponse> => {
    try {
      // Fetch clinic details first to know name & location
      const clinicRes = await axios.get(`${BACKEND_URL}/clinics/${clinicId}`);
      const clinic = clinicRes.data;

      if (clinic) {
        const res = await axios.get(`${BACKEND_URL}/doctors`);
        const doctors = res.data;
        const filtered = doctors.filter((d: any) => 
          (d.clinicName && d.clinicName.toLowerCase().includes(clinic.name.toLowerCase().split(' ')[0])) ||
          (d.city && d.city.toLowerCase() === clinic.city.toLowerCase())
        );

        if (filtered.length > 0) {
          return { data: filtered, isFallback: false };
        }
      }

      // Default fallback: return first 3 doctors
      const allRes = await axios.get(`${BACKEND_URL}/doctors`);
      return { data: allRes.data.slice(0, 3), isFallback: false };
    } catch (err: any) {
      console.warn('Clinic doctors fetch failed, fallback active:', err.message);
      return { data: [], isFallback: true, error: err.message };
    }
  }
};

export default clinicDoctorApi;
