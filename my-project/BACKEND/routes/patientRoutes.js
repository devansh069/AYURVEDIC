// BACKEND/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/patient/profile', patientController.getPatientProfile);
router.get('/patient/dashboard', patientController.getPatientDashboard);
router.get('/patient/appointments', patientController.getPatientAppointments);
router.get('/patient/recovery', patientController.getPatientRecovery);
router.get('/patient/records', patientController.getPatientRecords);
router.get('/patient/notifications', patientController.getPatientNotifications);
router.get('/patient/wellness', patientController.getPatientWellness);
router.post('/patient/appointments/:id/cancel', patientController.cancelAppointment);
router.post('/patient/appointments/:id/reschedule', patientController.rescheduleAppointment);
router.post('/patient/records/upload', patientController.uploadPatientRecord);

// General Appointment Booking Endpoints handled by patient controller
router.get('/appointment-slots', patientController.getAppointmentSlots);
router.post('/appointments', patientController.createAppointment);

module.exports = router;
