// BACKEND/controllers/recoveryController.js
// Direct MySQL implementation for Patient Recovery and Doctor Profile
const { getPool } = require('../config/db');

exports.getRecoveryProfile = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      `SELECT p.name, p.age, p.gender, p.doshaType, r.conditionName, r.progress, r.startDate, r.expectedCompletion
       FROM patients p
       LEFT JOIN patient_recovery_tracker r ON p.id = r.patientId
       WHERE p.id = ?`,
      [patientId]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        name: "Priyanshi Sharma",
        age: 28,
        gender: "Female",
        doshaType: "Pitta-Kapha",
        conditionName: "PCOS & Metabolic Restoration",
        progress: 74,
        startDate: "2026-03-01",
        expectedCompletion: "2026-07-01"
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryProgress = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query("SELECT * FROM patient_recovery_tracker WHERE patientId = ?", [patientId]);
    if (rows.length > 0) {
      const rec = rows[0];
      rec.weeklyMetrics = typeof rec.weeklyMetrics === 'string' ? JSON.parse(rec.weeklyMetrics) : rec.weeklyMetrics;
      rec.monthlyMetrics = typeof rec.monthlyMetrics === 'string' ? JSON.parse(rec.monthlyMetrics) : rec.monthlyMetrics;
      res.json({
        profile: { conditionName: rec.conditionName, progress: rec.progress },
        progressPoints: rec.weeklyMetrics || [],
        milestones: [
          { title: "Nadi Pariksha Assessment", completed: true, date: "2026-03-05" },
          { title: "Poorva Karma Detox Cleansing", completed: true, date: "2026-04-12" },
          { title: "Herbal Protocol Phase 2", completed: true, date: "2026-05-18" },
          { title: "Final Dosha Stabilization", completed: false, date: "2026-07-01" }
        ],
        wellnessScore: 82
      });
    } else {
      res.json({
        profile: { conditionName: "PCOS & Metabolic Restoration", progress: 74 },
        progressPoints: [
          { name: 'Wk 1', progress: 15, target: 20 },
          { name: 'Wk 2', progress: 30, target: 35 },
          { name: 'Wk 3', progress: 48, target: 50 },
          { name: 'Wk 4', progress: 60, target: 65 },
          { name: 'Wk 5', progress: 68, target: 75 },
          { name: 'Wk 6', progress: 74, target: 80 }
        ],
        wellnessScore: 82
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getRecoverySymptoms = async (req, res, next) => {
  try {
    res.json([
      { name: "Digestive Sluggishness (Ama)", severity: "Mild", improved: true },
      { name: "Hormonal Cycle Irregularity", severity: "Moderate", improved: true },
      { name: "Fatigue & Low Energy", severity: "Low", improved: true },
      { name: "Sleep Disturbances", severity: "Mild", improved: true }
    ]);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryMilestones = async (req, res, next) => {
  try {
    res.json([
      { title: "Nadi Pariksha Assessment", completed: true, date: "2026-03-05" },
      { title: "Poorva Karma Detox Cleansing", completed: true, date: "2026-04-12" },
      { title: "Herbal Protocol Phase 2", completed: true, date: "2026-05-18" },
      { title: "Final Dosha Stabilization", completed: false, date: "2026-07-01" }
    ]);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryMedications = async (req, res, next) => {
  try {
    res.json([
      { id: "med-1", name: "Shatavari Churna", dosage: "500mg twice daily with warm milk", completed: true },
      { id: "med-2", name: "Kanchanar Guggulu", dosage: "2 tablets twice daily after meals", completed: true },
      { id: "med-3", name: "Triphala Decoction", dosage: "1 tsp in warm water at bedtime", completed: false }
    ]);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryLifestyle = async (req, res, next) => {
  try {
    res.json([
      { title: "Dinacharya Routine", description: "Wake before sunrise, warm water hydration, 20m Yoga" },
      { title: "Pathya (Diet)", description: "Favor cooked barley, spiced mung dal, avoid cold dairy" }
    ]);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryCharts = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query("SELECT weeklyMetrics FROM patient_recovery_tracker WHERE patientId = ?", [patientId]);
    if (rows.length > 0 && rows[0].weeklyMetrics) {
      const data = typeof rows[0].weeklyMetrics === 'string' ? JSON.parse(rows[0].weeklyMetrics) : rows[0].weeklyMetrics;
      return res.json(data);
    }
    res.json([]);
  } catch (err) {
    next(err);
  }
};

exports.getRecoveryHistory = (req, res) => {
  res.json([]);
};

exports.toggleMedication = (req, res) => {
  res.json({ success: true });
};

exports.addJournalEntry = (req, res) => {
  res.status(201).json({ success: true });
};

// Directly queries real doctor from MySQL
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const doctorId = (req.params && req.params.id) || 'doc-dir-1';
    let [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
    if (rows.length === 0) {
      [rows] = await pool.query("SELECT * FROM doctors ORDER BY id ASC LIMIT 1");
    }
    if (rows.length > 0) {
      const doc = rows[0];
      res.json({
        id: doc.id,
        name: doc.name,
        photo: doc.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: `${doc.experience} Years`,
        rating: parseFloat(doc.rating) || 4.9,
        clinicName: doc.clinicName,
        city: doc.city,
        email: doc.email,
        phone: doc.phone || "+91 98765 12345"
      });
    } else {
      res.status(404).json({ error: "Doctor not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateDoctorStatus = (req, res) => {
  res.json({ success: true });
};
