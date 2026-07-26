// BACKEND/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/doctors', doctorController.getDoctors);
router.get('/doctors/bookings', doctorController.getBookings);
router.get('/doctors/:id', doctorController.getDoctorById);
router.get('/specializations', doctorController.getSpecializations);
router.get('/featured-doctors', doctorController.getFeaturedDoctors);
router.get('/top-rated-doctors', doctorController.getTopRatedDoctors);
router.get('/doctors/:id/reviews', doctorController.getDoctorReviews);
router.post('/doctors/:id/reviews', doctorController.addDoctorReview);
router.get('/doctors/:id/availability', doctorController.getDoctorAvailability);
router.post('/doctors/sync', doctorController.syncDoctors);
router.post('/doctors/book', doctorController.bookConsultation);

module.exports = router;
