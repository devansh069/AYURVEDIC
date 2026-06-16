import { ChatMessage } from '../types';


export const chatApi = {
  async sendMessage(message: string, history: ChatMessage[]): Promise<{ data: ChatMessage; isFallback: boolean }> {
      // Use the mock engine from aiApi
      const { default: aiApi } = await import('./aiApi');
      return aiApi.sendMessage(message);
  },

  async getChatHistory(): Promise<{ data: ChatMessage[]; isFallback: boolean }> {
      const { MOCK_CHAT_HISTORY_LOCAL } = await import('./aiApi');
      return { data: MOCK_CHAT_HISTORY_LOCAL, isFallback: true };
  },
};

export default chatApi;



