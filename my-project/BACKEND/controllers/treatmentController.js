// BACKEND/controllers/treatmentController.js
const { getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const parseTreatmentJsonFields = (trt) => {
  if (!trt) return trt;
  const parsed = { ...trt };
  const jsonFields = [
    'benefits', 'suitableFor', 'contraindications', 'precautions', 'steps', 'faq', 'modernData'
  ];
  jsonFields.forEach(field => {
    if (parsed[field]) {
      if (typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          parsed[field] = field === 'modernData' ? null : [];
        }
      }
    } else {
      parsed[field] = field === 'modernData' ? null : [];
    }
  });
  return parsed;
};

// Fallback arrays loaded from json seed files if database is offline
const loadSeedData = (filename) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Error loading seed fallback data for ${filename}:`, e.message);
  }
  return [];
};

exports.getTreatmentCategories = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(loadSeedData('treatment_categories.json'));
    }
    const [rows] = await pool.query("SELECT * FROM treatment_categories");
    if (rows && rows.length > 0) {
      res.json(rows);
    } else {
      res.json(loadSeedData('treatment_categories.json'));
    }
  } catch (err) {
    next(err);
  }
};

exports.getTreatments = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(loadSeedData('treatments.json'));
    }
    const [rows] = await pool.query("SELECT * FROM treatments");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseTreatmentJsonFields));
    } else {
      res.json(loadSeedData('treatments.json').map(parseTreatmentJsonFields));
    }
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentById = async (req, res, next) => {
  try {
    const pool = getPool();
    const id = req.params.id;

    if (pool) {
      const [rows] = await pool.query("SELECT * FROM treatments WHERE id = ? OR slug = ?", [id, id]);
      if (rows && rows.length > 0) {
        return res.json(parseTreatmentJsonFields(rows[0]));
      }
    }

    const treatments = loadSeedData('treatments.json');
    const found = treatments.find(t => t.id === id || t.slug === id);
    if (found) {
      res.json(parseTreatmentJsonFields(found));
    } else {
      res.status(404).json({ error: "Treatment profile not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPopularTreatments = async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM treatments WHERE rating >= 4.9");
      if (rows && rows.length > 0) {
        return res.json(rows.map(parseTreatmentJsonFields));
      }
    }

    const treatments = loadSeedData('treatments.json');
    const popular = treatments.filter(t => t.rating >= 4.9);
    res.json(popular.map(parseTreatmentJsonFields));
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedTreatments = async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM treatments LIMIT 5 OFFSET 4");
      if (rows && rows.length > 0) {
        return res.json(rows.map(parseTreatmentJsonFields));
      }
    }

    const treatments = loadSeedData('treatments.json');
    const recommended = treatments.slice(4, 9);
    res.json(recommended.map(parseTreatmentJsonFields));
  } catch (err) {
    next(err);
  }
};

exports.syncTreatments = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const [rows] = await pool.query("SELECT * FROM treatments");
    if (rows.length === 0) {
      return res.status(400).json({ error: "No treatments found in database to sync." });
    }

    const WIKI_MAPPING = {
      'panchakarma': 'Panchakarma',
      'vamana': 'Vamana',
      'virechana': 'Virechana',
      'basti': 'Basti_(treatment)',
      'nasya': 'Nasya',
      'raktamokshana': 'Bloodletting',
      'abhyanga': 'Abhyanga',
      'shirodhara': 'Shirodhara',
      'udvartana': 'Udvartana',
      'herbal-therapy': 'Herbal_medicine',
      'detox-therapy': 'Detoxification',
      'yoga-therapy': 'Yoga_as_therapy',
      'stress-management-program': 'Stress_management',
      'weight-management-program': 'Weight_management',
      'pcos-wellness-program': 'Polycystic_ovary_syndrome'
    };

    const syncedTreatments = [];

    for (const row of rows) {
      const wikiTerm = WIKI_MAPPING[row.slug] || row.name;

      let wikiExtract = null;
      let wikiImage = null;

      // Fetch from Wikipedia
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
        console.error(`Wikipedia sync failed for ${row.name}:`, err.message);
      }

      const modernData = {
        wikiExtract,
        wikiImage,
        lastSynced: new Date().toISOString()
      };

      // Save into MySQL
      await pool.query(
        "UPDATE treatments SET modernData = ? WHERE id = ?",
        [JSON.stringify(modernData), row.id]
      );

      syncedTreatments.push({
        id: row.id,
        name: row.name,
        modernData
      });
    }

    res.json({
      message: "Successfully synced real-time Wikipedia data for all treatments.",
      count: syncedTreatments.length,
      treatments: syncedTreatments
    });
  } catch (err) {
    next(err);
  }
};

exports.bookTreatment = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const {
      treatmentId,
      treatmentName,
      patientName,
      patientEmail,
      patientPhone,
      preferredDate,
      preferredTime,
      notes
    } = req.body;

    if (!patientName || !patientEmail || !preferredDate) {
      return res.status(400).json({ error: "Missing required patient name, email, or preferred date." });
    }

    const id = `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await pool.query(`
      INSERT INTO treatment_bookings (
        id, treatmentId, treatmentName, patientName, patientEmail, patientPhone, preferredDate, preferredTime, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, treatmentId, treatmentName, patientName, patientEmail, patientPhone, preferredDate, preferredTime, notes
    ]);

    const [rows] = await pool.query("SELECT * FROM treatment_bookings WHERE id = ?", [id]);
    res.status(201).json({
      message: "Treatment booking successfully created in real time.",
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
    const [rows] = await pool.query("SELECT * FROM treatment_bookings ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
