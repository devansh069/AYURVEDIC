// BACKEND/controllers/recordController.js
// Direct MySQL implementation for Patient Medical Records
const { getPool } = require('../config/db');

exports.getRecords = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      "SELECT * FROM patient_medical_records WHERE patientId = ? ORDER BY date DESC",
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getRecordById = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const [rows] = await pool.query("SELECT * FROM patient_medical_records WHERE id = ?", [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPrescriptions = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      "SELECT * FROM patient_medical_records WHERE patientId = ? AND type LIKE '%Prescription%' ORDER BY date DESC",
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      "SELECT * FROM patient_medical_records WHERE patientId = ? AND (type LIKE '%Report%' OR type LIKE '%Lab%') ORDER BY date DESC",
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getLabTests = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      "SELECT * FROM patient_medical_records WHERE patientId = ? AND type LIKE '%Lab%' ORDER BY date DESC",
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentHistory = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query(
      "SELECT * FROM doctor_consultations WHERE patientId = ? OR patientEmail = (SELECT email FROM patients WHERE id = ?) ORDER BY appointmentDate DESC",
      [patientId, patientId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getActivities = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const [rows] = await pool.query(
      "SELECT id, title, type, date as timestamp, 'Completed' as details FROM patient_medical_records ORDER BY date DESC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getInsights = (req, res) => {
  res.json({
    summary: "Your Ayurvedic medical records indicate positive systemic responses to Panchakarma therapy.",
    vitalMetrics: { adherenceScore: 88, overallImprovement: "74%" }
  });
};

exports.uploadRecord = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const { title, category, doctorName, date, fileSize } = req.body;
    const newRecordId = `rec-${Date.now()}`;
    const recordDate = date || new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO patient_medical_records (id, patientId, title, type, date, doctorName, fileSize, fileUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newRecordId, patientId, title || "Uploaded Record", category || "Clinical Report", recordDate, doctorName || "Consulting Vaidya", fileSize || "1.5 MB", "#"]
    );

    const [rows] = await pool.query("SELECT * FROM patient_medical_records WHERE id = ?", [newRecordId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const { id } = req.params;
    await pool.query("DELETE FROM patient_medical_records WHERE id = ?", [id]);
    res.json({ success: true, message: "Record deleted successfully from database" });
  } catch (err) {
    next(err);
  }
};
