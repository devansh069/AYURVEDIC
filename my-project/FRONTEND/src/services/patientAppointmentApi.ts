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


const MOCK_APPOINTMENTS_LOCAL: PatientDashboardAppointment[] = [
  {
    id: "APT-78901",
    doctorName: "Dr. Vikram Chauhan",
    specialization: "Kayachikitsa (Internal Medicine)",
    clinic: "AyuCare SuperSpecialty Clinic, New Delhi",
    date: "2026-06-15",
    time: "10:30 AM",
    status: "Confirmed"
  },
  {
    id: "APT-45612",
    doctorName: "Dr. Smita Naram",
    specialization: "Panchakarma Specialist",
    clinic: "Ayushya Ayurvedic Wellness Center, Mumbai",
    date: "2026-07-02",
    time: "02:00 PM",
    status: "Pending"
  },
  {
    id: "APT-11223",
    doctorName: "Dr. Vikram Chauhan",
    specialization: "Kayachikitsa (Internal Medicine)",
    clinic: "AyuCare SuperSpecialty Clinic, New Delhi",
    date: "2026-05-15",
    time: "11:00 AM",
    status: "Completed"
  }
];

export const patientAppointmentApi = {
  getAppointments: async (): Promise<AppointmentsApiResponse> => {
      return { data: MOCK_APPOINTMENTS_LOCAL, isFallback: true };
  },

  cancelAppointment: async (id: string): Promise<SingleAppointmentApiResponse> => {
      const apt = MOCK_APPOINTMENTS_LOCAL.find(a => a.id === id);
      if (apt) {
        apt.status = 'Cancelled';
        return { data: apt, isFallback: true };
      }
      throw new Error('Appointment not found offline');
  },

  rescheduleAppointment: async (id: string, date: string, time: string): Promise<SingleAppointmentApiResponse> => {
      const apt = MOCK_APPOINTMENTS_LOCAL.find(a => a.id === id);
      if (apt) {
        apt.date = date;
        apt.time = time;
        apt.status = 'Confirmed'; // reset to Confirmed if rescheduled
        return { data: apt, isFallback: true };
      }
      throw new Error('Appointment not found offline');
  }
};

export default patientAppointmentApi;




