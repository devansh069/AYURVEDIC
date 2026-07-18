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

    const { name, email, password, age, gender, city, doshaType, healthGoals } = req.body;
    if (!name || !email || !password) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM patients WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (existing[0].count > 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const patientId = `pat-${Date.now()}`;
    const parsedGoals = healthGoals || ['General Wellness'];
    const photo = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80`;

    // 1. Insert patient
    await conn.query(
      `INSERT INTO patients (id, name, email, password, age, gender, city, doshaType, healthGoals, profilePhoto, joinedDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        patientId,
        name,
        email,
        password,
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
