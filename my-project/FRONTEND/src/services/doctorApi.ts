import axios from 'axios';
import { DoctorProfileModel } from '../types';

const BACKEND_URL = 'http://127.0.0.1:5174/api';
const client = axios.create({ baseURL: BACKEND_URL, timeout: 1500 });

export const MOCK_DOCTOR_PROFILE: DoctorProfileModel = {
  id: 'dr-1',
  name: 'Dr. Arun Sharma',
  photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80',
  specialization: 'Panchakarma & Internal Medicine',
  qualification: 'BAMS, MD (Ayurveda)',
  experience: '15+ Years',
  rating: 4.9,
  clinicName: 'AyurVeda Wellness Center',
  city: 'Jaipur',
  email: 'dr.arun@ayurvedaconnect.com',
  phone: '+91 98765 12345',
};

const getActiveDoctor = (): DoctorProfileModel => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      if (parsed.role === 'doctor') {
        return parsed.profile;
      }
    } catch (e) {
      console.error('Error reading active doctor', e);
    }
  }
  return MOCK_DOCTOR_PROFILE;
};

export const doctorApi = {
  async getProfile(): Promise<{ data: DoctorProfileModel; isFallback: boolean }> {
    try {
      const res = await client.get('/doctor/profile');
      return { data: res.data, isFallback: false };
    } catch {
      return { data: getActiveDoctor(), isFallback: true };
    }
  },

  async updateStatus(status: string): Promise<{ success: boolean; isFallback: boolean }> {
    try {
      await client.post('/doctor/update-status', { status });
      return { success: true, isFallback: false };
    } catch {
      return { success: true, isFallback: true };
    }
  }
};

export default doctorApi;
