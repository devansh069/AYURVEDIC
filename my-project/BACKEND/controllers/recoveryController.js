// BACKEND/controllers/recoveryController.js
const { 
  MOCK_RECOVERY_PROFILE, 
  MOCK_RECOVERY_PROGRESS_POINTS, 
  MOCK_RECOVERY_SYMPTOMS, 
  MOCK_RECOVERY_MILESTONES, 
  MOCK_RECOVERY_MEDICATIONS, 
  MOCK_RECOVERY_LIFESTYLE, 
  MOCK_RECOVERY_WELLNESS_SCORE, 
  MOCK_RECOVERY_ACHIEVEMENTS, 
  MOCK_RECOVERY_JOURNAL 
} = require('../models/recoveryModel');

exports.getRecoveryProfile = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_PROFILE);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryProgress = (req, res, next) => {
  try {
    res.json({
      profile: MOCK_RECOVERY_PROFILE,
      progressPoints: MOCK_RECOVERY_PROGRESS_POINTS,
      symptoms: MOCK_RECOVERY_SYMPTOMS,
      milestones: MOCK_RECOVERY_MILESTONES,
      medications: MOCK_RECOVERY_MEDICATIONS,
      lifestyle: MOCK_RECOVERY_LIFESTYLE,
      wellnessScore: MOCK_RECOVERY_WELLNESS_SCORE,
      achievements: MOCK_RECOVERY_ACHIEVEMENTS,
      journal: MOCK_RECOVERY_JOURNAL
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecoverySymptoms = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_SYMPTOMS);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryMilestones = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_MILESTONES);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryMedications = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_MEDICATIONS);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryLifestyle = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_LIFESTYLE);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryCharts = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_PROGRESS_POINTS);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryHistory = (req, res, next) => {
  try {
    res.json(MOCK_RECOVERY_JOURNAL);
  } catch (err) {
    next(err);
  }
};

exports.toggleMedication = (req, res, next) => {
  try {
    const { id } = req.params;
    const med = MOCK_RECOVERY_MEDICATIONS.find(m => m.id === id);
    if (med) {
      med.completed = !med.completed;
      res.json({ success: true, data: med });
    } else {
      res.status(404).json({ error: "Medication not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.addJournalEntry = (req, res, next) => {
  try {
    const { notes, mood, healthFeedback } = req.body;
    const newEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      notes: notes || "",
      mood: mood || "Good",
      healthFeedback: healthFeedback || "Self-logged feedback"
    };
    MOCK_RECOVERY_JOURNAL.unshift(newEntry);
    res.status(201).json({ success: true, data: newEntry });
  } catch (err) {
    next(err);
  }
};
// Helper to match Doctor Portal profile
exports.getDoctorProfile = (req, res, next) => {
  try {
    const docProfile = {
      id: "dr-1",
      name: "Dr. Arun Sharma",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80",
      specialization: "Panchakarma & Internal Medicine",
      qualification: "BAMS, MD (Ayurveda)",
      experience: "15+ Years",
      rating: 4.9,
      clinicName: "AyurVeda Wellness Center",
      city: "Jaipur",
      email: "dr.arun@ayurvedaconnect.com",
      phone: "+91 98765 12345"
    };
    res.json(docProfile);
  } catch (err) {
    next(err);
  }
};

exports.updateDoctorStatus = (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
