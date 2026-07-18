import axios from 'axios';
import { Notification } from '../types';

export interface NotificationsApiResponse {
  data: Notification[];
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

const MOCK_NOTIFICATIONS_LOCAL: Notification[] = [
  {
    id: "notif-1",
    title: "Upcoming Consultation Alert",
    message: "Your appointment with Dr. Vikram Chauhan is in 3 days. Prepare your updated diet logs.",
    date: "2026-06-12",
    type: "Appointment"
  }
];

export const patientNotificationApi = {
  getNotifications: async (): Promise<NotificationsApiResponse> => {
    try {
      const response = await client.get('/patient/notifications', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        return { data: response.data.data, isFallback: false };
      }
      throw new Error('Failed to fetch notifications');
    } catch (err: any) {
      return { data: MOCK_NOTIFICATIONS_LOCAL, isFallback: true, error: err.message };
    }
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await client.post(`/patient/notifications/${id}/read`, {}, { headers: getAuthHeaders() });
      return { success: response.data && response.data.success };
    } catch (err) {
      console.error('Failed to mark read', err);
      return { success: false };
    }
  }
};

export default patientNotificationApi;
