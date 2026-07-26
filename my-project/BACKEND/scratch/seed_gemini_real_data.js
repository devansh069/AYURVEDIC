// BACKEND/scratch/seed_gemini_real_data.js
require('dotenv').config();
const connectDB = require('../config/db');
const { getPool } = require('../config/db');
const { generateGeminiContent } = require('../config/gemini');

async function seedGeminiData() {
  console.log('🚀 Connecting to MySQL Database...');
  await connectDB();
  const pool = getPool();
  if (!pool) {
    console.error('❌ Could not connect to MySQL pool');
    return;
  }

  console.log('✨ Generating real-world clinical & scientific data using Gemini API...');

  // 1. Generate & update dynamic modern scientific data for top diseases in MySQL
  const [diseases] = await pool.query('SELECT id, name, category, shortDescription FROM diseases');
  console.log(`🔍 Found ${diseases.length} diseases in MySQL database.`);

  for (const dis of diseases.slice(0, 5)) {
    try {
      console.log(`🤖 Generating Gemini AI clinical perspective for disease: "${dis.name}"...`);
      const prompt = `Provide an authoritative, modern clinical & Ayurvedic research perspective for the disease "${dis.name}" (${dis.category}). 
Return a compact JSON object with keys:
"clinicalInsight": short 2-sentence summary of pathogenetic mechanisms,
"doshicPrimary": primary dosha involved (e.g. Pitta-Vata),
"keyHerbs": array of 3 top botanical remedies,
"dietaryRule": key dietary guideline.
Do NOT use markdown codeblock wrappers, return plain JSON text only.`;

      const aiResponse = await generateGeminiContent(prompt, "You are a senior clinical Ayurveda researcher.");
      if (aiResponse) {
        let cleanJson = aiResponse.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        
        await pool.query(
          'UPDATE diseases SET modernData = ? WHERE id = ?',
          [cleanJson, dis.id]
        );
        console.log(`✅ Updated "${dis.name}" with Gemini AI scientific data in MySQL.`);
      }
    } catch (e) {
      console.error(`⚠️ Could not generate AI data for ${dis.name}:`, e.message);
    }
  }

  // 2. Generate & update dynamic scientific insights for treatments in MySQL
  const [treatments] = await pool.query('SELECT id, name, category FROM treatments');
  console.log(`\n🔍 Found ${treatments.length} treatments in MySQL database.`);

  for (const trt of treatments.slice(0, 5)) {
    try {
      console.log(`🤖 Generating Gemini AI clinical protocol for treatment: "${trt.name}"...`);
      const prompt = `Provide modern therapeutic mechanism of action for the Ayurvedic treatment "${trt.name}".
Return a compact JSON object with keys:
"mechanismOfAction": 2 sentences explaining physiological effects,
"recommendedDuration": standard course duration,
"primaryBenefits": array of 3 therapeutic benefits.
Do NOT use markdown codeblock wrappers, return plain JSON text only.`;

      const aiResponse = await generateGeminiContent(prompt, "You are an expert Ayurvedic Panchakarma specialist.");
      if (aiResponse) {
        let cleanJson = aiResponse.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

        await pool.query(
          'UPDATE treatments SET modernData = ? WHERE id = ?',
          [cleanJson, trt.id]
        );
        console.log(`✅ Updated "${trt.name}" with Gemini AI clinical protocol in MySQL.`);
      }
    } catch (e) {
      console.error(`⚠️ Could not generate AI data for ${trt.name}:`, e.message);
    }
  }

  console.log('\n🎉 Real-world data generated via Gemini API and successfully saved into MySQL DB!');
  process.exit();
}

seedGeminiData();
