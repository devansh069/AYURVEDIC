// BACKEND/routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.get('/records', recordController.getRecords);
router.get('/records/:id', recordController.getRecordById);
router.get('/prescriptions', recordController.getPrescriptions);
router.get('/reports', recordController.getReports);
router.get('/lab-tests', recordController.getLabTests);
router.get('/treatment-history', recordController.getTreatmentHistory);
router.get('/activities', recordController.getActivities);
router.get('/insights', recordController.getInsights);
router.post('/records/upload', recordController.uploadRecord);
router.delete('/records/:id', recordController.deleteRecord);

module.exports = router;
