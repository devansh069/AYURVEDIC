// recommendationApi.ts — Pure mock-data service (no backend required)
import { AITreatmentRec, AIRecommendationCard, AINotificationItem, AIWellnessTask } from '../types';

export const MOCK_TREATMENT_RECS_LOCAL: AITreatmentRec[] = [
  { id: 'tr-1', treatmentName: 'Shirodhara', benefits: ['Stress relief', 'Mental clarity', 'Better sleep', 'Headache relief'], estimatedDuration: '45-60 minutes per session', recommendedDoctor: 'Dr. Arun Sharma', confidence: 92 },
  { id: 'tr-2', treatmentName: 'Abhyanga', benefits: ['Improved circulation', 'Joint flexibility', 'Skin nourishment', 'Toxin removal'], estimatedDuration: '60-90 minutes per session', recommendedDoctor: 'Dr. Meera Patel', confidence: 88 },
  { id: 'tr-3', treatmentName: 'Nasya Therapy', benefits: ['Sinus relief', 'Mental clarity', 'Improved breathing', 'Headache prevention'], estimatedDuration: '30 minutes per session', recommendedDoctor: 'Dr. Vikram Singh', confidence: 85 },
  { id: 'tr-4', treatmentName: 'Basti Therapy', benefits: ['Digestive health', 'Vata balance', 'Joint pain relief', 'Detoxification'], estimatedDuration: '5-7 day program', recommendedDoctor: 'Dr. Priya Nair', confidence: 90 },
];

export const MOCK_RECOMMENDATION_CARDS_LOCAL: AIRecommendationCard[] = [
  { id: 'rc-1', title: 'Ayurvedic Diet Guide', description: 'Personalized nutrition based on your Dosha for optimal health and energy.', category: 'Diet', icon: '🥗', tips: ['Eat seasonal fruits', 'Cook with ghee and turmeric', 'Avoid processed foods'] },
  { id: 'rc-2', title: 'Dinacharya Routine', description: 'Daily lifestyle practices rooted in Ayurvedic wisdom for balance and vitality.', category: 'Lifestyle', icon: '🌅', tips: ['Wake before sunrise', 'Practice oil pulling', 'Eat meals at fixed times'] },
  { id: 'rc-3', title: 'Yoga for Your Dosha', description: 'Dosha-specific yoga sequences to restore physical and mental equilibrium.', category: 'Exercise', icon: '🧘', tips: ['Vata: Grounding poses', 'Pitta: Cooling sequences', 'Kapha: Energizing flows'] },
  { id: 'rc-4', title: 'Dhyana Meditation', description: 'Ancient meditation techniques for inner peace, focus, and spiritual growth.', category: 'Meditation', icon: '🕯️', tips: ['Start with 10 minutes daily', 'Focus on breath awareness', 'Practice at sunrise'] },
  { id: 'rc-5', title: 'Ratricharya Sleep Guide', description: 'Ayurvedic sleep protocols for deep restoration and rejuvenation.', category: 'Sleep', icon: '🌙', tips: ['Sleep by 10 PM', 'Warm milk with nutmeg', 'Foot massage with sesame oil'] },
];

export const MOCK_NOTIFICATIONS_LOCAL: AINotificationItem[] = [
  { id: 'n-1', title: 'Morning Hydration', message: 'Start your day with warm lemon water to activate Agni.', type: 'Health', time: '7:00 AM', read: false },
  { id: 'n-2', title: 'Lunch Reminder', message: 'Eat your largest meal between 12-1 PM when digestive fire is strongest.', type: 'Diet', time: '12:00 PM', read: false },
  { id: 'n-3', title: 'Dr. Sharma Follow-up', message: 'Your follow-up consultation is scheduled for tomorrow at 10 AM.', type: 'Appointment', time: '5:00 PM', read: true },
  { id: 'n-4', title: 'Evening Yoga', message: 'Time for your Dosha-balancing yoga practice. 20 minutes recommended.', type: 'Health', time: '6:00 PM', read: false },
];

export const MOCK_WELLNESS_TASKS_LOCAL: AIWellnessTask[] = [
  { id: 'wt-1', task: 'Drink 8 glasses of warm water', icon: '💧', completed: true, time: 'Throughout day' },
  { id: 'wt-2', task: 'Morning meditation (15 min)', icon: '🧘', completed: true, time: '6:00 AM' },
  { id: 'wt-3', task: 'Yoga practice (30 min)', icon: '🤸', completed: false, time: '7:00 AM' },
  { id: 'wt-4', task: 'Eat Dosha-balanced meals', icon: '🍽️', completed: false, time: 'Meals' },
  { id: 'wt-5', task: 'Sleep by 10 PM', icon: '😴', completed: false, time: '10:00 PM' },
];

export const recommendationApi = {
  async getTreatmentRecs(): Promise<{ data: AITreatmentRec[]; isFallback: boolean }> {
    return { data: MOCK_TREATMENT_RECS_LOCAL, isFallback: true };
  },
  async getRecommendationCards(): Promise<{ data: AIRecommendationCard[]; isFallback: boolean }> {
    return { data: MOCK_RECOMMENDATION_CARDS_LOCAL, isFallback: true };
  },
  async getNotifications(): Promise<{ data: AINotificationItem[]; isFallback: boolean }> {
    return { data: MOCK_NOTIFICATIONS_LOCAL, isFallback: true };
  },
  async getWellnessTasks(): Promise<{ data: AIWellnessTask[]; isFallback: boolean }> {
    return { data: MOCK_WELLNESS_TASKS_LOCAL, isFallback: true };
  },
};

export default recommendationApi;
