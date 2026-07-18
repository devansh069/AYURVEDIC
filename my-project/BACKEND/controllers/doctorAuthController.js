// BACKEND/controllers/doctorAuthController.js
const { getPool } = require('../config/db');

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
    const { name, email, password, specialization, qualification, experience, city, state, clinicName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM doctors WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (existing[0].count > 0) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const doctorId = `doc-${Date.now()}`;
    const defaultPhoto = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&q=80`;

    await pool.query(
      `INSERT INTO doctors (
        id, name, email, password, specialization, qualification, experience, clinicName, city, state, photo,
        rating, reviewCount, consultationFee, onlineConsultationFee, languages, education, awards, specialExpertise,
        availability, successRate, patientsTreated, verified, onlineConsultation, offlineConsultation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, 500, 400, '["Hindi", "English"]', '[]', '[]', '[]', 'Mon-Fri (10:00 AM - 4:00 PM)', 95, 0, 1, 1, 1)`,
      [
        doctorId,
        name,
        email,
        password,
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
