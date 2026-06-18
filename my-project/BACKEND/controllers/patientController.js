// BACKEND/controllers/patientController.js
const { MOCK_PATIENT_PROFILE, MOCK_PATIENT_APPOINTMENTS } = require('../models/patientModel');
const { MOCK_PATIENT_RECOVERY, MOCK_PATIENT_WELLNESS, MOCK_HEALTH_GOALS } = require('../models/recoveryModel');
const { MOCK_PATIENT_RECORDS, MOCK_PATIENT_NOTIFICATIONS, MOCK_AI_RECOMMENDATIONS } = require('../models/recordModel');

exports.getPatientProfile = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_PROFILE);
  } catch (err) {
    next(err);
  }
};

exports.getPatientDashboard = (req, res, next) => {
  try {
    res.json({
      profile: MOCK_PATIENT_PROFILE,
      appointments: MOCK_PATIENT_APPOINTMENTS,
      recovery: MOCK_PATIENT_RECOVERY,
      records: MOCK_PATIENT_RECORDS,
      notifications: MOCK_PATIENT_NOTIFICATIONS,
      wellness: MOCK_PATIENT_WELLNESS,
      aiRecommendations: MOCK_AI_RECOMMENDATIONS,
      healthGoals: MOCK_HEALTH_GOALS
    });
  } catch (err) {
    next(err);
  }
};

exports.getPatientAppointments = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_APPOINTMENTS);
  } catch (err) {
    next(err);
  }
};

exports.getPatientRecovery = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_RECOVERY);
  } catch (err) {
    next(err);
  }
};

exports.getPatientRecords = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_RECORDS);
  } catch (err) {
    next(err);
  }
};

exports.getPatientNotifications = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_NOTIFICATIONS);
  } catch (err) {
    next(err);
  }
};

exports.getPatientWellness = (req, res, next) => {
  try {
    res.json(MOCK_PATIENT_WELLNESS);
  } catch (err) {
    next(err);
  }
};

exports.cancelAppointment = (req, res, next) => {
  try {
    const { id } = req.params;
    const apt = MOCK_PATIENT_APPOINTMENTS.find(a => a.id === id);
    if (apt) {
      apt.status = "Cancelled";
      res.json({ success: true, data: apt });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.rescheduleAppointment = (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    const apt = MOCK_PATIENT_APPOINTMENTS.find(a => a.id === id);
    if (apt) {
      apt.date = date;
      apt.time = time;
      apt.status = "Confirmed";
      res.json({ success: true, data: apt });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentSlots = (req, res, next) => {
  try {
    res.json([
      "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ]);
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = (req, res, next) => {
  try {
    const { doctorId, patientName, email, phone, appointmentDate, appointmentTime, consultationType, notes } = req.body;
    if (!patientName || !email || !phone || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Required fields are missing." });
    }
    const newAppointment = {
      id: `APT-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      doctorId,
      patientName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      consultationType,
      notes,
      status: 'Confirmed'
    };
    
    // Add to patient appointments list if matches logged in email
    if (email.toLowerCase() === MOCK_PATIENT_PROFILE.email.toLowerCase()) {
      MOCK_PATIENT_APPOINTMENTS.unshift({
        id: newAppointment.id,
        doctorName: "Consulting Vaidya",
        specialization: "General Ayurveda",
        clinic: consultationType === "Online Video" ? "Virtual Video Consult" : "In-Clinic Visit",
        date: appointmentDate,
        time: appointmentTime,
        status: "Confirmed"
      });
    }

    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    next(err);
  }
};

exports.uploadPatientRecord = (req, res, next) => {
  try {
    const { title, type, doctorName } = req.body;
    const newRecord = {
      id: `rec-doc-${Date.now()}`,
      title: title || "Uploaded Medical File",
      type: type || "Document",
      date: new Date().toISOString().split('T')[0],
      doctorName: doctorName || "Self Uploaded",
      fileSize: "1.2 MB",
      fileUrl: "#"
    };
    MOCK_PATIENT_RECORDS.unshift(newRecord);
    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    next(err);
  }
};

