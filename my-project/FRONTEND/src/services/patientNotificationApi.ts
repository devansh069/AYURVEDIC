// patientNotificationApi.ts — Pure mock-data service (no backend required)
import { Notification } from '../types';

export interface NotificationsApiResponse {
  data: Notification[];
  isFallback: boolean;
  error?: string;
}

const MOCK_NOTIFICATIONS_LOCAL: Notification[] = [
  {
    id: "notif-1",
    title: "Upcoming Consultation Alert",
    message: "Your appointment with Dr. Vikram Chauhan is in 3 days. Prepare your updated diet logs.",
    date: "2026-06-12",
    type: "Appointment"
  },
  {
    id: "notif-2",
    title: "Morning Kashayam Reminder",
    message: "Time to consume your Dashamula decoction (empty stomach) for optimal metabolic fire.",
    date: "2026-06-12",
    type: "Reminder"
  },
  {
    id: "notif-3",
    title: "Daily Health Tip",
    message: "Avoid drinking ice-cold water during or immediately after meals as it dampens Agni (digestive fire).",
    date: "2026-06-11",
    type: "Tip"
  }
];

export const patientNotificationApi = {
  getNotifications: async (): Promise<NotificationsApiResponse> => {
    return { data: MOCK_NOTIFICATIONS_LOCAL, isFallback: true };
  }
};

export default patientNotificationApi;
