// BACKEND/routes/clinicRoutes.js
const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

router.get('/clinics', clinicController.getClinics);
router.get('/panchakarma-centers', clinicController.getPanchakarmaCenters);
router.get('/featured-clinics', clinicController.getFeaturedClinics);
router.get('/cities', clinicController.getCities);
router.get('/services', clinicController.getServices);
router.get('/clinics/:id', clinicController.getClinicById);
router.get('/clinics/:id/doctors', clinicController.getClinicDoctors);
router.get('/clinics/:id/services', clinicController.getClinicServices);
router.get('/clinics/:id/reviews', clinicController.getClinicReviews);
router.get('/clinics/:id/gallery', clinicController.getClinicGallery);
router.get('/clinics/:id/packages', clinicController.getClinicPackages);
router.get('/testimonials', clinicController.getTestimonials);

module.exports = router;
