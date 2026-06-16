// src/data/mockAuth.ts
export const isDemo = true;

interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain for demo only
}

const users: MockUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
  },
];

let currentOTP: string | null = null;
let otpExpiresAt: number = 0;

export const mockLogin = async (email: string, password: string) => {
  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    }, 500);
  });
};

export const mockSignup = async (data: { name: string; email: string; password: string }) => {
  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    setTimeout(() => {
      const exists = users.some((u) => u.email === data.email);
      if (exists) {
        resolve({ success: false, error: 'Email already registered' });
      } else {
        users.push({ id: String(users.length + 1), name: data.name, email: data.email, password: data.password });
        resolve({ success: true });
      }
    }, 500);
  });
};

export const mockSendOTP = async (email: string) => {
  return new Promise<{ success: boolean; error?: string; otp?: string }>((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        resolve({ success: false, error: 'Email not found' });
        return;
      }
      currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
      otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min
      resolve({ success: true, otp: currentOTP }); // otp returned for demo only
    }, 500);
  });
};

export const mockVerifyOTP = async (otp: string) => {
  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    setTimeout(() => {
      if (currentOTP && otp === currentOTP && Date.now() < otpExpiresAt) {
        resolve({ success: true });
        currentOTP = null;
      } else {
        resolve({ success: false, error: 'Invalid or expired OTP' });
      }
    }, 300);
  });
};

export const mockResetPassword = async (email: string, newPassword: string) => {
  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        resolve({ success: false, error: 'User not found' });
        return;
      }
      user.password = newPassword;
      resolve({ success: true });
    }, 500);
  });
};
