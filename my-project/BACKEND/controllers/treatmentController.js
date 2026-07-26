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

    const { generateGeminiContent } = require('../config/gemini');
    const syncedTreatments = [];

    for (const row of rows) {
      console.log(`🤖 Syncing "${row.name}" with Gemini AI...`);
      const prompt = `You are a Master Vaidya and Chief Panchakarma Director. Provide authoritative, real-world clinical details for the Ayurvedic treatment protocol: "${row.name}" (Category: ${row.category}).

Return ONLY a valid JSON object matching the following structure exactly without markdown codeblock formatting:
{
  "description": "2-sentence executive summary of the therapy",
  "overview": "Detailed clinical overview explaining physiological mechanism and bio-energy targeted",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
  "procedure": "Detailed step-by-step clinical methodology of how Vaidyas perform this procedure",
  "duration": "e.g. 7 - 14 Days",
  "recoveryTime": "e.g. 2 - 3 Days",
  "suitableFor": ["Condition/Dosha 1", "Condition/Dosha 2", "Condition 3"],
  "contraindications": ["Contraindication 1", "Contraindication 2"],
  "precautions": ["Precaution 1", "Precaution 2"],
  "steps": [
    { "stepNumber": 1, "title": "Poorva Karma (Preparation)", "description": "Pre-treatment oleation and warm oil prep", "duration": "3 Days" },
    { "stepNumber": 2, "title": "Pradhana Karma (Main Procedure)", "description": "Core therapeutic procedure execution", "duration": "7 Days" },
    { "stepNumber": 3, "title": "Paschat Karma (Post-Care)", "description": "Post-treatment dietary restoration (Samsarjana Krama)", "duration": "3 Days" }
  ],
  "faq": [
    { "question": "What should I eat during this treatment?", "answer": "Follow a strict Samsarjana Krama diet consisting of warm rice gruel, light Mung soups, and warm water." }
  ],
  "modernData": {
    "mechanismOfAction": "Modern biological & neurological explanation of therapeutic action",
    "recommendedCourse": "Standard clinical frequency"
  }
}`;

      let aiData = null;
      try {
        const responseText = await generateGeminiContent(prompt, "You output pure JSON objects without markdown block formatting.");
        if (responseText) {
          let clean = responseText.trim();
          if (clean.startsWith('```')) {
            clean = clean.replace(/^```(json)?/, '').replace(/```$/, '').trim();
          }
          aiData = JSON.parse(clean);
        }
      } catch (err) {
        console.error(`Gemini sync failed for ${row.name}:`, err.message);
      }

      if (aiData) {
        const benefits = JSON.stringify(aiData.benefits || []);
        const suitableFor = JSON.stringify(aiData.suitableFor || []);
        const contraindications = JSON.stringify(aiData.contraindications || []);
        const precautions = JSON.stringify(aiData.precautions || []);
        const steps = JSON.stringify(aiData.steps || []);
        const faq = JSON.stringify(aiData.faq || []);
        const modernData = JSON.stringify(aiData.modernData || {});

        await pool.query(`
          UPDATE treatments SET
            description = ?, overview = ?, benefits = ?, \`procedure\` = ?,
            duration = ?, recoveryTime = ?, suitableFor = ?, contraindications = ?,
            precautions = ?, steps = ?, faq = ?, modernData = ?
          WHERE id = ?
        `, [
          aiData.description, aiData.overview, benefits, aiData.procedure,
          aiData.duration, aiData.recoveryTime, suitableFor, contraindications,
          precautions, steps, faq, modernData, row.id
        ]);

        syncedTreatments.push({
          id: row.id,
          name: row.name,
          status: "Synced"
        });
      }
    }

    // Write all fresh synced treatments to treatments.json
    const [freshRows] = await pool.query("SELECT * FROM treatments");
    const jsonOutputPath = path.join(__dirname, '..', 'data', 'treatments.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(freshRows.map(parseTreatmentJsonFields), null, 2), 'utf-8');

    res.json({
      message: "Successfully synchronized all treatments using Gemini API real-time data.",
      count: freshRows.length,
      treatments: freshRows.map(parseTreatmentJsonFields)
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

exports.createTreatment = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });

    const {
      name, slug, category, description, overview, benefits,
      procedure, duration, recoveryTime, costEstimate,
      suitableFor, contraindications, precautions, steps, image, rating
    } = req.body;

    const id = `trt-${Date.now()}`;
    const slugVal = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await pool.query(`
      INSERT INTO treatments (
        id, name, slug, category, description, overview, benefits,
        \`procedure\`, duration, recoveryTime, costEstimate,
        suitableFor, contraindications, precautions, steps, image, rating, reviewCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      id, name, slugVal, category, description, overview, JSON.stringify(benefits || []),
      procedure, duration, recoveryTime, parseInt(costEstimate || 3000, 10),
      JSON.stringify(suitableFor || []), JSON.stringify(contraindications || []),
      JSON.stringify(precautions || []), JSON.stringify(steps || []), image, parseFloat(rating || 5.0)
    ]);

    const [rows] = await pool.query("SELECT * FROM treatments WHERE id = ?", [id]);
    res.status(201).json(parseTreatmentJsonFields(rows[0]));
  } catch (err) {
    next(err);
  }
};

exports.updateTreatment = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });
    const { id } = req.params;

    const {
      name, slug, category, description, overview, benefits,
      procedure, duration, recoveryTime, costEstimate,
      suitableFor, contraindications, precautions, steps, image, rating
    } = req.body;

    await pool.query(`
      UPDATE treatments SET
        name = ?, slug = ?, category = ?, description = ?, overview = ?,
        benefits = ?, \`procedure\` = ?, duration = ?, recoveryTime = ?,
        costEstimate = ?, suitableFor = ?, contraindications = ?,
        precautions = ?, steps = ?, image = ?, rating = ?
      WHERE id = ?
    `, [
      name, slug, category, description, overview, JSON.stringify(benefits || []),
      procedure, duration, recoveryTime, parseInt(costEstimate, 10),
      JSON.stringify(suitableFor || []), JSON.stringify(contraindications || []),
      JSON.stringify(precautions || []), JSON.stringify(steps || []), image, parseFloat(rating),
      id
    ]);

    const [rows] = await pool.query("SELECT * FROM treatments WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Treatment not found" });
    res.json(parseTreatmentJsonFields(rows[0]));
  } catch (err) {
    next(err);
  }
};

exports.deleteTreatment = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: "Database offline" });
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM treatments WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Treatment not found" });

    await pool.query("DELETE FROM treatments WHERE id = ?", [id]);
    res.json({ message: "Treatment deleted successfully", id });
  } catch (err) {
    next(err);
  }
};
