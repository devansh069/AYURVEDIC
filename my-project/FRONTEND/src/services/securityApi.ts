import { SecuritySettings, LoginEntry, ActiveDevice } from '../types';


export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  lastPasswordChange: '2026-05-15',
  twoFactorEnabled: true,
  loginHistory: [
    { id: 'lh-1', date: '2026-06-12T10:30:00Z', device: 'Windows PC', browser: 'Chrome', location: 'Jaipur, India', ip: '192.168.1.105', status: 'Success' },
    { id: 'lh-2', date: '2026-06-11T14:15:00Z', device: 'iPhone 13', browser: 'Safari', location: 'Jaipur, India', ip: '192.168.1.106', status: 'Success' },
    { id: 'lh-3', date: '2026-06-05T09:00:00Z', device: 'MacBook Pro', browser: 'Safari', location: 'Delhi, India', ip: '192.168.1.110', status: 'Failed' },
  ],
};

export const MOCK_ACTIVE_DEVICES: ActiveDevice[] = [
  { id: 'dev-1', deviceName: 'Windows PC', browser: 'Chrome', location: 'Jaipur, India', lastActive: 'Active Now', isCurrent: true },
  { id: 'dev-2', deviceName: 'iPhone 13', browser: 'Safari', location: 'Jaipur, India', lastActive: '2 hours ago', isCurrent: false },
  { id: 'dev-3', deviceName: 'iPad Pro', browser: 'Safari', location: 'Delhi, India', lastActive: '1 week ago', isCurrent: false },
];

export const securityApi = {
  async getSecuritySettings(): Promise<{ data: SecuritySettings; isFallback: boolean }> {
      return { data: MOCK_SECURITY_SETTINGS, isFallback: true };
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<{ data: SecuritySettings; isFallback: boolean }> {
      return { data: { ...MOCK_SECURITY_SETTINGS, ...settings }, isFallback: true };
  },

  async getActiveDevices(): Promise<{ data: ActiveDevice[]; isFallback: boolean }> {
      return { data: MOCK_ACTIVE_DEVICES, isFallback: true };
  },

  async logoutDevice(deviceId: string): Promise<{ success: boolean; isFallback: boolean }> {
      return { success: true, isFallback: true };
  }
};

export default securityApi;



