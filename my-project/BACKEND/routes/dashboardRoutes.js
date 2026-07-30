const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Patient Dashboard Routes
router.get('/patient/dashboard', dashboardController.getPatientDashboard);
router.put('/patient/profile', dashboardController.updateProfile);
router.get('/patient/appointments', dashboardController.getAppointments);
router.post('/patient/appointments/:id/cancel', dashboardController.cancelAppointment);
router.post('/patient/appointments/:id/reschedule', dashboardController.rescheduleAppointment);
router.get('/patient/recovery', dashboardController.getRecoveryProgress);
router.post('/patient/recovery/log', dashboardController.logProgressPoint);
router.post('/patient/wellness', dashboardController.updateWellness);
router.get('/patient/diet', dashboardController.getDietPlan);
router.post('/patient/diet', dashboardController.saveDietPlan);
router.get('/patient/notifications', dashboardController.getNotifications);
router.post('/patient/notifications/:id/read', dashboardController.markNotificationRead);
router.get('/patient/chat', dashboardController.getChatHistory);
router.post('/patient/chat', dashboardController.postChatMessage);
router.post('/patient/medical-records', dashboardController.uploadMedicalRecord);

// Doctor Dashboard Routes
router.get('/doctor/dashboard/:id', dashboardController.getDoctorDashboard);
router.put('/doctor/profile/:id', dashboardController.updateDoctorProfile);
router.post('/doctor/appointments/:id/status', dashboardController.updateAppointmentStatus);

module.exports = router;
