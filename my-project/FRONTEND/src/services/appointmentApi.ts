// appointmentApi.ts — Pure mock-data service (no backend required)
import { DoctorAppointmentModel, Review, Appointment } from '../types';

export const MOCK_DOCTOR_APPOINTMENTS: DoctorAppointmentModel[] = [
  { id: 'apt-1', patientName: 'Rahul Verma', date: '2026-06-12', time: '10:00 AM', consultationType: 'In-Clinic', status: 'Pending', condition: 'Joint Pain' },
  { id: 'apt-2', patientName: 'Priyanshi Sharma', date: '2026-06-12', time: '11:30 AM', consultationType: 'Online', status: 'Pending', condition: 'PCOS Follow-up' },
  { id: 'apt-3', patientName: 'Amit Kumar', date: '2026-06-12', time: '02:15 PM', consultationType: 'In-Clinic', status: 'Completed', condition: 'Digestive Issues' },
  { id: 'apt-4', patientName: 'Neha Singh', date: '2026-06-13', time: '09:00 AM', consultationType: 'Online', status: 'Pending', condition: 'Skin Allergies' },
  { id: 'apt-5', patientName: 'Vikram Joshi', date: '2026-06-13', time: '04:00 PM', consultationType: 'In-Clinic', status: 'Pending', condition: 'Back Pain' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', doctorId: 'dr-1', patientName: 'Aisha Khan', rating: 5, comment: 'Excellent care and guidance.', date: '2026-05-20' },
  { id: 'rev-2', doctorId: 'dr-1', patientName: 'Mohit Patel', rating: 4, comment: 'Very knowledgeable and gentle.', date: '2026-05-22' },
];

const DEFAULT_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

export const appointmentApi = {
  async getAppointments(): Promise<{ data: DoctorAppointmentModel[]; isFallback: boolean }> {
    return { data: MOCK_DOCTOR_APPOINTMENTS, isFallback: true };
  },

  async getSchedule(): Promise<{ data: DoctorAppointmentModel[]; isFallback: boolean }> {
    return { data: MOCK_DOCTOR_APPOINTMENTS.filter(a => a.date === '2026-06-12'), isFallback: true };
  },

  async getDoctorReviews(doctorId: string): Promise<{ data: Review[]; isFallback: boolean }> {
    const data = MOCK_REVIEWS.filter(r => r.doctorId === doctorId);
    return { data, isFallback: true };
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
    const slots = MOCK_DOCTOR_APPOINTMENTS.filter(a => a.date === date).map(a => a.time);
    return slots.length > 0 ? slots : DEFAULT_SLOTS;
  },

  async bookAppointment(payload: any): Promise<{ success: boolean; data: Appointment; isFallback: boolean }> {
    const mockAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: payload.doctorId,
      patientName: payload.patientName,
      email: payload.email,
      phone: payload.phone,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      consultationType: payload.consultationType,
      status: 'Pending',
    };
    return { success: true, data: mockAppointment, isFallback: true };
  },
};

export default appointmentApi;
