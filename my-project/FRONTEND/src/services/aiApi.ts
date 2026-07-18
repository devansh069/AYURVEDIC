// src/services/aiApi.ts
// Live AI API for the AI Health Guidance page connected to MySQL.

import axios from 'axios';
import { ChatMessage, AIResponse, AIDoshaInsight, AIHealthTip, AIConversationRecord, AIBookmark } from '../types';

const client = axios.create({
  baseURL: 'http://localhost:5174/api',
  timeout: 25000
});

const getAuthHeaders = () => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      return {
        'x-user-id': parsed.profile.id,
        'x-user-role': parsed.role
      };
    } catch (e) {
      console.error('Error reading auth headers', e);
    }
  }
  return {};
};

// Helper to simulate async delay (optional for UX)
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Mock AI Response Engine ───
const KEYWORD_RESPONSES: Record<string, string> = {
  dosha: `**Understanding Your Dosha**\n\nIn Ayurveda, Dosha refers to the three fundamental bio-energies that govern our body:\n\n- **Vata** (Air + Space): Controls movement, breathing, and nervous system\n- **Pitta** (Fire + Water): Governs digestion, metabolism, and transformation\n- **Kapha** (Earth + Water): Manages structure, lubrication, and stability\n\nEach person has a unique combination of these doshas. Knowing your dominant dosha helps personalize your diet, lifestyle, and treatments.\n\n*Take our Dosha Analysis quiz for a detailed assessment!*`,
};

function generateMockResponse(question: string): string {
  const lower = question.toLowerCase();
  for (const [keyword, response] of Object.entries(KEYWORD_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return `**Ayurvedic Wellness Guidance**\n\nThank you for your question about "${question}".\n\nBased on Ayurvedic principles, here are some general recommendations:\n\n🌿 **Diet:** Follow a balanced diet suited to your Dosha constitution\n🧘 **Lifestyle:** Maintain a consistent daily routine (Dinacharya)\n💊 **Herbs:** Consider Triphala, Ashwagandha, and Tulsi for overall wellness\n🏥 **Consultation:** For personalized guidance, consult with our Ayurvedic practitioners\n\n*This is general guidance. For specific conditions, please consult a qualified Ayurvedic doctor.*`;
}

// ─── Local Mock Data ───
export const MOCK_CHAT_HISTORY_LOCAL: ChatMessage[] = [
  { id: 'msg-1', role: 'assistant', message: '🙏 Namaste! I am your AI Ayurveda Health Advisor. How can I help you today? Ask me about Dosha analysis, diet recommendations, treatment suggestions, or general wellness guidance.', timestamp: new Date(Date.now() - 300000).toISOString() },
];

export const MOCK_SUGGESTIONS_LOCAL: string[] = [
  'What is my Dosha?',
  'Suggest a diet for Vata.',
  'Best treatment for stress?',
  'How can I improve digestion?',
  'Ayurveda tips for better sleep?',
  'Tell me about Panchakarma.',
  'Yoga recommendations for Pitta.',
  'Meditation techniques in Ayurveda.',
];

export const MOCK_DOSHA_INSIGHTS_LOCAL: AIDoshaInsight[] = [
  {
    id: 'di-1', doshaType: 'Vata', description: 'Vata governs movement and communication. When balanced, it promotes creativity and flexibility.',
    strengths: ['Creative thinking', 'Quick learning', 'Energetic', 'Adaptable'],
    imbalances: ['Anxiety', 'Dry skin', 'Insomnia', 'Irregular digestion'],
    recommendedActions: ['Follow regular routines', 'Warm oil massage daily', 'Eat warm, grounding foods', 'Practice gentle yoga']
  },
  {
    id: 'di-2', doshaType: 'Pitta', description: 'Pitta governs transformation and metabolism. When balanced, it promotes intelligence and courage.',
    strengths: ['Strong digestion', 'Sharp intellect', 'Natural leaders', 'Good concentration'],
    imbalances: ['Inflammation', 'Heartburn', 'Irritability', 'Skin rashes'],
    recommendedActions: ['Eat cooling foods', 'Avoid excessive heat', 'Practice calming meditation', 'Moonlight walks']
  },
  {
    id: 'di-3', doshaType: 'Kapha', description: 'Kapha governs structure and stability. When balanced, it promotes love, calmness, and forgiveness.',
    strengths: ['Strong immunity', 'Calm temperament', 'Good memory', 'Steady energy'],
    imbalances: ['Weight gain', 'Congestion', 'Lethargy', 'Water retention'],
    recommendedActions: ['Regular vigorous exercise', 'Light, warm meals', 'Wake early before sunrise', 'Dry brushing']
  }
];

export const MOCK_HEALTH_TIPS_LOCAL: AIHealthTip[] = [
  { id: 'ht-1', title: 'Morning Warm Water Ritual', description: 'Start your day with a glass of warm water and lemon to ignite digestive fire (Agni) and flush toxins.', category: 'Daily', icon: '💧' },
  { id: 'ht-2', title: 'Seasonal Cleanse (Ritucharya)', description: 'Align your diet with seasons. Summer calls for cooling foods like cucumber, mint, and coconut water.', category: 'Seasonal', icon: '🌸' },
  { id: 'ht-3', title: 'Stress-Busting Ashwagandha', description: 'Take Ashwagandha root extract (300-500mg) daily for natural adaptogenic stress relief and mental clarity.', category: 'Stress', icon: '🧘' },
  { id: 'ht-4', title: 'Triphala Before Bed', description: 'A teaspoon of Triphala powder in warm water before bed gently detoxes and improves bowel regularity.', category: 'Digestive', icon: '🌿' },
];

export const MOCK_CONVERSATIONS_LOCAL: AIConversationRecord[] = [
  { id: 'conv-1', title: 'Dosha Analysis Discussion', date: '2026-06-10', messageCount: 8, lastMessage: 'Your Pitta-Vata constitution suggests...', category: 'Dosha' },
  { id: 'conv-2', title: 'Diet Plan for PCOS', date: '2026-06-08', messageCount: 12, lastMessage: 'Include bitter gourd and fenugreek...', category: 'Diet' },
];

export const MOCK_BOOKMARKS_LOCAL: AIBookmark[] = [
  { id: 'bk-1', title: 'Pitta Cooling Diet', content: 'Favor coconut, cucumber, mint, and sweet fruits. Avoid spicy, sour, and fermented foods.', type: 'Advice', savedDate: '2026-06-10' },
  { id: 'bk-2', title: 'Abhyanga Oil Massage', content: 'Use warm sesame oil for Vata, coconut oil for Pitta, and mustard oil for Kapha types.', type: 'Tip', savedDate: '2026-06-08' },
];

// ─── API Functions connected to Backend ───
export const aiApi = {
  async getHistory() {
    try {
      const response = await client.get('/patient/chat', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        const mapped = response.data.data.map((m: any) => ({
          id: m.id,
          role: m.sender === 'patient' ? 'user' : 'assistant',
          message: m.text,
          timestamp: new Date().toISOString()
        }));
        return { data: mapped.length > 0 ? mapped : MOCK_CHAT_HISTORY_LOCAL, isFallback: false };
      }
      throw new Error('Failed to load chat history from backend');
    } catch (err: any) {
      console.warn('Backend getHistory failed, using local mock:', err.message);
      return { data: MOCK_CHAT_HISTORY_LOCAL, isFallback: true };
    }
  },

  async getSuggestions() {
    await simulateDelay(100);
    return { data: MOCK_SUGGESTIONS_LOCAL, isFallback: false };
  },

  async sendMessage(question: string) {
    try {
      const response = await client.post('/patient/chat', { text: question }, { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        const { aiResponse } = response.data.data;
        const mapped: ChatMessage = {
          id: aiResponse.id,
          role: 'assistant',
          message: aiResponse.text,
          timestamp: new Date().toISOString()
        };
        return { data: mapped, isFallback: false };
      }
      throw new Error('Failed to post message to backend');
    } catch (err: any) {
      console.warn('Backend sendMessage failed, using local mock:', err.message);
      const mockReply: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        message: generateMockResponse(question),
        timestamp: new Date().toISOString(),
      };
      return { data: mockReply, isFallback: true };
    }
  },

  async getDoshaInsights() {
    await simulateDelay(100);
    return { data: MOCK_DOSHA_INSIGHTS_LOCAL, isFallback: false };
  },

  async getHealthTips() {
    await simulateDelay(100);
    return { data: MOCK_HEALTH_TIPS_LOCAL, isFallback: false };
  },

  async getConversations() {
    await simulateDelay(100);
    return { data: MOCK_CONVERSATIONS_LOCAL, isFallback: false };
  },

  async getBookmarks() {
    await simulateDelay(100);
    return { data: MOCK_BOOKMARKS_LOCAL, isFallback: false };
  },
};

export default aiApi;
