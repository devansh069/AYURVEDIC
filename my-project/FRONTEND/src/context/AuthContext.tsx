import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Patient, DoctorProfileModel } from '../types';

interface AuthContextType {
  user: Patient | DoctorProfileModel | null;
  isAuthenticated: boolean;
  userRole: 'patient' | 'doctor' | null;
  loading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any, password: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleToken: (idToken: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; code?: string; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEFAULT_PATIENT: Patient = {
  id: 'pat-123',
  name: 'Priyanshi Sharma',
  email: 'priyanshi@ayurvedaconnect.com',
  phone: '+91 98765 43210',
  age: 28,
  gender: 'Female',
  profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  city: 'New Delhi',
  doshaType: 'Pitta-Kapha',
  healthGoals: ['PCOS Management', 'Stress Reduction', 'Improved Digestion'],
  joinedDate: '2026-01-15'
};

const DEFAULT_DOCTOR: DoctorProfileModel = {
  id: 'dr-1',
  name: 'Dr. Arun Sharma',
  photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80',
  specialization: 'Panchakarma & Internal Medicine',
  qualification: 'BAMS, MD (Ayurveda)',
  experience: '15+ Years',
  rating: 4.9,
  clinicName: 'AyurVeda Wellness Center',
  city: 'Jaipur',
  email: 'dr.arun@ayurvedaconnect.com',
  phone: '+91 98765 12345'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Patient | DoctorProfileModel | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Seed default accounts if database is empty
    if (!localStorage.getItem('users_patient')) {
      localStorage.setItem('users_patient', JSON.stringify([
        { email: 'priyanshi@ayurvedaconnect.com', password: 'password', profile: DEFAULT_PATIENT }
      ]));
    }
    if (!localStorage.getItem('users_doctor')) {
      localStorage.setItem('users_doctor', JSON.stringify([
        { email: 'dr.arun@ayurvedaconnect.com', password: 'password', profile: DEFAULT_DOCTOR }
      ]));
    }

    // 2. Load active session
    const activeSession = localStorage.getItem('activeUser');
    if (activeSession) {
      try {
        const parsed = JSON.parse(activeSession);
        setUser(parsed.profile);
        setUserRole(parsed.role);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing active auth session', err);
        localStorage.removeItem('activeUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5174/api/auth/${role}/login`, {
        email,
        password
      });

      if (response.data && response.data.success) {
        const { profile } = response.data.data;
        setUser(profile);
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem(
          'activeUser',
          JSON.stringify({ role, profile })
        );
        setLoading(false);
        return { success: true };
      }
      throw new Error('Authentication failed');
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid email, password, or chosen role.'
      };
    }
  };

  const signup = async (userData: any, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5174/api/auth/${role}/signup`, {
        ...userData,
        password
      });

      if (response.data && response.data.success) {
        const { profile } = response.data.data;
        setUser(profile);
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem(
          'activeUser',
          JSON.stringify({ role, profile })
        );
        setLoading(false);
        return { success: true };
      }
      throw new Error('Registration failed');
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  };

  const loginWithGoogle = async (email: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5174/api/auth/google', {
        email,
        role
      });

      if (response.data && response.data.success) {
        const { profile } = response.data.data;
        setUser(profile);
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem(
          'activeUser',
          JSON.stringify({ role, profile })
        );
        setLoading(false);
        return { success: true };
      }
      throw new Error('Google login failed');
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || 'Google login failed.'
      };
    }
  };

  const loginWithGoogleToken = async (idToken: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      const url = role === 'patient' 
        ? 'http://localhost:5174/api/auth/patient/google-login'
        : 'http://localhost:5174/api/auth/doctor/google-login';

      const body = { idToken, accessToken: idToken };

      const response = await axios.post(url, body);

      if (response.data && response.data.success) {
        const { profile } = response.data.data;
        setUser(profile);
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem(
          'activeUser',
          JSON.stringify({ role, profile })
        );
        setLoading(false);
        return { success: true };
      }
      throw new Error('Google login failed');
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        code: err.response?.data?.code,
        error: err.response?.data?.error || 'Google login failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('activeUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, loading, login, signup, loginWithGoogle, loginWithGoogleToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
