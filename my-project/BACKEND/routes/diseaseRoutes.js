// BACKEND/routes/diseaseRoutes.js
const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/disease-categories', diseaseController.getDiseaseCategories);
router.get('/diseases/search', diseaseController.searchDiseases);
router.get('/diseases/popular', diseaseController.getPopularDiseases);
router.get('/diseases/latest', diseaseController.getLatestDiseases);
router.get('/diseases/trending', diseaseController.getTrendingDiseases);
router.get('/diseases/category/:category', diseaseController.getDiseasesByCategory);
router.get('/diseases/:slug', diseaseController.getDiseaseBySlug);
router.get('/diseases', diseaseController.getDiseases);

router.post('/diseases', diseaseController.createDisease);
router.put('/diseases/:id', diseaseController.updateDisease);
router.delete('/diseases/:id', diseaseController.deleteDisease);

module.exports = router;
