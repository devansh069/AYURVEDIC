import axios from 'axios';
import { DoctorProfileModel } from '../types';

const BACKEND_URL = 'http://localhost:5174/api';

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 25000
});

export interface ConsultationBookingData {
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  consultationFee: number;
}

export const doctorApi = {
  // Fetch a single doctor by ID
  async getDoctorById(id: string): Promise<{ data: any; isFallback: boolean; error?: string }> {
    try {
      const response = await client.get(`/doctors/${id}`);
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  },

  // Fetch list of all doctors
  async getDoctors(): Promise<{ data: any[]; isFallback: boolean; error?: string }> {
    try {
      const response = await client.get('/doctors');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  // Fetch unique specializations
  async getSpecializations(): Promise<{ data: string[]; isFallback: boolean; error?: string }> {
    try {
      const response = await client.get('/specializations');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  // Sync doctors scientific specialization data
  async syncDoctors(): Promise<{ data: any; isFallback: boolean; error?: string }> {
    try {
      const response = await client.post('/doctors/sync');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  },

  // Book a consultation session in real time
  async bookConsultation(booking: ConsultationBookingData): Promise<{ data: any; isFallback: boolean; error?: string }> {
    try {
      const response = await client.post('/doctors/book', booking);
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  },

  async getProfile(): Promise<{ data: DoctorProfileModel; isFallback: boolean }> {
    const active = localStorage.getItem('activeUser');
    if (active) {
      try {
        const parsed = JSON.parse(active);
        if (parsed.role === 'doctor') {
          return { data: parsed.profile, isFallback: false };
        }
      } catch (e) {
        console.error('Error reading active doctor', e);
      }
    }
    return {
      data: {
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
      },
      isFallback: true
    };
  },

  async updateStatus(status: string): Promise<{ success: boolean; isFallback: boolean }> {
    return { success: true, isFallback: true };
  }
};

export default doctorApi;
