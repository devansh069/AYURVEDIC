const { getPool } = require('../config/db');
const { generateGeminiContent } = require('../config/gemini');

// Helper to generate AI Vaidya response based on message query and dosha
const getAIResponseText = (message, dosha = 'Pitta-Kapha') => {
  const query = message.toLowerCase();
  if (query.includes('pcos') || query.includes('hormon')) {
    return `For PCOS management under your ${dosha} constitution, it is vital to clear Aama (toxins) and balance Apana Vayu. Favor herbs like Shatavari, Kanchanar Guggulu, and daily exercise. Avoid heavy cold dairy and refined sugars.`;
  }
  if (query.includes('diet') || query.includes('food') || query.includes('eat')) {
    return `Your ${dosha} diet should focus on warm, freshly cooked foods. Favor light, easily digestible grains like Quinoa or Barley. Incorporate spices like ginger, cumin, turmeric to boost Agni (digestive fire).`;
  }
  if (query.includes('sleep') || query.includes('insomnia') || query.includes('night')) {
    return `To optimize sleep quality, retire by 10:30 PM before the Pitta cycle starts. Apply warm sesame oil (or coconut oil) to your feet (Padabhyanga) and sip warm nutmeg milk.`;
  }
  if (query.includes('stress') || query.includes('anxiety') || query.includes('mind')) {
    return `For stress relief, we recommend cooling Pranayama (like Sheetali or Nadi Shodhana) and regular Shirodhara treatments. Ashwagandha and Brahmi are excellent adaptogenic herbs to support your nervous system.`;
  }
  return `Namaste. To balance your ${dosha} dosha, continue favor warm cooked food, warm herbal decoctions on empty stomach, and maintaining a regular daily routine (Dinacharya). Let me know if you would like specific guidance on herbs or remedies!`;
};

// ─── PATIENT PORTAL CONTROLLERS ──────────────────────────────────────────────

exports.getPatientDashboard = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const pool = getPool();

  try {
    // 1. Profile
    const [profiles] = await pool.query('SELECT * FROM patients WHERE id = ?', [patientId]);
    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const profile = profiles[0];

    // Ensure healthGoals field is parsed from JSON
    if (typeof profile.healthGoals === 'string') {
      try {
        profile.healthGoals = JSON.parse(profile.healthGoals);
      } catch (e) {
        profile.healthGoals = ['PCOS Management', 'Stress Reduction'];
      }
    }

    // 2. Wellness
    const [wellnessRows] = await pool.query('SELECT * FROM patient_wellness WHERE patientId = ?', [patientId]);
    const wellness = wellnessRows[0] || { dietAdherence: 80, exerciseProgress: 75, sleepQuality: 85, waterIntake: 90 };

    // 3. Health Goals
    const [goals] = await pool.query('SELECT * FROM patient_health_goals WHERE patientId = ?', [patientId]);

    // 4. Medical Records
    const [records] = await pool.query('SELECT * FROM patient_medical_records WHERE patientId = ? ORDER BY date DESC', [patientId]);

    // 5. Dynamic AI Recommendations based on dosha type
    const dosha = profile.doshaType || 'Pitta';
    let suggestedDiet = [
      'Warm cooked grains (Quinoa, Barley, Brown Rice).',
      'Favor bitter, pungent, and astringent tastes to pacify Kapha.',
      'Avoid raw salads and heavy cold dairy after sunset.'
    ];
    let recommendedTreatment = 'Shirodhara (3 sessions) for stress reduction and hormonal alignment.';
    let lifestyleTips = [
      'Practice cooling breath Sheetali pranayama for 10 minutes daily.',
      'Retire to bed by 10:30 PM to optimize Pitta liver detox cycles.',
      'Daily gentle self-Abhyanga foot massage with organic coconut oil.'
    ];

    if (dosha.toLowerCase().includes('vata')) {
      suggestedDiet = [
        'Warm, moist, oily, freshly cooked foods.',
        'Cooked vegetables, sweet fruits, oats, and mung soup.',
        'Avoid dry crackers, cold raw foods, and carbonated beverages.'
      ];
      recommendedTreatment = 'Abhyanga (Warm Sesame Oil Massage) & Basti (Enema therapy) for Vata pacification.';
      lifestyleTips = [
        'Maintain a strict warm daily routine (Dinacharya).',
        'Avoid multi-tasking and excessive travel.',
        'Meditate for 15 minutes daily with ground focus.'
      ];
    }

    const aiRecommendations = {
      suggestedDiet,
      recommendedTreatment,
      lifestyleTips,
      doctorFollowUpReminder: 'Schedule standard diagnostic checkup with Dr. Vikram Chauhan in 3 weeks.'
    };

    res.json({
      success: true,
      data: {
        profile,
        wellness,
        aiRecommendations,
        healthGoals: goals,
        records
      }
    });
  } catch (err) {
    console.error('Error fetching patient dashboard:', err);
    res.status(500).json({ success: false, message: 'Server error loading patient dashboard' });
  }
};

exports.updateProfile = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const { name, phone, age, gender, city, doshaType, healthGoals } = req.body;
  const pool = getPool();

  try {
    await pool.query(
      `UPDATE patients SET name = ?, phone = ?, age = ?, gender = ?, city = ?, doshaType = ?, healthGoals = ? WHERE id = ?`,
      [name, phone, parseInt(age, 10), gender, city, doshaType, JSON.stringify(healthGoals || []), patientId]
    );

    res.json({ success: true, message: 'Profile settings updated successfully' });
  } catch (err) {
    console.error('Error updating patient profile:', err);
    res.status(500).json({ success: false, message: 'Server error saving profile settings' });
  }
};

exports.getAppointments = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const pool = getPool();

  try {
    // 1. Fetch patient profile to get email
    const [profiles] = await pool.query('SELECT name, email FROM patients WHERE id = ?', [patientId]);
    if (profiles.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const { name, email } = profiles[0];

    // 2. Fetch consultations where patientName/Email matches
    const [rows] = await pool.query(
      `SELECT c.*, d.specialization, d.clinicName as clinic 
       FROM doctor_consultations c 
       LEFT JOIN doctors d ON c.doctorId = d.id 
       WHERE c.patientEmail = ? OR c.patientName = ? 
       ORDER BY c.appointmentDate DESC`,
      [email, name]
    );

    const appointments = rows.map(r => ({
      id: r.id,
      doctorName: r.doctorName || 'Ayurvedic Consultant',
      specialization: r.specialization || 'Ayurveda Expert',
      clinic: r.clinic || 'Ayurveda Connect Partner Clinic',
      date: r.appointmentDate.toISOString().split('T')[0],
      time: r.appointmentTime || '10:00 AM',
      status: r.status || 'Confirmed',
      consultationFee: r.consultationFee,
      consultationType: r.consultationType || 'Online'
    }));

    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error('Error loading patient appointments:', err);
    res.status(500).json({ success: false, message: 'Server error loading appointments' });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const pool = getPool();

  try {
    await pool.query("UPDATE doctor_consultations SET status = 'Cancelled' WHERE id = ?", [id]);
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ success: false, message: 'Server error cancelling appointment' });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  const pool = getPool();

  try {
    await pool.query(
      "UPDATE doctor_consultations SET appointmentDate = ?, appointmentTime = ?, status = 'Confirmed' WHERE id = ?",
      [date, time, id]
    );
    res.json({ success: true, message: 'Appointment rescheduled successfully' });
  } catch (err) {
    console.error('Error rescheduling appointment:', err);
    res.status(500).json({ success: false, message: 'Server error rescheduling appointment' });
  }
};

exports.getRecoveryProgress = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const pool = getPool();

  try {
    const [rows] = await pool.query('SELECT * FROM patient_recovery_tracker WHERE patientId = ?', [patientId]);
    if (rows.length === 0) {
      // Seed default recovery tracker
      const defaultTracker = {
        patientId,
        conditionName: 'PCOS & Metabolic Imbalance',
        progress: 72,
        startDate: '2026-04-10',
        expectedCompletion: '2026-08-10',
        weeklyMetrics: JSON.stringify([
          { name: 'Wk 1', progress: 10, target: 15 },
          { name: 'Wk 2', progress: 25, target: 30 },
          { name: 'Wk 3', progress: 42, target: 45 },
          { name: 'Wk 4', progress: 55, target: 60 },
          { name: 'Wk 5', progress: 62, target: 70 },
          { name: 'Wk 6', progress: 72, target: 80 }
        ]),
        monthlyMetrics: JSON.stringify([
          { name: 'Apr', progress: 30, target: 40 },
          { name: 'May', progress: 60, target: 70 },
          { name: 'Jun', progress: 72, target: 80 }
        ])
      };
      await pool.query(
        `INSERT INTO patient_recovery_tracker (patientId, conditionName, progress, startDate, expectedCompletion, weeklyMetrics, monthlyMetrics)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [defaultTracker.patientId, defaultTracker.conditionName, defaultTracker.progress, defaultTracker.startDate, defaultTracker.expectedCompletion, defaultTracker.weeklyMetrics, defaultTracker.monthlyMetrics]
      );
      return res.json({
        success: true,
        data: {
          id: 'rec-1',
          condition: defaultTracker.conditionName,
          progress: defaultTracker.progress,
          startDate: defaultTracker.startDate,
          expectedCompletion: defaultTracker.expectedCompletion,
          weeklyMetrics: JSON.parse(defaultTracker.weeklyMetrics),
          monthlyMetrics: JSON.parse(defaultTracker.monthlyMetrics)
        }
      });
    }

    const rec = rows[0];
    res.json({
      success: true,
      data: {
        id: rec.patientId,
        condition: rec.conditionName,
        progress: rec.progress,
        startDate: rec.startDate.toISOString().split('T')[0],
        expectedCompletion: rec.expectedCompletion.toISOString().split('T')[0],
        weeklyMetrics: typeof rec.weeklyMetrics === 'string' ? JSON.parse(rec.weeklyMetrics) : rec.weeklyMetrics,
        monthlyMetrics: typeof rec.monthlyMetrics === 'string' ? JSON.parse(rec.monthlyMetrics) : rec.monthlyMetrics
      }
    });
  } catch (err) {
    console.error('Error fetching recovery tracker:', err);
    res.status(500).json({ success: false, message: 'Server error loading recovery tracker' });
  }
};

exports.updateWellness = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const { dietAdherence, exerciseProgress, sleepQuality, waterIntake } = req.body;
  const pool = getPool();

  try {
    await pool.query(
      `INSERT INTO patient_wellness (patientId, dietAdherence, exerciseProgress, sleepQuality, waterIntake)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         dietAdherence = VALUES(dietAdherence),
         exerciseProgress = VALUES(exerciseProgress),
         sleepQuality = VALUES(sleepQuality),
         waterIntake = VALUES(waterIntake)`,
      [patientId, parseInt(dietAdherence, 10), parseInt(exerciseProgress, 10), parseInt(sleepQuality, 10), parseInt(waterIntake, 10)]
    );
    res.json({ success: true, message: 'Wellness index updated successfully' });
  } catch (err) {
    console.error('Error updating wellness metrics:', err);
    res.status(500).json({ success: false, message: 'Server error saving wellness metrics' });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.headers['x-user-id'] || 'pat-123';
  const userRole = req.headers['x-user-role'] || 'patient';
  const pool = getPool();

  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE userId = ? AND role = ? ORDER BY date DESC',
      [userId, userRole]
    );

    const formatted = rows.map(r => ({
      id: r.id,
      title: r.title,
      message: r.message,
      date: r.date.toISOString().split('T')[0],
      type: r.type,
      readStatus: r.readStatus === 1
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error loading notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  const { id } = req.params;
  const pool = getPool();

  try {
    await pool.query('UPDATE notifications SET readStatus = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked read' });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ success: false, message: 'Server error updating notification status' });
  }
};

exports.getDietPlan = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const pool = getPool();

  try {
    const [rows] = await pool.query('SELECT * FROM patient_diet_plans WHERE patientId = ?', [patientId]);
    if (rows.length === 0) {
      // Default diet plan object
      const defaultPlan = {
        patientId,
        activePlan: JSON.stringify({
          doshaType: 'Pitta-Kapha',
          dailyCaloriesTarget: 1800,
          proteinTarget: 65,
          carbsTarget: 220,
          fatTarget: 45,
          waterTarget: 3.2,
          guidelines: [
            'Favor light, warm, dry, and cooked organic meals.',
            'Incorporate spices like ginger, cumin, cardamom, and coriander.',
            'Restrict salt, heavy oils, raw cold salads, and deep-fried foods.'
          ],
          meals: {
            breakfast: { time: '08:30 AM', name: 'Spiced Barley Porridge with Almonds & Cardamom', calories: 380, protein: 12, carbs: 62, fat: 8 },
            lunch: { time: '01:00 PM', name: 'Mung Dal Khichdi with Steamed Zucchini & Ghee', calories: 520, protein: 18, carbs: 85, fat: 12 },
            snack: { time: '04:30 PM', name: 'Stewed Apple with Cinnamon & Warm Ginger Water', calories: 180, protein: 2, carbs: 38, fat: 1 },
            dinner: { time: '07:30 PM', name: 'Butternut Squash Soup & Quinoa Salad', calories: 420, protein: 14, carbs: 68, fat: 10 }
          }
        })
      };
      await pool.query(
        'INSERT INTO patient_diet_plans (patientId, activePlan) VALUES (?, ?)',
        [defaultPlan.patientId, defaultPlan.activePlan]
      );
      return res.json({ success: true, data: JSON.parse(defaultPlan.activePlan) });
    }

    const rawPlan = rows[0].activePlan;
    res.json({ success: true, data: typeof rawPlan === 'string' ? JSON.parse(rawPlan) : rawPlan });
  } catch (err) {
    console.error('Error fetching diet plan:', err);
    res.status(500).json({ success: false, message: 'Server error loading diet plan' });
  }
};

exports.saveDietPlan = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const planData = req.body;
  const pool = getPool();

  try {
    await pool.query(
      `INSERT INTO patient_diet_plans (patientId, activePlan) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE activePlan = VALUES(activePlan)`,
      [patientId, JSON.stringify(planData)]
    );
    res.json({ success: true, message: 'Diet plan saved successfully' });
  } catch (err) {
    console.error('Error saving diet plan:', err);
    res.status(500).json({ success: false, message: 'Server error saving diet plan' });
  }
};

exports.getChatHistory = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const pool = getPool();

  try {
    const [rows] = await pool.query(
      'SELECT id, sender, text, time FROM ai_chat_messages WHERE patientId = ? ORDER BY createdAt ASC',
      [patientId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ success: false, message: 'Server error loading chat history' });
  }
};

exports.postChatMessage = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const { text } = req.body;
  const pool = getPool();

  try {
    // 1. Fetch patient dosha for personalized response
    const [patientRows] = await pool.query('SELECT doshaType FROM patients WHERE id = ?', [patientId]);
    const dosha = patientRows.length > 0 ? patientRows[0].doshaType : 'Pitta-Kapha';

    // 2. Save Patient Message to MySQL
    const msgId = `chat-msg-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    await pool.query(
      'INSERT INTO ai_chat_messages (id, patientId, sender, text, time) VALUES (?, ?, ?, ?, ?)',
      [msgId, patientId, 'patient', text, nowTime]
    );

    // 3. Generate AI Vaidya Reply dynamically via Gemini API
    const systemPrompt = `You are Vaidya AI, a distinguished Senior Ayurvedic Physician & Healthcare Advisor. You specialize in classical Ayurveda, Panchakarma, Dosha balance (${dosha}), herbology, and Pathya (dietary rules). Provide clear, concise, compassionate, and structured guidance for patient queries.`;
    
    let aiText = await generateGeminiContent(text, systemPrompt);
    if (!aiText) {
      aiText = getAIResponseText(text, dosha);
    }

    // 4. Save Gemini AI Response to MySQL
    const aiMsgId = `chat-msg-${Date.now() + 1}`;
    await pool.query(
      'INSERT INTO ai_chat_messages (id, patientId, sender, text, time) VALUES (?, ?, ?, ?, ?)',
      [aiMsgId, patientId, 'ai', aiText, nowTime]
    );

    res.json({
      success: true,
      data: {
        patientMessage: { id: msgId, sender: 'patient', text, time: nowTime },
        aiResponse: { id: aiMsgId, sender: 'ai', text: aiText, time: nowTime }
      }
    });
  } catch (err) {
    console.error('Error posting chat message:', err);
    res.status(500).json({ success: false, message: 'Server error handling chat message' });
  }
};

exports.uploadMedicalRecord = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const { title, type, doctorName } = req.body;
  const pool = getPool();

  const recordId = `rec-doc-${Date.now()}`;
  const recordDate = new Date().toISOString().split('T')[0];

  try {
    await pool.query(
      `INSERT INTO patient_medical_records (id, patientId, title, type, date, doctorName, fileSize, fileUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [recordId, patientId, title, type, recordDate, doctorName || 'Self Uploaded', '1.2 MB', '#']
    );

    res.json({
      success: true,
      data: {
        id: recordId,
        title,
        type,
        date: recordDate,
        doctorName: doctorName || 'Self Uploaded',
        fileSize: '1.2 MB',
        fileUrl: '#'
      }
    });
  } catch (err) {
    console.error('Error uploading medical record:', err);
    res.status(500).json({ success: false, message: 'Server error uploading record' });
  }
};

// ─── DOCTOR PORTAL CONTROLLERS ───────────────────────────────────────────────

exports.getDoctorDashboard = async (req, res) => {
  const doctorId = req.params.id || 'dr-1';
  const pool = getPool();

  try {
    // 1. Doctor Profile
    const [doctors] = await pool.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    const doc = doctors[0];

    // Ensure array properties are parsed from JSON
    if (typeof doc.languages === 'string') doc.languages = JSON.parse(doc.languages);
    if (typeof doc.education === 'string') doc.education = JSON.parse(doc.education || '[]');
    if (typeof doc.awards === 'string') doc.awards = JSON.parse(doc.awards || '[]');
    if (typeof doc.specialExpertise === 'string') doc.specialExpertise = JSON.parse(doc.specialExpertise || '[]');

    // 2. Fetch all appointments from doctor_consultations
    const [appointments] = await pool.query(
      `SELECT * FROM doctor_consultations WHERE doctorId = ? ORDER BY appointmentDate DESC`,
      [doctorId]
    );

    // Calculate aggregated metrics
    const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
    const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
    const totalConsultations = appointments.length;

    // Doctor revenue is 85% of standard consultation fees!
    let totalEarnings = 0;
    const uniquePatients = new Set();

    appointments.forEach(a => {
      totalEarnings += parseFloat(a.doctorRevenue || 0);
      uniquePatients.add(a.patientEmail);
    });

    const uniquePatientsCount = uniquePatients.size;

    // Generate analytical metrics (Weekly Earnings chart mock data backed by database values)
    const analytics = [
      { day: 'Mon', revenue: totalEarnings * 0.12, consultations: Math.ceil(totalConsultations * 0.15) },
      { day: 'Tue', revenue: totalEarnings * 0.18, consultations: Math.ceil(totalConsultations * 0.20) },
      { day: 'Wed', revenue: totalEarnings * 0.20, consultations: Math.ceil(totalConsultations * 0.22) },
      { day: 'Thu', revenue: totalEarnings * 0.15, consultations: Math.ceil(totalConsultations * 0.15) },
      { day: 'Fri', revenue: totalEarnings * 0.25, consultations: Math.ceil(totalConsultations * 0.25) },
      { day: 'Sat', revenue: totalEarnings * 0.10, consultations: Math.ceil(totalConsultations * 0.03) }
    ];

    res.json({
      success: true,
      data: {
        profile: {
          id: doc.id,
          name: doc.name,
          specialization: doc.specialization || 'Ayurvedic Physician',
          photo: doc.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80',
          rating: parseFloat(doc.rating) || 5.0,
          totalPatients: doc.patientsTreated + uniquePatientsCount,
          experience: `${doc.experience} Years`,
          clinic: doc.clinicName || 'AyurVeda Connect Wellness Hub',
          qualifications: doc.education || ['BAMS'],
          languages: doc.languages || ['Hindi', 'English'],
          phone: doc.phone || '+91 98765 12345',
          email: doc.email,
          consultationFee: doc.consultationFee || 1000,
          joinedDate: '2026-01-01',
          specialExpertise: doc.specialExpertise || [],
          bio: doc.about || 'Senior Ayurvedic physician offering holistic treatment programs.'
        },
        stats: {
          totalPatients: doc.patientsTreated + uniquePatientsCount,
          totalEarnings: totalEarnings,
          pendingConsultations: pendingAppointments,
          completedConsultations: completedAppointments,
          consultationsCount: totalConsultations
        },
        appointments: appointments.map(a => ({
          id: a.id,
          patientName: a.patientName,
          patientAge: 32, // placeholder
          patientPhoto: a.patientName.toLowerCase().includes('rahul') 
            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80' 
            : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80',
          date: a.appointmentDate.toISOString().split('T')[0],
          time: a.appointmentTime || '10:00 AM',
          type: a.consultationType || 'Online',
          status: a.status || 'Confirmed',
          condition: a.patientName.toLowerCase().includes('priyanshi') ? 'PCOS Follow-up' : 'Vata Metabolic imbalance',
          dosha: a.patientName.toLowerCase().includes('priyanshi') ? 'Pitta-Kapha' : 'Vata',
          phone: a.patientPhone || '+91 98765 43210',
          notes: a.notes || 'Routine consultation booked via AyurVeda portal.'
        })),
        patients: Array.from(uniquePatients).map((email, idx) => {
          const apt = appointments.find(a => a.patientEmail === email);
          return {
            id: `pat-sum-${idx}`,
            name: apt ? apt.patientName : 'Ayurveda Patient',
            age: 32,
            gender: 'Female',
            dosha: apt && apt.patientName.toLowerCase().includes('priyanshi') ? 'Pitta-Kapha' : 'Vata',
            condition: apt && apt.patientName.toLowerCase().includes('priyanshi') ? 'PCOS Management' : 'Vata metabolic imbalance',
            lastVisit: apt ? apt.appointmentDate.toISOString().split('T')[0] : '2026-06-01',
            totalVisits: appointments.filter(a => a.patientEmail === email).length,
            photo: apt && apt.patientName.toLowerCase().includes('rahul') 
              ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80' 
              : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80',
            status: 'Active',
            phone: apt ? apt.patientPhone : '+91 98765 43210',
            progress: 74
          };
        }),
        analytics
      }
    });
  } catch (err) {
    console.error('Error fetching doctor dashboard:', err);
    res.status(500).json({ success: false, message: 'Server error loading doctor portal data' });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  const doctorId = req.params.id || 'dr-1';
  const { specialization, qualification, experience, clinicName, city, phone, email, bio } = req.body;
  const pool = getPool();

  try {
    await pool.query(
      `UPDATE doctors SET 
         specialization = ?, 
         qualification = ?, 
         experience = ?, 
         clinicName = ?, 
         city = ?, 
         phone = ?, 
         email = ?, 
         about = ? 
       WHERE id = ?`,
      [specialization, qualification, parseInt(experience, 10) || 5, clinicName, city, phone, email, bio, doctorId]
    );

    res.json({ success: true, message: 'Doctor profile updated successfully' });
  } catch (err) {
    console.error('Error updating doctor profile:', err);
    res.status(500).json({ success: false, message: 'Server error saving doctor settings' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const pool = getPool();

  try {
    await pool.query("UPDATE doctor_consultations SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: `Appointment status updated to ${status} successfully` });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ success: false, message: 'Server error updating appointment status' });
  }
};

exports.logProgressPoint = async (req, res) => {
  const patientId = req.headers['x-user-id'] || 'pat-123';
  const { chartType, name, progress, target } = req.body;
  const pool = getPool();

  if (!chartType || !name || progress === undefined || target === undefined) {
    return res.status(400).json({ success: false, message: 'chartType, name, progress, and target are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM patient_recovery_tracker WHERE patientId = ?', [patientId]);
    
    let tracker;
    if (rows.length === 0) {
      const defaultWeekly = [
        { name: 'Wk 1', progress: 10, target: 15 },
        { name: 'Wk 2', progress: 25, target: 30 }
      ];
      const defaultMonthly = [
        { name: 'Apr', progress: 30, target: 40 }
      ];
      await pool.query(
        `INSERT INTO patient_recovery_tracker (patientId, conditionName, progress, startDate, expectedCompletion, weeklyMetrics, monthlyMetrics)
         VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), ?, ?)`,
        [patientId, 'PCOS & Metabolism Imbalance', parseInt(progress, 10), JSON.stringify(defaultWeekly), JSON.stringify(defaultMonthly)]
      );
      const [newRows] = await pool.query('SELECT * FROM patient_recovery_tracker WHERE patientId = ?', [patientId]);
      tracker = newRows[0];
    } else {
      tracker = rows[0];
    }

    let weekly = typeof tracker.weeklyMetrics === 'string' ? JSON.parse(tracker.weeklyMetrics) : (tracker.weeklyMetrics || []);
    let monthly = typeof tracker.monthlyMetrics === 'string' ? JSON.parse(tracker.monthlyMetrics) : (tracker.monthlyMetrics || []);

    const newPoint = {
      name,
      progress: parseInt(progress, 10),
      target: parseInt(target, 10)
    };

    if (chartType === 'weekly') {
      const idx = weekly.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      if (idx !== -1) {
        weekly[idx] = newPoint;
      } else {
        weekly.push(newPoint);
      }
      if (weekly.length > 8) weekly.shift();
    } else {
      const idx = monthly.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
      if (idx !== -1) {
        monthly[idx] = newPoint;
      } else {
        monthly.push(newPoint);
      }
      if (monthly.length > 6) monthly.shift();
    }

    const updatedProgress = parseInt(progress, 10);

    await pool.query(
      `UPDATE patient_recovery_tracker 
       SET progress = ?, weeklyMetrics = ?, monthlyMetrics = ? 
       WHERE patientId = ?`,
      [updatedProgress, JSON.stringify(weekly), JSON.stringify(monthly), patientId]
    );

    res.json({
      success: true,
      message: 'Recovery progress logged successfully.',
      data: {
        condition: tracker.conditionName,
        progress: updatedProgress,
        weeklyMetrics: weekly,
        monthlyMetrics: monthly
      }
    });
  } catch (err) {
    console.error('Error logging recovery progress:', err);
    res.status(500).json({ success: false, message: 'Server error saving progress log' });
  }
};
