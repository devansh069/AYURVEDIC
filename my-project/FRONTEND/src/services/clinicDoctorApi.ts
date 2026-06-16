import { Doctor } from '../types';
import { MOCK_DOCTORS, MOCK_CLINICS } from './apiService';


export interface ClinicDoctorsResponse {
  data: Doctor[];
  isFallback: boolean;
  error?: string;
}


export const clinicDoctorApi = {
  getDoctorsByClinicId: async (clinicId: string): Promise<ClinicDoctorsResponse> => {
      
      const clinic = MOCK_CLINICS.find(c => c.id === clinicId);
      if (!clinic) {
        return { data: MOCK_DOCTORS.slice(0, 3), isFallback: true };
      }
      
      const filtered = MOCK_DOCTORS.filter(d => 
        d.clinicName.toLowerCase().includes(clinic.name.toLowerCase().split(' ')[0]) ||
        d.city.toLowerCase() === clinic.city.toLowerCase()
      );
      
      return {
        data: filtered.length > 0 ? filtered : MOCK_DOCTORS.slice(0, 3),
        isFallback: true
      };
  }
};

export default clinicDoctorApi;




