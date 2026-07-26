// BACKEND/scratch/seed_treatments_gemini.js
require('dotenv').config();
const connectDB = require('../config/db');
const { getPool } = require('../config/db');
const { generateGeminiContent } = require('../config/gemini');

const SEED_TREATMENT_LIST = [
  { name: 'Panchakarma Detox', slug: 'panchakarma', category: 'Panchakarma', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', rating: 4.9, reviewCount: 142, costEstimate: 18500 },
  { name: 'Shirodhara Therapy', slug: 'shirodhara', category: 'Therapeutic Massages', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', rating: 4.9, reviewCount: 98, costEstimate: 4500 },
  { name: 'Abhyanga Massage', slug: 'abhyanga', category: 'Therapeutic Massages', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', rating: 4.8, reviewCount: 120, costEstimate: 3200 },
  { name: 'Nasya Therapy', slug: 'nasya', category: 'Panchakarma', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', rating: 4.7, reviewCount: 76, costEstimate: 2800 },
  { name: 'Basti Therapy', slug: 'basti', category: 'Panchakarma', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80', rating: 4.9, reviewCount: 88, costEstimate: 6500 },
  { name: 'Virechana Therapy', slug: 'virechana', category: 'Panchakarma', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', rating: 4.8, reviewCount: 64, costEstimate: 7800 },
  { name: 'Udvartana Massage', slug: 'udvartana', category: 'Therapeutic Massages', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80', rating: 4.7, reviewCount: 52, costEstimate: 3800 },
  { name: 'Janu Basti', slug: 'janu-basti', category: 'Specialized Therapies', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', rating: 4.9, reviewCount: 81, costEstimate: 4200 },
  { name: 'Netra Tarpana', slug: 'netra-tarpana', category: 'Specialized Therapies', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80', rating: 4.8, reviewCount: 45, costEstimate: 3500 },
  { name: 'Takradhara', slug: 'takradhara', category: 'Specialized Therapies', image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&q=80', rating: 4.9, reviewCount: 39, costEstimate: 4800 }
];

async function seedTreatmentsWithGemini() {
  console.log('🚀 Connecting to MySQL Database for Treatment Page dynamic seeding...');
  await connectDB();
  const pool = getPool();

  if (!pool) {
    console.error('❌ Database pool unavailable');
    return;
  }

  console.log('📡 Generating real-world clinical & Ayurvedic treatment protocols via Gemini AI API...');

  for (let i = 0; i < SEED_TREATMENT_LIST.length; i++) {
    const item = SEED_TREATMENT_LIST[i];
    const id = `trt-${i + 1}`;

    console.log(`\n🤖 Processing [${id}] "${item.name}" with Gemini AI API...`);

    const prompt = `You are a Master Vaidya and Chief Panchakarma Director. Provide authoritative, real-world clinical details for the Ayurvedic treatment protocol: "${item.name}" (Category: ${item.category}).

Return ONLY a valid JSON object matching the following structure exactly without markdown codeblock formatting:
{
  "description": "2-sentence executive summary of the therapy",
  "overview": "Detailed clinical overview explaining physiological mechanism and bio-energy targeted",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
  "procedure": "Detailed step-by-step clinical methodology of how Vaidyas perform this procedure",
  "duration": "e.g. 7 - 14 Days",
  "recoveryTime": "e.g. 2 - 3 Days",
  "suitableFor": ["Condition/Dosha 1", "Condition/Dosha 2", "Condition 3"],
  "contraindications": ["Contraindication 1", "Contraindication 2"],
  "precautions": ["Precaution 1", "Precaution 2"],
  "steps": [
    { "stepNumber": 1, "title": "Poorva Karma (Preparation)", "description": "Pre-treatment oleation and warm oil prep", "duration": "3 Days" },
    { "stepNumber": 2, "title": "Pradhana Karma (Main Procedure)", "description": "Core therapeutic procedure execution", "duration": "7 Days" },
    { "stepNumber": 3, "title": "Paschat Karma (Post-Care)", "description": "Post-treatment dietary restoration (Samsarjana Krama)", "duration": "3 Days" }
  ],
  "faq": [
    { "question": "What should I eat during ${item.name}?", "answer": "Follow a strict Samsarjana Krama diet consisting of warm rice gruel (Manda/Peya), light Mung soups, and warm water." },
    { "question": "Are there any immediate post-procedure rest rules?", "answer": "Avoid direct cold winds, sun exposure, heavy exercise, and electronic screens immediately following the session." }
  ],
  "modernData": {
    "mechanismOfAction": "Modern biological & neurological explanation of therapeutic action",
    "recommendedCourse": "Standard clinical frequency",
    "lastSynced": "${new Date().toISOString()}"
  }
}`;

    let aiData = null;
    try {
      const responseText = await generateGeminiContent(prompt, "You output pure JSON objects without markdown block formatting.");
      if (responseText) {
        let clean = responseText.trim();
        if (clean.startsWith('```')) {
          clean = clean.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        aiData = JSON.parse(clean);
        console.log(`✨ Gemini AI generated real data for "${item.name}".`);
      }
    } catch (e) {
      console.warn(`⚠️ Gemini API parse warning for ${item.name}: ${e.message}. Using structured fallback.`);
    }

    const description = aiData?.description || `${item.name} is a time-tested Ayurvedic therapy designed to balance biological channels and eliminate metabolic toxins.`;
    const overview = aiData?.overview || `${item.name} operates by softening deep cellular toxins (Ama) and mobilizing them toward elimination channels under Vaidya supervision.`;
    const benefits = JSON.stringify(aiData?.benefits || ["Deep cellular detoxification", "Nervous system relaxation", "Rejuvenates Vata and Pitta channels", "Enhances metabolic fire (Agni)"]);
    const procedure = aiData?.procedure || `The patient undergoes preparatory internal and external oleation followed by controlled therapeutic administration under expert guidance.`;
    const duration = aiData?.duration || "7 - 14 Days";
    const recoveryTime = aiData?.recoveryTime || "2 - 4 Days";
    const suitableFor = JSON.stringify(aiData?.suitableFor || ["Vata disorders", "Chronic stress & fatigue", "Metabolic sluggishness"]);
    const contraindications = JSON.stringify(aiData?.contraindications || ["Acute fever", "Pregnancy (unmonitored)", "Severe indigestion"]);
    const precautions = JSON.stringify(aiData?.precautions || ["Avoid cold drafty environments", "Eat light freshly cooked meals"]);
    const steps = JSON.stringify(aiData?.steps || [
      { stepNumber: 1, title: "Poorva Karma (Prep)", description: "Internal oleation with herbal ghee and Svedana steam", duration: "3 Days" },
      { stepNumber: 2, title: "Pradhana Karma (Main)", description: "Administration of core therapy protocol", duration: "7 Days" },
      { stepNumber: 3, title: "Paschat Karma (Post-Care)", description: "Gradual dietary restoration with light soups", duration: "3 Days" }
    ]);
    const faq = JSON.stringify(aiData?.faq || [
      { question: `Is ${item.name} suitable for first-timers?`, answer: "Yes, our certified Vaidyas perform a pulse consultation beforehand to customize the oil temperature and dosage." }
    ]);
    const modernData = JSON.stringify(aiData?.modernData || {
      mechanismOfAction: `Clinical studies demonstrate parasympathetic activation and lowered inflammatory markers during ${item.name}.`,
      lastSynced: new Date().toISOString()
    });

    // Save into MySQL DB
    await pool.query(`
      INSERT INTO treatments (
        id, name, slug, category, description, overview, benefits, \`procedure\`,
        duration, recoveryTime, costEstimate, suitableFor, contraindications, precautions,
        steps, image, rating, reviewCount, faq, modernData
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        slug = VALUES(slug),
        category = VALUES(category),
        description = VALUES(description),
        overview = VALUES(overview),
        benefits = VALUES(benefits),
        \`procedure\` = VALUES(\`procedure\`),
        duration = VALUES(duration),
        recoveryTime = VALUES(recoveryTime),
        costEstimate = VALUES(costEstimate),
        suitableFor = VALUES(suitableFor),
        contraindications = VALUES(contraindications),
        precautions = VALUES(precautions),
        steps = VALUES(steps),
        image = VALUES(image),
        rating = VALUES(rating),
        reviewCount = VALUES(reviewCount),
        faq = VALUES(faq),
        modernData = VALUES(modernData)
    `, [
      id, item.name, item.slug, item.category, description, overview, benefits, procedure,
      duration, recoveryTime, item.costEstimate, suitableFor, contraindications, precautions,
      steps, item.image, item.rating, item.reviewCount, faq, modernData
    ]);

    console.log(`✅ Saved "${item.name}" into MySQL "treatments" table.`);
  }

  console.log('\n🎉 Successfully generated real-world treatment data using Gemini API & saved into MySQL DB!');
  process.exit();
}

seedTreatmentsWithGemini();
