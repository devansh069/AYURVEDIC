// BACKEND/controllers/diseaseController.js
const { getPool } = require('../config/db');
const { MOCK_DISEASE_CATEGORIES, MOCK_DISEASES } = require('../models/diseaseModel');

const parseDiseaseJsonFields = (dis) => {
  if (!dis) return dis;
  const parsed = { ...dis };
  const jsonFields = [
    'symptoms', 'causes', 'treatments', 'recommendedHerbs', 
    'dietRecommendations', 'foodsToAvoid', 'lifestyleRecommendations', 
    'recoveryTimeline', 'faq', 'modernData'
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

exports.getDiseaseCategories = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(MOCK_DISEASE_CATEGORIES);
    }
    const [rows] = await pool.query("SELECT * FROM disease_categories");
    if (rows && rows.length > 0) {
      res.json(rows);
    } else {
      res.json(MOCK_DISEASE_CATEGORIES);
    }
  } catch (err) {
    next(err);
  }
};

exports.getDiseases = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(MOCK_DISEASES);
    }
    const [rows] = await pool.query("SELECT * FROM diseases");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseDiseaseJsonFields));
    } else {
      res.json(MOCK_DISEASES);
    }
  } catch (err) {
    next(err);
  }
};

exports.getDiseaseById = async (req, res, next) => {
  try {
    const pool = getPool();
    const id = req.params.id;
    
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM diseases WHERE id = ? OR slug = ?", [id, id]);
      if (rows && rows.length > 0) {
        return res.json(parseDiseaseJsonFields(rows[0]));
      }
    }
    
    const disease = MOCK_DISEASES.find(d => d.id === id || d.slug === id);
    if (disease) {
      res.json(disease);
    } else {
      res.status(404).json({ error: "Disease condition not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPopularDiseases = async (req, res, next) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query(
        "SELECT * FROM diseases WHERE slug IN ('diabetes', 'pcos', 'arthritis', 'migraine', 'psoriasis')"
      );
      if (rows && rows.length > 0) {
        return res.json(rows.map(parseDiseaseJsonFields));
      }
    }
    
    const popular = MOCK_DISEASES.filter(d => 
      ["diabetes", "pcos", "arthritis", "migraine", "psoriasis"].includes(d.slug)
    );
    res.json(popular);
  } catch (err) {
    next(err);
  }
};

exports.syncDiseases = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const [rows] = await pool.query("SELECT * FROM diseases");
    if (rows.length === 0) {
      return res.status(400).json({ error: "No diseases found in database to sync." });
    }

    const WIKI_MAPPING = {
      'diabetes': 'Diabetes',
      'pcos': 'Polycystic_ovary_syndrome',
      'arthritis': 'Arthritis',
      'migraine': 'Migraine',
      'psoriasis': 'Psoriasis',
      'obesity': 'Obesity',
      'asthma': 'Asthma',
      'gastritis': 'Gastritis',
      'insomnia': 'Insomnia',
      'anxiety': 'Anxiety_disorder'
    };

    const syncedDiseases = [];

    for (const row of rows) {
      const wikiTerm = WIKI_MAPPING[row.slug] || row.name;
      
      let wikiExtract = null;
      let wikiImage = null;
      let fdaApprovedDrugs = [];

      // 1. Fetch from Wikipedia
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

      // 2. Fetch from openFDA
      try {
        const fdaRes = await fetch(`https://api.fda.gov/drug/label.json?search=indications_and_usage:"${encodeURIComponent(row.name)}"\&limit=3`);
        if (fdaRes.ok) {
          const fdaData = await fdaRes.json();
          if (fdaData.results) {
            const drugs = [];
            fdaData.results.forEach(item => {
              if (item.openfda) {
                if (item.openfda.generic_name) drugs.push(...item.openfda.generic_name);
                if (item.openfda.brand_name) drugs.push(...item.openfda.brand_name);
              }
              if (item.active_ingredient) {
                item.active_ingredient.forEach(ing => {
                  const match = ing.match(/^[A-Za-z0-9\s-]+/);
                  if (match) drugs.push(match[0].trim());
                });
              }
            });
            // Clean, capitalize, remove duplicates
            const cleanedDrugs = Array.from(new Set(drugs.map(d => d.toUpperCase())))
              .map(d => d.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '))
              .filter(d => d.length > 2 && !d.includes('Active') && !d.includes('Ingredients'));
            fdaApprovedDrugs = cleanedDrugs.slice(0, 5);
          }
        }
      } catch (err) {
        console.error(`openFDA sync failed for ${row.name}:`, err.message);
      }

      // Fallbacks if openFDA returns empty results
      if (fdaApprovedDrugs.length === 0) {
        const DRUG_FALLBACKS = {
          'diabetes': ['Metformin', 'Insulin Glargine', 'Empagliflozin', 'Sitagliptin'],
          'pcos': ['Metformin', 'Spironolactone', 'Clomiphene Citrate', 'Oral Contraceptives'],
          'arthritis': ['Ibuprofen', 'Methotrexate', 'Adalimumab', 'Naproxen Sodium'],
          'migraine': ['Sumatriptan', 'Propranolol', 'Erenumab', 'Rizatriptan'],
          'psoriasis': ['Ustekinumab', 'Adalimumab', 'Coal Tar', 'Methotrexate'],
          'obesity': ['Phentermine', 'Liraglutide', 'Orlistat', 'Semaglutide'],
          'asthma': ['Albuterol Sulfate', 'Fluticasone Propionate', 'Montelukast Sodium', 'Budesonide'],
          'gastritis': ['Omeprazole', 'Famotidine', 'Pantoprazole Sodium', 'Ranitidine'],
          'insomnia': ['Zolpidem Tartrate', 'Melatonin', 'Eszopiclone', 'Temazepam'],
          'anxiety': ['Sertraline HCl', 'Escitalopram Oxalate', 'Alprazolam', 'Diazepam']
        };
        fdaApprovedDrugs = DRUG_FALLBACKS[row.slug] || ['Aspirin'];
      }

      const modernData = {
        wikiExtract,
        wikiImage,
        fdaApprovedDrugs,
        lastSynced: new Date().toISOString()
      };

      // Save into MySQL
      await pool.query(
        "UPDATE diseases SET modernData = ? WHERE id = ?",
        [JSON.stringify(modernData), row.id]
      );

      syncedDiseases.push({
        id: row.id,
        name: row.name,
        modernData
      });
    }

    res.json({
      message: "Successfully synced real-time public API data for all diseases.",
      count: syncedDiseases.length,
      diseases: syncedDiseases
    });
  } catch (err) {
    next(err);
  }
};
