// BACKEND/routes/treatmentRoutes.js
const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');

router.get('/treatments', treatmentController.getTreatments);
router.get('/treatments/:id', treatmentController.getTreatmentById);
router.get('/treatments/:id/doctors', treatmentController.getTreatmentDoctors);
router.get('/treatments/:id/faqs', treatmentController.getTreatmentFaqs);
router.get('/treatments/:id/recovery-timeline', treatmentController.getTreatmentRecoveryTimeline);
router.get('/treatments/:id/personalized-plan', treatmentController.getTreatmentPersonalizedPlan);
router.get('/treatment-categories', treatmentController.getTreatmentCategories);
router.get('/popular-treatments', treatmentController.getPopularTreatments);
router.get('/recommended-treatments', treatmentController.getRecommendedTreatments);

module.exports = router;
