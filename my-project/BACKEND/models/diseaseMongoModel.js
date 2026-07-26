// BACKEND/models/diseaseMongoModel.js
// MongoDB Disease Schema and Model definitions using Mongoose.
const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const DiseaseSchema = new mongoose.Schema({
  diseaseName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  scientificName: { type: String, default: '' },
  alternativeNames: [{ type: String }],
  category: { type: String, required: true, index: true },
  subCategory: { type: String, default: '' },
  overview: { type: String, default: '' },
  description: { type: String, default: '' },
  causes: [{ type: String }],
  symptoms: [{ type: String }],
  earlySymptoms: [{ type: String }],
  advancedSymptoms: [{ type: String }],
  riskFactors: [{ type: String }],
  complications: [{ type: String }],
  prevention: [{ type: String }],
  homeRemedies: [{ type: String }],
  ayurvedicTreatment: { type: String, default: '' },
  modernTreatment: { type: String, default: '' },
  recommendedHerbs: [{ type: String }],
  recommendedMedicines: [{ type: String }],
  recommendedFoods: [{ type: String }],
  foodsToAvoid: [{ type: String }],
  recommendedYoga: [{ type: String }],
  recommendedExercises: [{ type: String }],
  dailyRoutine: { type: String, default: '' },
  sleepRecommendation: { type: String, default: '' },
  stressManagement: { type: String, default: '' },
  doshaAffected: [{ type: String }],
  bodyPartsAffected: [{ type: String }],
  ageGroup: { type: String, default: 'All' },
  gender: { type: String, default: 'All' },
  pregnancySafe: { type: Boolean, default: true },
  contagious: { type: Boolean, default: false },
  severity: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
  recoveryTime: { type: String, default: '' },
  consultDoctorWhen: { type: String, default: '' },
  emergencyWarning: { type: String, default: '' },
  successRate: { type: Number, default: 90 },
  FAQs: [FAQSchema],
  references: [{ type: String }],
  doctorSpecialization: { type: String, default: 'General Medicine' },
  relatedDiseases: [{ type: String }],
  featuredImage: { type: String, default: '' },
  galleryImages: [{ type: String }],
  videoLinks: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  totalViews: { type: Number, default: 0 },
  totalBookmarks: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disease', DiseaseSchema);
