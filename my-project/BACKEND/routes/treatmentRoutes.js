// BACKEND/routes/treatmentRoutes.js
const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');

router.get('/treatment-categories', treatmentController.getTreatmentCategories);
router.get('/treatments', treatmentController.getTreatments);
router.post('/treatments', treatmentController.createTreatment);
router.get('/treatments/bookings', treatmentController.getBookings);
router.get('/treatments/:id', treatmentController.getTreatmentById);
router.put('/treatments/:id', treatmentController.updateTreatment);
router.delete('/treatments/:id', treatmentController.deleteTreatment);
router.get('/popular-treatments', treatmentController.getPopularTreatments);
router.get('/recommended-treatments', treatmentController.getRecommendedTreatments);
router.post('/treatments/sync', treatmentController.syncTreatments);
router.post('/treatments/book', treatmentController.bookTreatment);

module.exports = router;
