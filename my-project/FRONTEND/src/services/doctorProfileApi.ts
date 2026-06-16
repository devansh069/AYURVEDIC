import { DoctorFullProfile } from '../types';


export const MOCK_DOCTOR_FULL_PROFILE: DoctorFullProfile = {
  id: 'dr-1',
  fullName: 'Dr. Arun Sharma',
  profilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80',
  email: 'dr.arun@ayurvedaconnect.com',
  phone: '+91 98765 12345',
  gender: 'Male',
  dateOfBirth: '1980-05-15',
  city: 'Jaipur',
  state: 'Rajasthan',
  country: 'India',
  bio: 'With over 15 years of experience in Panchakarma and internal Ayurvedic medicine, I am dedicated to providing holistic and authentic Ayurvedic treatments. I specialize in chronic digestive disorders and stress management therapies.',
  experience: 15,
  qualification: 'BAMS, MD (Ayurveda)',
  specializations: ['Panchakarma', 'Digestive Disorders', 'Stress Management', 'Skin Disorders'],
  languages: ['English', 'Hindi', 'Sanskrit'],
  consultationFee: 500,
  onlineConsultationFee: 400,
  rating: 4.9,
  reviewCount: 342,
  kycStatus: 'Verified',
  medicalRegStatus: 'Verified',
  profileApprovalStatus: 'Approved',
  completionPercentage: 85
};

export const doctorProfileApi = {
  async getProfile(): Promise<{ data: DoctorFullProfile; isFallback: boolean }> {
      return { data: MOCK_DOCTOR_FULL_PROFILE, isFallback: true };
  },

  async updateProfile(profileData: Partial<DoctorFullProfile>): Promise<{ data: DoctorFullProfile; isFallback: boolean }> {
      return { data: { ...MOCK_DOCTOR_FULL_PROFILE, ...profileData }, isFallback: true };
  }
};

export default doctorProfileApi;



