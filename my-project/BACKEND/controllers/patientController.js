// BACKEND/controllers/patientController.js
// Direct MySQL implementation for Patient perspective
const { getPool } = require('../config/db');

exports.getPatientProfile = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const id = (req.headers && req.headers['x-user-id']) || (req.params && req.params.id);
    let rows = [];
    if (id) {
      [rows] = await pool.query("SELECT * FROM patients WHERE id = ?", [id]);
    }
    if (rows.length === 0) {
      [rows] = await pool.query("SELECT * FROM patients LIMIT 1");
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "No patient record found" });
    }
    const profile = rows[0];
    if (typeof profile.healthGoals === 'string') {
      try { profile.healthGoals = JSON.parse(profile.healthGoals); } catch (e) { profile.healthGoals = []; }
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.getPatientDashboard = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    let [profiles] = await pool.query('SELECT * FROM patients WHERE id = ?', [patientId]);
    if (profiles.length === 0) {
      [profiles] = await pool.query('SELECT * FROM patients LIMIT 1');
    }
    const profile = profiles[0] || {};
    if (typeof profile.healthGoals === 'string') {
      try { profile.healthGoals = JSON.parse(profile.healthGoals); } catch (e) { profile.healthGoals = []; }
    }

    const [wellnessRows] = await pool.query('SELECT * FROM patient_wellness WHERE patientId = ?', [profile.id]);
    const wellness = wellnessRows[0] || { dietAdherence: 85, exerciseProgress: 90, sleepQuality: 80, waterIntake: 75 };

    const [goals] = await pool.query('SELECT * FROM patient_health_goals WHERE patientId = ?', [profile.id]);
    const [records] = await pool.query('SELECT * FROM patient_medical_records WHERE patientId = ? ORDER BY date DESC', [profile.id]);
    const [appointments] = await pool.query('SELECT * FROM doctor_consultations WHERE patientEmail = ? OR patientId = ? ORDER BY appointmentDate DESC', [profile.email, profile.id]);
    const [recoveryRows] = await pool.query('SELECT * FROM patient_recovery_tracker WHERE patientId = ?', [profile.id]);
    const [notifications] = await pool.query('SELECT * FROM notifications WHERE (userId = ? OR role = "patient") ORDER BY date DESC', [profile.id]);

    const recovery = recoveryRows[0] ? {
      ...recoveryRows[0],
      weeklyMetrics: typeof recoveryRows[0].weeklyMetrics === 'string' ? JSON.parse(recoveryRows[0].weeklyMetrics) : recoveryRows[0].weeklyMetrics,
      monthlyMetrics: typeof recoveryRows[0].monthlyMetrics === 'string' ? JSON.parse(recoveryRows[0].monthlyMetrics) : recoveryRows[0].monthlyMetrics
    } : null;

    res.json({
      profile,
      wellness,
      healthGoals: goals,
      records,
      appointments,
      recovery,
      notifications
    });
  } catch (err) {
    next(err);
  }
};

exports.getPatientAppointments = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'];
    let query = "SELECT * FROM doctor_consultations";
    const params = [];
    if (patientId) {
      query += " WHERE patientId = ? OR patientEmail = (SELECT email FROM patients WHERE id = ?)";
      params.push(patientId, patientId);
    }
    query += " ORDER BY appointmentDate DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getPatientRecovery = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query("SELECT * FROM patient_recovery_tracker WHERE patientId = ?", [patientId]);
    if (rows.length === 0) return res.json(null);
    const rec = rows[0];
    rec.weeklyMetrics = typeof rec.weeklyMetrics === 'string' ? JSON.parse(rec.weeklyMetrics) : rec.weeklyMetrics;
    rec.monthlyMetrics = typeof rec.monthlyMetrics === 'string' ? JSON.parse(rec.monthlyMetrics) : rec.monthlyMetrics;
    res.json(rec);
  } catch (err) {
    next(err);
  }
};

exports.getPatientRecords = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query("SELECT * FROM patient_medical_records WHERE patientId = ? ORDER BY date DESC", [patientId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getPatientNotifications = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const [rows] = await pool.query("SELECT * FROM notifications WHERE role = 'patient' ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getPatientWellness = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const [rows] = await pool.query("SELECT * FROM patient_wellness WHERE patientId = ?", [patientId]);
    res.json(rows[0] || { dietAdherence: 85, exerciseProgress: 90, sleepQuality: 80, waterIntake: 75 });
  } catch (err) {
    next(err);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.query("UPDATE doctor_consultations SET status = 'Cancelled' WHERE id = ?", [id]);
    await pool.query("UPDATE doctor_appointments SET status = 'Cancelled' WHERE id = ?", [id]);
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    next(err);
  }
};

exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { date, time } = req.body;
    await pool.query(
      "UPDATE doctor_consultations SET appointmentDate = ?, appointmentTime = ?, status = 'Confirmed' WHERE id = ?",
      [date, time, id]
    );
    await pool.query(
      "UPDATE doctor_appointments SET appointmentDate = ?, appointmentTime = ?, status = 'Confirmed' WHERE id = ?",
      [date, time, id]
    );
    res.json({ success: true, message: "Appointment rescheduled successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentSlots = (req, res) => {
  res.json([
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ]);
};

exports.createAppointment = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const { doctorId, doctorName, patientName, email, phone, appointmentDate, appointmentTime, consultationType, notes, fee } = req.body;
    if (!patientName || !email || !phone || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const consultId = `ap-${Date.now()}`;
    const consFee = parseInt(fee || 800, 10);
    const doctorRevenue = consFee * 0.85;
    const platformRevenue = consFee * 0.15;

    await pool.query(`
      INSERT INTO doctor_consultations (
        id, doctorId, doctorName, patientName, patientEmail, patientPhone,
        appointmentDate, appointmentTime, consultationType, consultationFee,
        paymentMethod, paymentStatus, paymentTxnId, doctorRevenue, platformRevenue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      consultId, doctorId || 'doc-dir-1', doctorName || 'Ayurvedic Specialist',
      patientName, email, phone, appointmentDate, appointmentTime,
      consultationType || 'Online Video', consFee, 'Paytm', 'Paid',
      `TXN-PAYTM-${Date.now()}`, doctorRevenue, platformRevenue
    ]);

    await pool.query(`
      INSERT INTO doctor_appointments (
        id, doctorId, patientName, patientEmail, patientPhone,
        appointmentDate, appointmentTime, consultationType, status, consultationFee
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      consultId, doctorId || 'doc-dir-1', patientName, email, phone,
      appointmentDate, appointmentTime, consultationType || 'Online Video', 'Confirmed', consFee
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: consultId,
        doctorId,
        patientName,
        email,
        phone,
        appointmentDate,
        appointmentTime,
        status: 'Confirmed'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadPatientRecord = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const patientId = req.headers['x-user-id'] || 'pat-1';
    const { title, type, doctorName } = req.body;
    const recordId = `rec-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];

    await pool.query(`
      INSERT INTO patient_medical_records (id, patientId, title, type, date, doctorName, fileSize, fileUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      recordId, patientId, title || "Diagnostic Consultation File", type || "Clinical Report",
      date, doctorName || "Vaidya Consultant", "1.5 MB", "#"
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: recordId,
        title,
        type,
        date,
        doctorName,
        fileSize: "1.5 MB"
      }
    });
  } catch (err) {
    next(err);
  }
};
