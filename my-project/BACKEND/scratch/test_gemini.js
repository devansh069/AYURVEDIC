// BACKEND/scratch/test_gemini.js
require('dotenv').config();
const axios = require('axios');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing Gemini API key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

  const prompt = "Analyze these symptoms from an Ayurvedic perspective: acidity, heartburn, and skin rashes under Pitta-Kapha dosha.";
  
  const models = ['gemini-2.0-flash-001', 'gemini-3.5-flash', 'gemma-4-31b-it', 'gemini-3-flash-preview'];

  for (const model of models) {
    try {
      console.log(`\nTrying model: ${model}...`);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an expert Ayurvedic Vaidya doctor. Provide a concise, clear, and professional response in markdown for this prompt:\n\n${prompt}`
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        console.log(`✅ SUCCESS with ${model}!`);
        console.log('Gemini Response:\n', response.data.candidates[0].content.parts[0].text.substring(0, 300) + '...');
        return model;
      }
    } catch (err) {
      console.error(`❌ Error with ${model}:`, err.response ? (err.response.data.error ? err.response.data.error.message : err.response.data) : err.message);
    }
  }
}

testGemini();
