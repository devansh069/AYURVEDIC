import { AppSettings, NotificationPrefs, PrivacyPrefs } from '../types';


export const MOCK_APP_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'English',
  timezone: 'Asia/Kolkata',
  communicationMethod: 'WhatsApp',
  consultationType: 'Both',
};

export const MOCK_NOTIFICATION_PREFS: NotificationPrefs = {
  appointmentAlerts: true,
  medicineReminders: true,
  recoveryUpdates: true,
  aiRecommendations: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
};

export const MOCK_PRIVACY_PREFS: PrivacyPrefs = {
  profileVisibility: 'Doctors Only',
  healthDataSharing: true,
  doctorAccess: true,
  analyticsTracking: false,
};

export const settingsApi = {
  async getSettings(): Promise<{ data: AppSettings; isFallback: boolean }> {
      return { data: MOCK_APP_SETTINGS, isFallback: true };
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<{ data: AppSettings; isFallback: boolean }> {
      return { data: { ...MOCK_APP_SETTINGS, ...settings }, isFallback: true };
  },

  async getNotificationPrefs(): Promise<{ data: NotificationPrefs; isFallback: boolean }> {
      return { data: MOCK_NOTIFICATION_PREFS, isFallback: true };
  },

  async updateNotificationPrefs(prefs: Partial<NotificationPrefs>): Promise<{ data: NotificationPrefs; isFallback: boolean }> {
      return { data: { ...MOCK_NOTIFICATION_PREFS, ...prefs }, isFallback: true };
  },

  async getPrivacyPrefs(): Promise<{ data: PrivacyPrefs; isFallback: boolean }> {
      return { data: MOCK_PRIVACY_PREFS, isFallback: true };
  },

  async updatePrivacyPrefs(prefs: Partial<PrivacyPrefs>): Promise<{ data: PrivacyPrefs; isFallback: boolean }> {
      return { data: { ...MOCK_PRIVACY_PREFS, ...prefs }, isFallback: true };
  }
};

export default settingsApi;



