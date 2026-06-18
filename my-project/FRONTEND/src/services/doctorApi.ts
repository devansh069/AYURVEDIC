import { DoctorProfileModel } from '../types';
import { MOCK_DOCTORS } from './apiService';


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
  // Fetch a single doctor by ID
  async getDoctorById(id: string): Promise<{ data: any; isFallback: boolean }> {
      let found = MOCK_DOCTORS.find(d => d.id === id);
      if (!found && MOCK_DOCTOR_PROFILE.id === id) {
        found = {
          ...MOCK_DOCTOR_PROFILE,
          experience: 15,
          state: 'Rajasthan',
          reviewCount: 45,
          consultationFee: 500,
          languages: ['Hindi', 'English'],
          about: 'Dr. Arun Sharma is a veteran Ayurvedic practitioner specializing in Panchakarma and internal medicine.',
          availability: 'Mon-Sat, 9:00 AM - 5:00 PM',
          onlineConsultation: true,
          offlineConsultation: true,
          specialExpertise: ['Panchakarma Detox', 'Digestive Rejuvenation', 'Internal Medicine'],
          education: ['BAMS - University of Rajasthan', 'MD in Ayurveda - National Institute of Ayurveda'],
          awards: ['Ayurveda Ratna Award', 'Outstanding Vaidya Award'],
        } as any;
      }
      return { data: found || null, isFallback: true };
  },

  // Fetch list of all doctors (mocked)
  async getDoctors(): Promise<{ data: any[]; isFallback: boolean }> {
      // Use MOCK_DOCTORS from apiService if available; fallback to single profile
      const data = MOCK_DOCTORS ?? [MOCK_DOCTOR_PROFILE];
      return { data, isFallback: true };
  },
  async getProfile(): Promise<{ data: DoctorProfileModel; isFallback: boolean }> {
<<<<<<< HEAD
      return { data: MOCK_DOCTOR_PROFILE, isFallback: true };
=======
    try {
      const res = await client.get('/doctor/profile');
      return { data: res.data, isFallback: false };
    } catch {
      return { data: getActiveDoctor(), isFallback: true };
    }
>>>>>>> 74093ff7a890953922bb65b1d4a05f32a1be406a
  },

  async updateStatus(status: string): Promise<{ success: boolean; isFallback: boolean }> {
      return { success: true, isFallback: true };
  }
};

export default doctorApi;



