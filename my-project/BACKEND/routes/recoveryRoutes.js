// BACKEND/routes/recoveryRoutes.js
const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.get('/recovery/profile', recoveryController.getRecoveryProfile);
router.get('/recovery/progress', recoveryController.getRecoveryProgress);
router.get('/recovery/symptoms', recoveryController.getRecoverySymptoms);
router.get('/recovery/milestones', recoveryController.getRecoveryMilestones);
router.get('/recovery/medications', recoveryController.getRecoveryMedications);
router.get('/recovery/lifestyle', recoveryController.getRecoveryLifestyle);
router.get('/recovery/charts', recoveryController.getRecoveryCharts);
router.get('/recovery/history', recoveryController.getRecoveryHistory);
router.post('/recovery/medications/:id/toggle', recoveryController.toggleMedication);
router.post('/recovery/journal/add', recoveryController.addJournalEntry);

module.exports = router;
