// BACKEND/controllers/doctorAuthController.js
const { getPool } = require('../config/db');
const axios = require('axios');

exports.login = async (req, res, next) => {
  try {
    const pool = getPool();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, specialization, qualification, experience, rating, reviewCount,
              fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
              education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
              onlineConsultation, offlineConsultation, photo, password
       FROM doctors WHERE LOWER(email) = ?`,
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email, password, or chosen role.' });
    }

    const doctor = rows[0];
    if (doctor.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email, password, or chosen role.' });
    }

    // Exclude password from return payload
    delete doctor.password;

    // Normalize JSON arrays
    doctor.languages = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : (doctor.languages || []);
    doctor.education = typeof doctor.education === 'string' ? JSON.parse(doctor.education) : (doctor.education || []);
    doctor.awards = typeof doctor.awards === 'string' ? JSON.parse(doctor.awards) : (doctor.awards || []);
    doctor.specialExpertise = typeof doctor.specialExpertise === 'string' ? JSON.parse(doctor.specialExpertise) : (doctor.specialExpertise || []);

    res.json({
      success: true,
      data: {
        role: 'doctor',
        profile: doctor
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const pool = getPool();
    const { name, email, password, specialization, qualification, experience, city, state, clinicName, googleId, loginProvider, photo } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }
    if (loginProvider !== 'google' && !password) {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM doctors WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (existing[0].count > 0) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const doctorId = `doc-${Date.now()}`;
    const defaultPhoto = photo || `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&q=80`;

    await pool.query(
      `INSERT INTO doctors (
        id, googleId, loginProvider, name, email, password, specialization, qualification, experience, clinicName, city, state, photo,
        rating, reviewCount, consultationFee, onlineConsultationFee, languages, education, awards, specialExpertise,
        availability, successRate, patientsTreated, verified, onlineConsultation, offlineConsultation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, 500, 400, '["Hindi", "English"]', '[]', '[]', '[]', 'Mon-Fri (10:00 AM - 4:00 PM)', 95, 0, 1, 1, 1)`,
      [
        doctorId,
        googleId || null,
        loginProvider || 'local',
        name,
        email,
        password || null,
        specialization || 'General Ayurveda',
        qualification || 'BAMS',
        parseInt(experience, 10) || 2,
        clinicName || 'Ayurveda Wellness Clinic',
        city || 'Jaipur',
        state || 'Rajasthan',
        defaultPhoto
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, specialization, qualification, experience, rating, reviewCount,
              fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
              education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
              onlineConsultation, offlineConsultation, photo
       FROM doctors WHERE id = ?`,
      [doctorId]
    );

    const doctor = rows[0];
    doctor.languages = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : (doctor.languages || []);
    doctor.education = typeof doctor.education === 'string' ? JSON.parse(doctor.education) : (doctor.education || []);
    doctor.awards = typeof doctor.awards === 'string' ? JSON.parse(doctor.awards) : (doctor.awards || []);
    doctor.specialExpertise = typeof doctor.specialExpertise === 'string' ? JSON.parse(doctor.specialExpertise) : (doctor.specialExpertise || []);

    res.status(201).json({
      success: true,
      data: {
        role: 'doctor',
        profile: doctor
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken, accessToken } = req.body;
    const token = accessToken || idToken;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Google authentication token is required.' });
    }

    let googleUser;
    try {
      if (accessToken) {
        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        googleUser = googleRes.data;
      } else {
        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        googleUser = googleRes.data;
      }
    } catch (err) {
      console.error('Google token verification failed:', err.message);
      return res.status(400).json({ success: false, error: 'Invalid Google token.' });
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ success: false, error: 'Invalid token payload received from Google.' });
    }

    const email = googleUser.email.toLowerCase();
    const name = googleUser.name || 'Ayurvedic Doctor';
    const photo = googleUser.picture || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&q=80';
    const googleId = googleUser.sub;

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [existing] = await conn.query(
        `SELECT id, name, email, googleId, loginProvider, specialization, qualification, experience, rating, reviewCount,
                fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
                education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
                onlineConsultation, offlineConsultation, photo
         FROM doctors WHERE LOWER(email) = ? OR googleId = ?`,
        [email, googleId]
      );

      let doctor;

      if (existing.length > 0) {
        doctor = existing[0];
        await conn.query(
          `UPDATE doctors SET googleId = ?, loginProvider = 'google', photo = COALESCE(photo, ?) WHERE id = ?`,
          [googleId, photo, doctor.id]
        );
        const [updatedRows] = await conn.query(
          `SELECT id, name, email, googleId, loginProvider, specialization, qualification, experience, rating, reviewCount,
                  fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
                  education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
                  onlineConsultation, offlineConsultation, photo
           FROM doctors WHERE id = ?`,
          [doctor.id]
        );
        doctor = updatedRows[0];
      } else {
        await conn.rollback();
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          error: 'Account not found. Please sign up and register yourself first.'
        });
      }

      await conn.commit();

      doctor.languages = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : (doctor.languages || []);
      doctor.education = typeof doctor.education === 'string' ? JSON.parse(doctor.education) : (doctor.education || []);
      doctor.awards = typeof doctor.awards === 'string' ? JSON.parse(doctor.awards) : (doctor.awards || []);
      doctor.specialExpertise = typeof doctor.specialExpertise === 'string' ? JSON.parse(doctor.specialExpertise) : (doctor.specialExpertise || []);

      res.json({
        success: true,
        data: {
          role: 'doctor',
          profile: doctor
        }
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
};
