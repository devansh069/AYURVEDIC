import { DoctorPatientModel } from '../types';


export const MOCK_DOCTOR_PATIENTS: DoctorPatientModel[] = [
  { id: 'pat-1', name: 'Rahul Verma', age: 34, gender: 'Male', condition: 'Arthritis', appointmentDate: '2026-06-12', status: 'Active', progress: 40, lastVisit: '2026-05-28' },
  { id: 'pat-2', name: 'Priyanshi Sharma', age: 24, gender: 'Female', condition: 'PCOS', appointmentDate: '2026-06-12', status: 'Recovering', progress: 75, lastVisit: '2026-06-01' },
  { id: 'pat-3', name: 'Amit Kumar', age: 45, gender: 'Male', condition: 'IBS', appointmentDate: '2026-06-12', status: 'Active', progress: 20, lastVisit: '2026-05-15' },
  { id: 'pat-4', name: 'Neha Singh', age: 29, gender: 'Female', condition: 'Eczema', appointmentDate: '2026-06-13', status: 'Completed', progress: 100, lastVisit: '2026-04-10' },
  { id: 'pat-5', name: 'Vikram Joshi', age: 52, gender: 'Male', condition: 'Sciatica', appointmentDate: '2026-06-13', status: 'Active', progress: 60, lastVisit: '2026-06-05' },
];

export const doctorPatientApi = {
  async getPatients(): Promise<{ data: DoctorPatientModel[]; isFallback: boolean }> {
      return { data: MOCK_DOCTOR_PATIENTS, isFallback: true };
  }
};

export default doctorPatientApi;



