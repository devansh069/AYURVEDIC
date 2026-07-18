import axios from 'axios';
import { PatientDashboardAppointment } from '../types';

export interface AppointmentsApiResponse {
  data: PatientDashboardAppointment[];
  isFallback: boolean;
  error?: string;
}

export interface SingleAppointmentApiResponse {
  data: PatientDashboardAppointment;
  isFallback: boolean;
  error?: string;
}

const client = axios.create({
  baseURL: 'http://localhost:5174/api',
  timeout: 25000
});

const getAuthHeaders = () => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      return {
        'x-user-id': parsed.profile.id,
        'x-user-role': parsed.role
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {};
};

const MOCK_APPOINTMENTS_LOCAL: PatientDashboardAppointment[] = [
  {
    id: "APT-78901",
    doctorName: "Dr. Vikram Chauhan",
    specialization: "Kayachikitsa (Internal Medicine)",
    clinic: "AyuCare SuperSpecialty Clinic, New Delhi",
    date: "2026-06-15",
    time: "10:30 AM",
    status: "Confirmed"
  }
];

export const patientAppointmentApi = {
  getAppointments: async (): Promise<AppointmentsApiResponse> => {
    try {
      const response = await client.get('/patient/appointments', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data, isFallback: false };
      }
      throw new Error('Failed to load appointments');
    } catch (err: any) {
      return { data: MOCK_APPOINTMENTS_LOCAL, isFallback: true, error: err.message };
    }
  },

  cancelAppointment: async (id: string): Promise<SingleAppointmentApiResponse> => {
    try {
      const response = await client.post(`/patient/appointments/${id}/cancel`, {}, { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        // Return dummy object showing cancelled
        return { 
          data: { id, doctorName: '', specialization: '', clinic: '', date: '', time: '', status: 'Cancelled' }, 
          isFallback: false 
        };
      }
      throw new Error('Failed to cancel appointment');
    } catch (err: any) {
      const apt = MOCK_APPOINTMENTS_LOCAL.find(a => a.id === id);
      if (apt) {
        apt.status = 'Cancelled';
        return { data: apt, isFallback: true };
      }
      throw new Error(err.message);
    }
  },

  rescheduleAppointment: async (id: string, date: string, time: string): Promise<SingleAppointmentApiResponse> => {
    try {
      const response = await client.post(`/patient/appointments/${id}/reschedule`, { date, time }, { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { 
          data: { id, doctorName: '', specialization: '', clinic: '', date, time, status: 'Confirmed' }, 
          isFallback: false 
        };
      }
      throw new Error('Failed to reschedule');
    } catch (err: any) {
      const apt = MOCK_APPOINTMENTS_LOCAL.find(a => a.id === id);
      if (apt) {
        apt.date = date;
        apt.time = time;
        apt.status = 'Confirmed';
        return { data: apt, isFallback: true };
      }
      throw new Error(err.message);
    }
  }
};

export default patientAppointmentApi;
