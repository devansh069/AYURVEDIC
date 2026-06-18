// BACKEND/routes/diseaseRoutes.js
const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/disease-categories', diseaseController.getDiseaseCategories);
router.get('/diseases', diseaseController.getDiseases);
router.get('/diseases/:id', diseaseController.getDiseaseById);
router.get('/popular-diseases', diseaseController.getPopularDiseases);

module.exports = router;
