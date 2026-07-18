// BACKEND/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Live patient dashboard and operations are handled in dashboardRoutes.js
// General Appointment Booking Endpoints handled by patient controller

// General Appointment Booking Endpoints handled by patient controller
router.get('/appointment-slots', patientController.getAppointmentSlots);
router.post('/appointments', patientController.createAppointment);

module.exports = router;
