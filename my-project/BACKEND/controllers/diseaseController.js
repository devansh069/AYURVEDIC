// BACKEND/controllers/diseaseController.js
// MongoDB Disease Controller using Mongoose with automatic mock in-memory fallback.
const mongoose = require('mongoose');
const Disease = require('../models/diseaseMongoModel');
const { MOCK_DISEASE_CATEGORIES, MOCK_DISEASES } = require('../models/diseaseModel');

// In-memory fallback dataset matching the MongoDB schema structure
let fallbackDiseases = MOCK_DISEASES.map((d, index) => ({
  _id: `fallback-dis-${index + 1}`,
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
  modernTreatment: 'Symptomatic control and lifestyle adaptation.',
  recommendedHerbs: d.recommendedHerbs || [],
  recommendedMedicines: ['Chandraprabha Vati', 'Triphala Guggulu'],
  recommendedFoods: d.dietRecommendations || [],
  foodsToAvoid: d.foodsToAvoid || [],
  recommendedYoga: d.lifestyleRecommendations || [],
  recommendedExercises: ['Brisk Walking', 'Yoga'],
  dailyRoutine: 'Wake up early, practice meditation, and consume warm water.',
  sleepRecommendation: '7-8 hours of sleep, avoiding day sleep.',
  stressManagement: 'Practice deep breathing, meditation and yoga.',
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
  totalBookmarks: 30 + index * 10,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Helper to filter in-memory fallback list
const filterFallbackDiseases = (queryOptions) => {
  let list = [...fallbackDiseases];
  const { search, category, severity, ageGroup, gender, recoveryTime, dosha, bodyPart, sort } = queryOptions;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d => 
      d.diseaseName.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.symptoms.some(s => s.toLowerCase().includes(q)) ||
      d.doshaAffected.some(ds => ds.toLowerCase().includes(q)) ||
      d.bodyPartsAffected.some(b => b.toLowerCase().includes(q))
    );
  }

  if (category) {
    list = list.filter(d => d.category === category);
  }

  if (severity) {
    list = list.filter(d => d.severity === severity);
  }

  if (ageGroup) {
    list = list.filter(d => d.ageGroup === ageGroup || d.ageGroup === 'All');
  }

  if (gender) {
    list = list.filter(d => d.gender === gender || d.gender === 'All');
  }

  if (dosha) {
    list = list.filter(d => d.doshaAffected.includes(dosha));
  }

  if (bodyPart) {
    list = list.filter(d => d.bodyPartsAffected.includes(bodyPart));
  }

  if (sort) {
    if (sort === 'Highest Rated') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'Most Viewed') {
      list.sort((a, b) => b.totalViews - a.totalViews);
    } else if (sort === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'Oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'Alphabetical') {
      list.sort((a, b) => a.diseaseName.localeCompare(b.diseaseName));
    }
  }

  return list;
};

// ─── API CONTROLLER FUNCTIONS ───

exports.getDiseaseCategories = async (req, res, next) => {
  try {
    // Categories can be dynamic or fallback
    res.json(MOCK_DISEASE_CATEGORIES);
  } catch (err) {
    next(err);
  }
};

exports.getDiseases = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      category = '', 
      severity = '', 
      ageGroup = '', 
      gender = '', 
      dosha = '', 
      bodyPart = '', 
      sort = 'Newest' 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isMongoConnected()) {
      const query = {};

      if (search) {
        query.$or = [
          { diseaseName: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { symptoms: { $regex: search, $options: 'i' } },
          { doshaAffected: { $regex: search, $options: 'i' } },
          { bodyPartsAffected: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) query.category = category;
      if (severity) query.severity = severity;
      if (ageGroup) query.ageGroup = ageGroup;
      if (gender) query.gender = gender;
      if (dosha) query.doshaAffected = dosha;
      if (bodyPart) query.bodyPartsAffected = bodyPart;

      let sortQuery = { createdAt: -1 };
      if (sort === 'Highest Rated') sortQuery = { rating: -1 };
      else if (sort === 'Most Viewed') sortQuery = { totalViews: -1 };
      else if (sort === 'Oldest') sortQuery = { createdAt: 1 };
      else if (sort === 'Alphabetical') sortQuery = { diseaseName: 1 };

      const total = await Disease.countDocuments(query);
      const items = await Disease.find(query)
        .sort(sortQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      res.json({
        success: true,
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    } else {
      // In-memory Fallback
      const filtered = filterFallbackDiseases(req.query);
      const total = filtered.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(startIndex, startIndex + limitNum);

      res.json({
        success: true,
        data: paginated,
        isFallback: true,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (isMongoConnected()) {
      const disease = await Disease.findOne({ slug });
      if (!disease) return res.status(404).json({ success: false, message: 'Disease not found' });
      
      // Increment views
      disease.totalViews += 1;
      await disease.save();
      
      res.json(disease);
    } else {
      const disease = fallbackDiseases.find(d => d.slug === slug);
      if (!disease) return res.status(404).json({ success: false, message: 'Disease not found' });
      disease.totalViews += 1;
      res.json(disease);
    }
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const disease = await Disease.findById(id);
      if (!disease) return res.status(404).json({ success: false, message: 'Disease not found' });
      res.json(disease);
    } else {
      const disease = fallbackDiseases.find(d => d._id === id);
      if (!disease) return res.status(404).json({ success: false, message: 'Disease not found' });
      res.json(disease);
    }
  } catch (err) {
    next(err);
  }
};

exports.searchDiseases = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    if (isMongoConnected()) {
      const items = await Disease.find({
        $or: [
          { diseaseName: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { symptoms: { $regex: q, $options: 'i' } },
          { doshaAffected: { $regex: q, $options: 'i' } },
          { bodyPartsAffected: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);
      res.json(items);
    } else {
      const filtered = filterFallbackDiseases({ search: q }).slice(0, 10);
      res.json(filtered);
    }
  } catch (err) {
    next(err);
  }
};

exports.getDiseasesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (isMongoConnected()) {
      const items = await Disease.find({ category });
      res.json(items);
    } else {
      const filtered = fallbackDiseases.filter(d => d.category.toLowerCase() === category.toLowerCase());
      res.json(filtered);
    }
  } catch (err) {
    next(err);
  }
};

exports.getPopularDiseases = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const items = await Disease.find().sort({ rating: -1, totalViews: -1 }).limit(6);
      res.json(items);
    } else {
      const sorted = [...fallbackDiseases].sort((a, b) => b.rating - a.rating).slice(0, 6);
      res.json(sorted);
    }
  } catch (err) {
    next(err);
  }
};

exports.getLatestDiseases = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const items = await Disease.find().sort({ createdAt: -1 }).limit(6);
      res.json(items);
    } else {
      const sorted = [...fallbackDiseases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      res.json(sorted);
    }
  } catch (err) {
    next(err);
  }
};

exports.getTrendingDiseases = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const items = await Disease.find().sort({ totalViews: -1, totalBookmarks: -1 }).limit(6);
      res.json(items);
    } else {
      const sorted = [...fallbackDiseases].sort((a, b) => b.totalViews - a.totalViews).slice(0, 6);
      res.json(sorted);
    }
  } catch (err) {
    next(err);
  }
};

exports.createDisease = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.slug) {
      body.slug = body.diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (isMongoConnected()) {
      const newDisease = new Disease(body);
      await newDisease.save();
      res.status(201).json({ success: true, data: newDisease });
    } else {
      const newId = `fallback-dis-${Date.now()}`;
      const newObj = {
        _id: newId,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      fallbackDiseases.unshift(newObj);
      res.status(201).json({ success: true, data: newObj, isFallback: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (body.diseaseName && !body.slug) {
      body.slug = body.diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (isMongoConnected()) {
      const updated = await Disease.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Disease not found' });
      res.json({ success: true, data: updated });
    } else {
      const index = fallbackDiseases.findIndex(d => d._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Disease not found' });
      
      fallbackDiseases[index] = {
        ...fallbackDiseases[index],
        ...body,
        updatedAt: new Date()
      };
      res.json({ success: true, data: fallbackDiseases[index], isFallback: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const deleted = await Disease.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Disease not found' });
      res.json({ success: true, data: deleted });
    } else {
      const index = fallbackDiseases.findIndex(d => d._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Disease not found' });
      const deleted = fallbackDiseases.splice(index, 1);
      res.json({ success: true, data: deleted[0], isFallback: true });
    }
  } catch (err) {
    next(err);
  }
};
