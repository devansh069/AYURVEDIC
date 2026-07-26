// BACKEND/config/gemini.js
// Gemini AI API integration helper module.
const axios = require('axios');

const CANDIDATE_MODELS = [
  'gemini-3-flash-preview',
  'gemma-4-31b-it',
  'gemini-3.5-flash',
  'gemini-2.0-flash',
  'gemma-4-26b-a4b-it'
];

/**
 * Generates dynamic content from Google Gemini API.
 * @param {string} promptText - The prompt for Gemini AI
 * @param {string} systemInstruction - Optional system context (e.g., Vaidya persona)
 * @returns {Promise<string|null>} - Generated response text or null if failed
 */
async function generateGeminiContent(promptText, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not configured in process.env');
    return null;
  }

  const fullPrompt = systemInstruction 
    ? `${systemInstruction}\n\nUser Question/Request: ${promptText}`
    : promptText;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: fullPrompt }
              ]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 20000
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
        const resultText = response.data.candidates[0].content.parts[0].text;
        console.log(`🤖 Gemini AI generated response using model: ${model}`);
        return resultText;
      }
    } catch (err) {
      // Continue to next model if quota/404/rate limit encountered
      console.warn(`Gemini API model ${model} attempt info:`, err.response ? (err.response.data?.error?.message || err.response.statusText) : err.message);
    }
  }

  return null;
}

module.exports = {
  generateGeminiContent
};
