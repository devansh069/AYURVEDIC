// BACKEND/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const patientAuthController = require('../controllers/patientAuthController');
const doctorAuthController = require('../controllers/doctorAuthController');
const { getPool } = require('../config/db');

// Unified Google Login/Signup Handler
const googleAuthHandler = async (req, res, next) => {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ success: false, error: 'Email and role are required for Google Authentication.' });
    }

    await conn.beginTransaction();

    if (role === 'patient') {
      const [rows] = await conn.query(
        'SELECT id, name, email, phone, age, gender, profilePhoto, city, doshaType, healthGoals, joinedDate FROM patients WHERE LOWER(email) = ?',
        [email.toLowerCase()]
      );

      if (rows.length > 0) {
        const patient = rows[0];
        patient.healthGoals = typeof patient.healthGoals === 'string' ? JSON.parse(patient.healthGoals) : (patient.healthGoals || []);
        await conn.commit();
        return res.json({
          success: true,
          data: { role: 'patient', profile: patient }
        });
      }

      // Automatically register a new patient via Google
      const patientId = `pat-${Date.now()}`;
      const name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const parsedGoals = ['PCOS Management', 'Stress Reduction'];
      const photo = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80`;

      await conn.query(
        `INSERT INTO patients (id, name, email, password, age, gender, city, doshaType, healthGoals, profilePhoto, joinedDate) 
         VALUES (?, ?, ?, 'google_login', 28, 'Female', 'New Delhi', 'Pitta-Kapha', ?, ?, NOW())`,
        [patientId, name, email, JSON.stringify(parsedGoals), photo]
      );

      // Seed wellness
      await conn.query(
        `INSERT INTO patient_wellness (patientId, dietAdherence, exerciseProgress, sleepQuality, waterIntake) 
         VALUES (?, 85, 90, 80, 75)`,
        [patientId]
      );

      // Seed recovery (without 'id' field as patientId is primary key)
      const weeklyMetrics = JSON.stringify([
        { name: 'Wk 1', progress: 10, target: 15 },
        { name: 'Wk 2', progress: 25, target: 30 },
      ]);
      const monthlyMetrics = JSON.stringify([
        { name: 'Apr', progress: 30, target: 40 },
      ]);
      await conn.query(
        `INSERT INTO patient_recovery_tracker (patientId, progress, conditionName, startDate, expectedCompletion, weeklyMetrics, monthlyMetrics) 
         VALUES (?, 30, 'PCOS & Metabolic Imbalance', NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), ?, ?)`,
        [patientId, weeklyMetrics, monthlyMetrics]
      );

      // Seed goals
      for (let i = 0; i < parsedGoals.length; i++) {
        await conn.query(
          `INSERT INTO patient_health_goals (id, patientId, title, progress, target) 
           VALUES (?, ?, ?, ?, ?)`,
          [`goal-${patientId}-${i}`, patientId, parsedGoals[i], 30, `Improve your health parameter for ${parsedGoals[i]}`]
        );
      }

      // Seed initial notification (using correct userId and role columns)
      await conn.query(
        `INSERT INTO notifications (id, userId, role, title, message, date, type, readStatus) 
         VALUES (?, ?, 'patient', 'Google Registration Success', 'Welcome to AyurVeda Connect. Your account has been initialized via Google.', NOW(), 'Reminder', 0)`,
        [`notif-google-${patientId}`, patientId]
      );

      // Seed first chat message from AI
      await conn.query(
        `INSERT INTO ai_chat_messages (id, patientId, sender, text, time) 
         VALUES (?, ?, 'ai', ?, ?)`,
        [
          `msg-welcome-${patientId}`,
          patientId,
          `🙏 Namaste ${name}! I am your AI Ayurveda Health Advisor. How can I help you today? Ask me about Dosha analysis, diet recommendations, treatment suggestions, or general wellness guidance.`,
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        ]
      );

      await conn.commit();

      return res.status(201).json({
        success: true,
        data: {
          role: 'patient',
          profile: {
            id: patientId,
            name,
            email,
            phone: '',
            age: 28,
            gender: 'Female',
            profilePhoto: photo,
            city: 'New Delhi',
            doshaType: 'Pitta-Kapha',
            healthGoals: parsedGoals,
            joinedDate: new Date()
          }
        }
      });

    } else if (role === 'doctor') {
      const [rows] = await conn.query(
        `SELECT id, name, email, specialization, qualification, experience, rating, reviewCount,
                fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
                education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
                onlineConsultation, offlineConsultation, photo
         FROM doctors WHERE LOWER(email) = ?`,
        [email.toLowerCase()]
      );

      if (rows.length > 0) {
        const doctor = rows[0];
        doctor.languages = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : (doctor.languages || []);
        doctor.education = typeof doctor.education === 'string' ? JSON.parse(doctor.education) : (doctor.education || []);
        doctor.awards = typeof doctor.awards === 'string' ? JSON.parse(doctor.awards) : (doctor.awards || []);
        doctor.specialExpertise = typeof doctor.specialExpertise === 'string' ? JSON.parse(doctor.specialExpertise) : (doctor.specialExpertise || []);

        await conn.commit();
        return res.json({
          success: true,
          data: { role: 'doctor', profile: doctor }
        });
      }

      // Automatically register a new doctor via Google
      const doctorId = `doc-${Date.now()}`;
      const name = "Dr. " + email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const defaultPhoto = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&q=80`;

      await conn.query(
        `INSERT INTO doctors (
          id, name, email, password, specialization, qualification, experience, clinicName, city, state, photo,
          rating, reviewCount, consultationFee, onlineConsultationFee, languages, education, awards, specialExpertise,
          availability, successRate, patientsTreated, verified, onlineConsultation, offlineConsultation
        ) VALUES (?, ?, ?, 'google_login', 'Ayurvedic Consultant', 'BAMS', 5, 'AyurVeda Clinic', 'New Delhi', 'Delhi', ?, 5.0, 0, 500, 400, '["Hindi", "English"]', '[]', '[]', '[]', 'Mon-Fri (10:00 AM - 4:00 PM)', 95, 0, 1, 1, 1)`,
        [doctorId, name, email, defaultPhoto]
      );

      const [newDocRows] = await conn.query(
        `SELECT id, name, email, specialization, qualification, experience, rating, reviewCount,
                fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
                education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
                onlineConsultation, offlineConsultation, photo
         FROM doctors WHERE id = ?`,
        [doctorId]
      );

      const doctor = newDocRows[0];
      doctor.languages = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : (doctor.languages || []);
      doctor.education = typeof doctor.education === 'string' ? JSON.parse(doctor.education) : (doctor.education || []);
      doctor.awards = typeof doctor.awards === 'string' ? JSON.parse(doctor.awards) : (doctor.awards || []);
      doctor.specialExpertise = typeof doctor.specialExpertise === 'string' ? JSON.parse(doctor.specialExpertise) : (doctor.specialExpertise || []);

      await conn.commit();
      return res.status(201).json({
        success: true,
        data: { role: 'doctor', profile: doctor }
      });
    } else {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'Invalid role specified.' });
    }
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// Route definitions
router.post('/patient/login', patientAuthController.login);
router.post('/patient/signup', patientAuthController.signup);
router.post('/patient/google-login', patientAuthController.googleLogin);
router.post('/doctor/login', doctorAuthController.login);
router.post('/doctor/signup', doctorAuthController.signup);
router.post('/doctor/google-login', doctorAuthController.googleLogin);
router.post('/google', googleAuthHandler);

module.exports = router;
