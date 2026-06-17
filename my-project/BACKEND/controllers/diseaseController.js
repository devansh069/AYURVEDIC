// BACKEND/controllers/diseaseController.js
const { MOCK_DISEASE_CATEGORIES, MOCK_DISEASES } = require('../models/diseaseModel');

exports.getDiseaseCategories = (req, res, next) => {
  try {
    res.json(MOCK_DISEASE_CATEGORIES);
  } catch (err) {
    next(err);
  }
};

exports.getDiseases = (req, res, next) => {
  try {
    res.json(MOCK_DISEASES);
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseById = (req, res, next) => {
  try {
    const disease = MOCK_DISEASES.find(
      d => d.id === req.params.id || d.slug === req.params.id
    );
    if (disease) {
      res.json(disease);
    } else {
      res.status(404).json({ error: "Disease condition not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPopularDiseases = (req, res, next) => {
  try {
    const popular = MOCK_DISEASES.filter(d => 
      ["diabetes", "pcos", "arthritis", "migraine", "psoriasis"].includes(d.slug)
    );
    res.json(popular);
  } catch (err) {
    next(err);
  }
};
