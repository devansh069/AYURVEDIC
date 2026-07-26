// BACKEND/controllers/doctorController.js
const { getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const parseDocJsonFields = (doc) => {
  if (!doc) return doc;
  const parsed = { ...doc };
  
  parsed.onlineConsultation = !!parsed.onlineConsultation;
  parsed.offlineConsultation = !!parsed.offlineConsultation;
  parsed.verified = !!parsed.verified;
  
  const jsonFields = ['languages', 'education', 'awards', 'specialExpertise', 'scientificData'];
  jsonFields.forEach(field => {
    if (parsed[field]) {
      if (typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          parsed[field] = field === 'scientificData' ? null : [];
        }
      }
    } else {
      parsed[field] = field === 'scientificData' ? null : [];
    }
  });
  return parsed;
};

const loadSeedData = (filename) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Error loading doctors seed data from ${filename}:`, e.message);
  }
  return [];
};

exports.getDoctors = async (req, res, next) => {
  try {
    const pool = getPool();
    const { specialization, city, search } = req.query;

    let baseQuery = "SELECT * FROM doctors WHERE 1=1";
    const queryParams = [];

    if (specialization) {
      baseQuery += " AND (specialization LIKE ? OR specialization LIKE ?)";
      queryParams.push(`%${specialization}%`, `%${specialization.split(' ')[0]}%`);
    }
    if (city) {
      baseQuery += " AND city = ?";
      queryParams.push(city);
    }
    if (search) {
      baseQuery += " AND (name LIKE ? OR specialization LIKE ? OR qualification LIKE ?)";
      const sq = `%${search}%`;
      queryParams.push(sq, sq, sq);
    }

    if (!pool) {
      let list = loadSeedData('doctors.json').map(parseDocJsonFields);
      if (specialization) {
        list = list.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
      }
      if (city) {
        list = list.filter(d => d.city.toLowerCase() === city.toLowerCase());
      }
      if (search) {
        list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json(list);
    }

    const [rows] = await pool.query(baseQuery, queryParams);
    res.json(rows.map(parseDocJsonFields));
  } catch (err) {
    next(err);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const pool = getPool();
    const id = req.params.id;

    if (pool) {
      const [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [id]);
      if (rows && rows.length > 0) {
        return res.json(parseDocJsonFields(rows[0]));
      }
    }

    const doctors = loadSeedData('doctors.json');
    const found = doctors.find(d => d.id === id);
    if (found) {
      res.json(parseDocJsonFields(found));
    } else {
      res.status(404).json({ error: "Doctor profile not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getSpecializations = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const doctors = loadSeedData('doctors.json');
      const specs = Array.from(new Set(doctors.map(d => d.specialization)));
      return res.json(specs);
    }
    const [rows] = await pool.query("SELECT DISTINCT specialization FROM doctors");
    if (rows && rows.length > 0) {
      res.json(rows.map(r => r.specialization).filter(Boolean));
    } else {
      const doctors = loadSeedData('doctors.json');
      const specs = Array.from(new Set(doctors.map(d => d.specialization)));
      res.json(specs);
    }
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedDoctors = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const doctors = loadSeedData('doctors.json');
      const sorted = [...doctors].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);
      return res.json(sorted.map(parseDocJsonFields));
    }
    const [rows] = await pool.query("SELECT * FROM doctors ORDER BY rating DESC, reviewCount DESC LIMIT 8");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseDocJsonFields));
    } else {
      const doctors = loadSeedData('doctors.json');
      const sorted = [...doctors].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);
      res.json(sorted.map(parseDocJsonFields));
    }
  } catch (err) {
    next(err);
  }
};

exports.getTopRatedDoctors = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const doctors = loadSeedData('doctors.json');
      const sorted = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 5);
      return res.json(sorted.map(parseDocJsonFields));
    }
    const [rows] = await pool.query("SELECT * FROM doctors ORDER BY rating DESC LIMIT 5");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseDocJsonFields));
    } else {
      const doctors = loadSeedData('doctors.json');
      const sorted = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 5);
      res.json(sorted.map(parseDocJsonFields));
    }
  } catch (err) {
    next(err);
  }
};

exports.getDoctorReviews = async (req, res, next) => {
  try {
    const pool = getPool();
    const doctorId = req.params.id;

    if (!pool) {
      return res.json([
        { id: `rev-${doctorId}-1`, doctorId, patientName: "Ananya Mehta", rating: 5, comment: "Excellent consulting! The treatment plan was holistic and highly customized.", createdAt: "2026-06-05" },
        { id: `rev-${doctorId}-2`, doctorId, patientName: "Rahul Sharma", rating: 5, comment: "Very detailed explanations about my dosha imbalance. Felt very secure.", createdAt: "2026-06-02" }
      ]);
    }

    let [rows] = await pool.query("SELECT * FROM doctor_reviews WHERE doctorId = ? ORDER BY createdAt DESC", [doctorId]);

    if (rows.length === 0) {
      const sampleComments = [
        "Highly experienced Vaidya. The pulse diagnosis (Nadi Pariksha) was spot on!",
        "Excellent consultation. They explained the dietary pathya and apathya in great detail.",
        "Very satisfied with the treatment plan. I've noticed a major improvement in my symptoms.",
        "Great experience! The doctor was very patient and answered all my questions regarding my dosha imbalance.",
        "A highly knowledgeable doctor who blends traditional healing with practical lifestyle advice."
      ];
      const names = ["Aarav Patel", "Priya Nair", "Vikram Singh", "Deepa Sharma", "Rohan Mehta"];

      for (let i = 0; i < 3; i++) {
        const id = `rev-${doctorId}-${i + 1}`;
        const patientName = names[i % names.length];
        const rating = (4.5 + Math.random() * 0.5);
        const comment = sampleComments[i % sampleComments.length];
        
        await pool.query(
          "INSERT INTO doctor_reviews (id, doctorId, patientName, rating, comment) VALUES (?, ?, ?, ?, ?)",
          [id, doctorId, patientName, rating, comment]
        );
      }

      [rows] = await pool.query("SELECT * FROM doctor_reviews WHERE doctorId = ? ORDER BY createdAt DESC", [doctorId]);
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.addDoctorReview = async (req, res, next) => {
  try {
    const pool = getPool();
    const doctorId = req.params.id;
    const { patientName, rating, comment } = req.body;

    if (!patientName || !rating) {
      return res.status(400).json({ error: "Patient name and rating are required." });
    }

    const id = `rev-user-${Date.now()}`;
    if (!pool) {
      return res.status(500).json({ error: "Database offline. Unable to save review." });
    }

    await pool.query(
      "INSERT INTO doctor_reviews (id, doctorId, patientName, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [id, doctorId, patientName, parseFloat(rating), comment || '']
    );

    const [avgRows] = await pool.query(
      "SELECT AVG(rating) as avgRating, COUNT(*) as count FROM doctor_reviews WHERE doctorId = ?",
      [doctorId]
    );
    if (avgRows && avgRows[0].count > 0) {
      await pool.query(
        "UPDATE doctors SET rating = ?, reviewCount = ? WHERE id = ?",
        [parseFloat(avgRows[0].avgRating || 5.0).toFixed(2), avgRows[0].count, doctorId]
      );
    }

    res.status(201).json({
      message: "Review added successfully.",
      review: { id, doctorId, patientName, rating, comment }
    });
  } catch (err) {
    next(err);
  }
};

exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const pool = getPool();
    let availability = "Mon-Sat, 9:00 AM - 5:00 PM";
    
    if (pool) {
      const [rows] = await pool.query("SELECT availability FROM doctors WHERE id = ?", [req.params.id]);
      if (rows && rows.length > 0) {
        availability = rows[0].availability;
      }
    }
    
    res.json({
      availability,
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]
    });
  } catch (err) {
    next(err);
  }
};

exports.syncDoctors = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const [rows] = await pool.query("SELECT * FROM doctors");
    if (rows.length === 0) {
      return res.status(400).json({ error: "No doctors found in database to sync." });
    }

    const WIKI_MAPPING = {
      'Panchakarma': 'Panchakarma',
      'Skin Disorders': 'Dermatology',
      'Skin Care': 'Dermatology',
      'Digestive Disorders': 'Gastroenterology',
      'PCOS Care': 'Polycystic_ovary_syndrome',
      'PCOS': 'Polycystic_ovary_syndrome',
      'Infertility Care': 'Infertility',
      'Infertility': 'Infertility',
      'Stress Management': 'Stress_management',
      'Weight Loss': 'Weight_loss',
      'Weight Management': 'Weight_loss',
      'Hair Care': 'Hair_care',
      'Diabetes Management': 'Diabetes',
      'Diabetes': 'Diabetes',
      'Arthritis Care': 'Arthritis',
      'Arthritis': 'Arthritis',
      'Women\'s Health': 'Women\'s_health',
      'Mental Wellness': 'Mental_health'
    };

    const syncedDocs = [];

    for (const row of rows) {
      const wikiTerm = WIKI_MAPPING[row.specialization] || 'Ayurveda';

      let wikiExtract = null;
      let wikiImage = null;

      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTerm)}`);
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          wikiExtract = wikiData.extract || null;
          if (wikiData.thumbnail && wikiData.thumbnail.source) {
            wikiImage = wikiData.thumbnail.source;
          }
        }
      } catch (err) {
        console.error(`Wikipedia sync failed for doctor specialization ${row.specialization}:`, err.message);
      }

      const scientificData = {
        wikiExtract,
        wikiImage,
        wikiTerm,
        lastSynced: new Date().toISOString()
      };

      await pool.query(
        "UPDATE doctors SET scientificData = ? WHERE id = ?",
        [JSON.stringify(scientificData), row.id]
      );

      syncedDocs.push({
        id: row.id,
        name: row.name,
        specialization: row.specialization,
        scientificData
      });
    }

    // Rewrite doctors.json so it matches the DB sync data (satisfies "create a separate file for doctor page in which all the data is save")
    const [freshRows] = await pool.query("SELECT * FROM doctors");
    const jsonOutputPath = path.join(__dirname, '..', 'data', 'doctors.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(freshRows.map(parseDocJsonFields), null, 2), 'utf-8');

    res.json({
      message: "Successfully synced real-time Wikipedia specialization summaries for all doctors.",
      count: syncedDocs.length,
      doctors: syncedDocs
    });
  } catch (err) {
    next(err);
  }
};

exports.bookConsultation = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const {
      doctorId,
      doctorName,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      consultationType,
      consultationFee
    } = req.body;

    if (!doctorId || !patientName || !patientEmail || !appointmentDate) {
      return res.status(400).json({ error: "Missing required booking details (doctorId, patientName, patientEmail, or date)." });
    }

    const fee = parseInt(consultationFee || 500, 10);
    
    // Revenue calculations: 85% to doctor (user), 15% to platform (owner)
    const platformRevenue = parseFloat((fee * 0.15).toFixed(2));
    const doctorRevenue = parseFloat((fee * 0.85).toFixed(2));

    // Simulated Paytm payment metadata
    const paymentMethod = 'Paytm';
    const paymentStatus = 'Paid';
    const paymentTxnId = `TXN-PAYTM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const id = `ap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await pool.query(`
      INSERT INTO doctor_consultations (
        id, doctorId, doctorName, patientName, patientEmail, patientPhone,
        appointmentDate, appointmentTime, consultationType, consultationFee,
        paymentMethod, paymentStatus, paymentTxnId, doctorRevenue, platformRevenue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, doctorId, doctorName, patientName, patientEmail, patientPhone,
      appointmentDate, appointmentTime, consultationType, fee,
      paymentMethod, paymentStatus, paymentTxnId, doctorRevenue, platformRevenue
    ]);

    const [rows] = await pool.query("SELECT * FROM doctor_consultations WHERE id = ?", [id]);
    res.status(201).json({
      message: "Consultation booked successfully with Paytm split revenue calculation.",
      booking: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }
    const [rows] = await pool.query("SELECT * FROM doctor_consultations ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
