import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, DoctorProfileModel } from '../types';

interface AuthContextType {
  user: Patient | DoctorProfileModel | null;
  isAuthenticated: boolean;
  userRole: 'patient' | 'doctor' | null;
  loading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any, password: string, role: 'patient' | 'doctor') => Promise<{ success: boolean; error?: string }>;
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
    await new Promise((r) => setTimeout(r, 800)); // Smooth transitions

    const dbKey = `users_${role}`;
    const usersRaw = localStorage.getItem(dbKey);
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const foundUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.profile);
      setUserRole(role);
      setIsAuthenticated(true);
      localStorage.setItem(
        'activeUser',
        JSON.stringify({ role, profile: foundUser.profile })
      );
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email, password, or chosen role.' };
    }
  };

  const signup = async (userData: any, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // Smooth transitions

    const dbKey = `users_${role}`;
    const usersRaw = localStorage.getItem(dbKey);
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const emailExists = users.some(
      (u: any) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      setLoading(false);
      return { success: false, error: 'This email is already registered.' };
    }

    const id = `${role === 'patient' ? 'pat' : 'dr'}-${Date.now()}`;
    let profile: Patient | DoctorProfileModel;

    if (role === 'patient') {
      profile = {
        id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        age: Number(userData.age) || 25,
        gender: userData.gender || 'Female',
        profilePhoto: userData.gender === 'Male' 
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' 
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
        city: userData.city || 'Unknown',
        doshaType: userData.doshaType || 'Pitta',
        healthGoals: userData.healthGoals || ['Stress Reduction'],
        joinedDate: new Date().toISOString().split('T')[0]
      };
    } else {
      profile = {
        id,
        name: userData.name,
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80',
        specialization: userData.specialization || 'Ayurvedic Medicine',
        qualification: userData.qualification || 'BAMS',
        experience: userData.experience || '5+ Years',
        rating: 5.0,
        clinicName: userData.clinicName || 'AyurVeda Wellness Center',
        city: userData.city || 'Unknown',
        email: userData.email,
        phone: userData.phone || ''
      };
    }

    const newUsersList = [...users, { email: userData.email, password, profile }];
    localStorage.setItem(dbKey, JSON.stringify(newUsersList));

    // Log them in immediately
    setUser(profile);
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem(
      'activeUser',
      JSON.stringify({ role, profile })
    );

    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('activeUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
