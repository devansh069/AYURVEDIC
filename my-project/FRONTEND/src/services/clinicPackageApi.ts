import { Package } from '../types';
import { MOCK_CLINICS } from './apiService';


export interface ClinicPackagesResponse {
  data: Package[];
  isFallback: boolean;
  error?: string;
}


export const clinicPackageApi = {
  getPackagesByClinicId: async (clinicId: string): Promise<ClinicPackagesResponse> => {
      const clinic = MOCK_CLINICS.find(c => c.id === clinicId);
      return { data: clinic?.packages || [], isFallback: true };
  }
};

export default clinicPackageApi;




