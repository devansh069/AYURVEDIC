// src/data/mockHealthData.ts
import { HealthScore, UserProfile, Recommendation, DoshaInfo, MealSuggestion, FAQItem } from '../types/aiGuidance';

export const healthScore: HealthScore = {
  overall: 78,
  wellness: 85,
  recovery: 70,
  lifestyle: 80,
  doshaBalance: 65,
};

export const userProfile: UserProfile = {
  age: 32,
  gender: 'Female',
  weightKg: 62,
  heightCm: 165,
  lifestyle: 'Active',
  healthGoals: ['Weight Management', 'Stress Reduction'],
  sleepQuality: 7,
  stressLevel: 4,
  waterIntakeL: 2.5,
  exerciseFreqPerWeek: 4,
};

export const recommendations: Recommendation[] = [
  {
    id: 'rec1',
    category: 'Diet',
    title: 'Increase Fresh Fruits',
    description: 'Add seasonal fruits to your breakfast and snacks for antioxidants.',
    priority: 'High',
    impact: 'Boosts immunity and digestion.',
    icon: null,
  },
  {
    id: 'rec2',
    category: 'Lifestyle',
    title: 'Morning Yoga',
    description: 'Practice 20‑minute Vata‑balancing yoga in the morning.',
    priority: 'Medium',
    impact: 'Improves flexibility and reduces anxiety.',
    icon: null,
  },
  // add more items as needed
];

export const doshaInfo: DoshaInfo[] = [
  {
    type: 'Vata',
    score: 55,
    characteristics: ['Light', 'Cold', 'Dry'],
    balanceLevel: 'Low',
    strengths: ['Creativity', 'Quick thinking'],
    improvementAreas: ['Grounding', 'Warm foods'],
  },
  {
    type: 'Pitta',
    score: 70,
    characteristics: ['Hot', 'Sharp', 'Intense'],
    balanceLevel: 'Balanced',
    strengths: ['Metabolism', 'Leadership'],
    improvementAreas: ['Cooling foods', 'Stress management'],
  },
  {
    type: 'Kapha',
    score: 60,
    characteristics: ['Heavy', 'Cold', 'Moist'],\n    balanceLevel: 'Medium',
    strengths: ['Stamina', 'Stability'],
    improvementAreas: ['Light movement', 'Stimulating foods'],
  },
];

export const mealSuggestions: MealSuggestion[] = [
  {
    id: 'meal1',
    meal: 'Breakfast',
    calories: 350,
    benefits: 'Energizes and stabilizes Vata.',
    ingredients: ['Oats', 'Almond milk', 'Berries', 'Honey'],
    doshaCompatibility: 'Vata',
  },
  {
    id: 'meal2',
    meal: 'Lunch',
    calories: 600,
    benefits: 'Balances Pitta with cooling foods.',
    ingredients: ['Quinoa', 'Steamed broccoli', 'Cucumber', 'Yogurt dressing'],
    doshaCompatibility: 'Pitta',
  },
  // more meals …
];

export const faqs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How does AI guidance work?',
    answer: 'Our AI analyses your profile and Ayurvedic principles to generate personalized recommendations.',
  },
  {
    id: 'faq2',
    question: 'Is this a medical diagnosis?',
    answer: 'No, the guidance is educational and should not replace professional medical advice.',
  },
];
