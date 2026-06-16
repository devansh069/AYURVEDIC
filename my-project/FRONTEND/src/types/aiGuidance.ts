// src/types/aiGuidance.ts
export interface HealthScore {
  overall: number;
  wellness: number;
  recovery: number;
  lifestyle: number;
  doshaBalance: number;
}
export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weightKg: number;
  heightCm: number;
  lifestyle: string;
  healthGoals: string[];
  sleepQuality: number; // 1-10
  stressLevel: number; // 1-10
  waterIntakeL: number;
  exerciseFreqPerWeek: number;
}
export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
  icon: React.ReactNode;
}
export interface DoshaInfo {
  type: 'Vata' | 'Pitta' | 'Kapha';
  score: number; // 0-100
  characteristics: string[];
  balanceLevel: 'Low' | 'Balanced' | 'High';
  strengths: string[];
  improvementAreas: string[];
}
export interface MealSuggestion {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Hydration';
  calories: number;
  benefits: string;
  ingredients: string[];
  doshaCompatibility: 'Vata' | 'Pitta' | 'Kapha' | 'All';
}
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
