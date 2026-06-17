// BACKEND/routes/doshaRoutes.js
const express = require('express');
const router = express.Router();
const doshaController = require('../controllers/doshaController');

router.get('/dosha/questions', doshaController.getDoshaQuestions);
router.post('/dosha/analyze', doshaController.analyzeDosha);
router.get('/dosha/results/:id', doshaController.getDoshaResultById);
router.get('/dosha/recommendations', doshaController.getDoshaRecommendations);

module.exports = router;
