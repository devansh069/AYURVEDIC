import { DoctorCertification, DoctorClinicAffiliation } from '../types';


export const MOCK_CERTIFICATIONS: DoctorCertification[] = [
  { id: '1', title: 'MD in Ayurveda (Panchakarma)', institution: 'Gujarat Ayurved University', issueDate: '2010-06-15', certificateUrl: '#' },
  { id: '2', title: 'BAMS', institution: 'National Institute of Ayurveda', issueDate: '2005-08-20', certificateUrl: '#' },
  { id: '3', title: 'Diploma in Yoga and Naturopathy', institution: 'Morarji Desai National Institute of Yoga', issueDate: '2012-03-10', certificateUrl: '#' }
];

export const MOCK_CLINICS: DoctorClinicAffiliation[] = [
  { id: '1', clinicName: 'AyurVeda Wellness Center', address: '123 Health Avenue, Malviya Nagar', city: 'Jaipur', consultationDays: ['Monday', 'Tuesday', 'Wednesday'] },
  { id: '2', clinicName: 'Holistic Healing Clinic', address: '45 Lotus Road, Vaishali Nagar', city: 'Jaipur', consultationDays: ['Thursday', 'Friday', 'Saturday'] }
];

export const certificationApi = {
  async getCertifications(): Promise<{ data: DoctorCertification[]; isFallback: boolean }> {
      return { data: MOCK_CERTIFICATIONS, isFallback: true };
  },

  async getClinics(): Promise<{ data: DoctorClinicAffiliation[]; isFallback: boolean }> {
      return { data: MOCK_CLINICS, isFallback: true };
  }
};

export default certificationApi;



