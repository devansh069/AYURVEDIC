// BACKEND/routes/dietRoutes.js
const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

router.get('/diet/profile', dietController.getDietProfile);
router.get('/diet/plans', dietController.getDietPlans);
router.get('/diet/recommendations', dietController.getDietRecommendations);
router.get('/diet/meals', dietController.getDietMeals);
router.get('/diet/nutrition', dietController.getDietNutrition);
router.get('/diet/history', dietController.getDietHistory);
router.post('/diet/generate-plan', dietController.generateDietPlan);

module.exports = router;
