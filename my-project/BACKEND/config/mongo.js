// BACKEND/config/mongo.js
// MongoDB/Mongoose connector module with automatic seeding for the Disease Page.
const mongoose = require('mongoose');

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ayurveda';
  try {
    console.log('📡 Connecting to MongoDB database...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB Connected and Initialized Successfully.');
    
    // Auto seed MongoDB if collection is empty
    await seedMongoDiseases();
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.log('⚠️ Running in MongoDB mock-fallback mode. Ensure local mongodb or MONGO_URI is active.');
  }
};

const seedMongoDiseases = async () => {
  try {
    const Disease = require('../models/diseaseMongoModel');
    const count = await Disease.countDocuments();
    if (count === 0) {
      console.log('🌱 MongoDB Disease collection is empty. Auto-seeding from MOCK_DISEASES...');
      const { MOCK_DISEASES } = require('../models/diseaseModel');
      
      const mongoSeedData = MOCK_DISEASES.map((d, index) => ({
        diseaseName: d.name,
        slug: d.slug,
        scientificName: d.name === 'Diabetes' ? 'Diabetes mellitus' : d.name === 'PCOS' ? 'Polycystic ovary syndrome' : d.name === 'Arthritis' ? 'Osteoarthritis' : '',
        alternativeNames: d.name === 'Diabetes' ? ['Madhumeha'] : d.name === 'PCOS' ? ['Artava Srotas Blockage'] : [],
        category: d.category,
        subCategory: d.category,
        overview: d.shortDescription,
        description: d.ayurvedicPerspective,
        causes: d.causes || [],
        symptoms: d.symptoms || [],
        earlySymptoms: (d.symptoms || []).slice(0, 2),
        advancedSymptoms: (d.symptoms || []).slice(2),
        riskFactors: ['Sedentary lifestyle', 'Stress'],
        complications: ['Chronic fatigue'],
        prevention: d.lifestyleRecommendations || [],
        homeRemedies: d.dietRecommendations || [],
        ayurvedicTreatment: Array.isArray(d.treatments) ? d.treatments.join('. ') : d.treatments,
        modernTreatment: 'Symptomatic control and general lifestyle alterations.',
        recommendedHerbs: d.recommendedHerbs || [],
        recommendedMedicines: ['Chandraprabha Vati', 'Triphala Guggulu'],
        recommendedFoods: d.dietRecommendations || [],
        foodsToAvoid: d.foodsToAvoid || [],
        recommendedYoga: d.lifestyleRecommendations || [],
        recommendedExercises: ['Brisk Walking', 'Yoga'],
        dailyRoutine: 'Wake up early, practice meditation, and consume warm water.',
        sleepRecommendation: '7-8 hours of sleep, avoiding day sleep.',
        stressManagement: 'Practice deep breathing, meditation and restorative yoga.',
        doshaAffected: d.name === 'Diabetes' ? ['Kapha', 'Pitta'] : ['Vata'],
        bodyPartsAffected: ['Joints', 'Systemic'],
        ageGroup: 'All',
        gender: 'All',
        pregnancySafe: true,
        contagious: false,
        severity: d.severity || 'Moderate',
        recoveryTime: '3-6 months',
        consultDoctorWhen: 'If symptoms persist or worsen.',
        emergencyWarning: 'Severe discomfort or high fever.',
        successRate: 85,
        FAQs: (d.faq || []).map(f => ({ question: f.question, answer: f.answer })),
        references: ['Classical Ayurvedic texts', 'Modern clinical trials'],
        doctorSpecialization: d.name === 'Diabetes' ? 'Metabolic Specialist' : d.name === 'PCOS' ? 'Gynaecologist' : 'General Ayurveda Practitioner',
        relatedDiseases: [],
        featuredImage: d.image || '',
        galleryImages: [d.image || ''],
        videoLinks: [],
        rating: 4.8,
        totalViews: 120 + index * 45,
        totalBookmarks: 30 + index * 10
      }));

      await Disease.insertMany(mongoSeedData);
      console.log(`✅ Successfully auto-seeded ${mongoSeedData.length} diseases to MongoDB!`);
    }
  } catch (err) {
    console.error('❌ Failed to seed MongoDB diseases:', err.message);
  }
};

module.exports = connectMongo;
