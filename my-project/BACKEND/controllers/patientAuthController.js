// BACKEND/controllers/patientAuthController.js
const { getPool } = require('../config/db');

exports.login = async (req, res, next) => {
  try {
    const pool = getPool();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, age, gender, profilePhoto, city, doshaType, healthGoals, joinedDate, password FROM patients WHERE LOWER(email) = ?',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email, password, or chosen role.' });
    }

    const patient = rows[0];
    if (patient.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email, password, or chosen role.' });
    }

    // Exclude password from return payload
    delete patient.password;

    res.json({
      success: true,
      data: {
        role: 'patient',
        profile: {
          ...patient,
          healthGoals: typeof patient.healthGoals === 'string' ? JSON.parse(patient.healthGoals) : (patient.healthGoals || [])
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { name, email, password, age, gender, city, doshaType, healthGoals, googleId, loginProvider, profilePhoto } = req.body;
    if (!name || !email) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }
    if (loginProvider !== 'google' && !password) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    // Check if email already exists
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM patients WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (existing[0].count > 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const patientId = `pat-${Date.now()}`;
    const parsedGoals = healthGoals || ['General Wellness'];
    const photo = profilePhoto || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80`;

    // 1. Insert patient
    await conn.query(
      `INSERT INTO patients (id, googleId, loginProvider, name, email, password, age, gender, city, doshaType, healthGoals, profilePhoto, joinedDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        patientId,
        googleId || null,
        loginProvider || 'local',
        name,
        email,
        password || null,
        parseInt(age, 10) || 25,
        gender || 'Other',
        city || 'New Delhi',
        doshaType || 'Vata-Pitta',
        JSON.stringify(parsedGoals),
        photo
      ]
    );

    // 2. Seed wellness compliance
    await conn.query(
      `INSERT INTO patient_wellness (patientId, dietAdherence, exerciseProgress, sleepQuality, waterIntake) 
       VALUES (?, ?, ?, ?, ?)`,
      [patientId, 70, 75, 80, 85]
    );

    // 3. Seed recovery tracker (without 'id' field as patientId is primary key)
    const weeklyMetrics = JSON.stringify([
      { name: 'Wk 1', progress: 5, target: 10 },
      { name: 'Wk 2', progress: 15, target: 20 },
      { name: 'Wk 3', progress: 30, target: 35 },
    ]);
    const monthlyMetrics = JSON.stringify([
      { name: 'Month 1', progress: 20, target: 25 },
      { name: 'Month 2', progress: 40, target: 50 },
    ]);
    await conn.query(
      `INSERT INTO patient_recovery_tracker (patientId, progress, conditionName, startDate, expectedCompletion, weeklyMetrics, monthlyMetrics) 
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), ?, ?)`,
      [patientId, 40, 'Digestive & Metabolism Balancing', weeklyMetrics, monthlyMetrics]
    );

    // 4. Seed goals
    for (let i = 0; i < parsedGoals.length; i++) {
      await conn.query(
        `INSERT INTO patient_health_goals (id, patientId, title, progress, target) 
         VALUES (?, ?, ?, ?, ?)`,
        [`goal-${patientId}-${i}`, patientId, parsedGoals[i], 30, `Improve your health parameter for ${parsedGoals[i]}`]
      );
    }

    // 5. Seed initial notification (using correct userId and role columns)
    await conn.query(
      `INSERT INTO notifications (id, userId, role, title, message, date, type, readStatus) 
       VALUES (?, ?, 'patient', 'Welcome to AyurVeda Connect', 'Your constitutional health profile is successfully registered.', NOW(), 'Reminder', 0)`,
      [`notif-welcome-${patientId}`, patientId]
    );

    // 6. Seed first chat message from AI
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

    res.status(201).json({
      success: true,
      data: {
        role: 'patient',
        profile: {
          id: patientId,
          name,
          email,
          phone: '',
          age: parseInt(age, 10) || 25,
          gender: gender || 'Other',
          profilePhoto: photo,
          city: city || 'New Delhi',
          doshaType: doshaType || 'Vata-Pitta',
          healthGoals: parsedGoals,
          joinedDate: new Date()
        }
      }
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

const axios = require('axios');

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
        // Access Token verification using userinfo endpoint
        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        googleUser = googleRes.data;
      } else {
        // ID Token verification using tokeninfo endpoint
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
    const name = googleUser.name || 'Ayurvedic User';
    const profilePhoto = googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80';
    const googleId = googleUser.sub;

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [existing] = await conn.query(
        'SELECT id, name, email, phone, age, gender, profilePhoto, city, doshaType, healthGoals, joinedDate FROM patients WHERE LOWER(email) = ? OR googleId = ?',
        [email, googleId]
      );

      let patient;

      if (existing.length > 0) {
        patient = existing[0];
        await conn.query(
          `UPDATE patients SET googleId = ?, loginProvider = 'google', profilePhoto = COALESCE(profilePhoto, ?) WHERE id = ?`,
          [googleId, profilePhoto, patient.id]
        );
        const [updatedRows] = await conn.query('SELECT * FROM patients WHERE id = ?', [patient.id]);
        patient = updatedRows[0];
      } else {
        await conn.rollback();
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          error: 'Account not found. Please sign up and register yourself first.'
        });
      }

      await conn.commit();

      res.json({
        success: true,
        data: {
          role: 'patient',
          profile: {
            ...patient,
            healthGoals: typeof patient.healthGoals === 'string' ? JSON.parse(patient.healthGoals) : (patient.healthGoals || [])
          }
        }
      });
    } catch (dbErr) {
      await conn.rollback();
      throw dbErr;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
};
