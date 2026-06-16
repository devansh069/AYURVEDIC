// src/types/auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  age: number;
  city: string;
  state: string;
  country: string;
  agreeTerms: boolean;
}

export interface ForgotPasswordFormData {
  emailOrPhone: string;
}

export interface OTPFormData {
  otp: string; // 6‑digit code
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number; // 1-5
  avatarUrl: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Statistic {
  id: string;
  label: string;
  value: string; // formatted string like "10,000+"
}

export interface SecurityFeature {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface TrustBadge {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type SocialProvider = 'google' | 'apple' | 'facebook' | 'linkedin';
