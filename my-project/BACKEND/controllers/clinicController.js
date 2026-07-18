// BACKEND/controllers/clinicController.js
const { getPool } = require('../config/db');
const { MOCK_CLINICS, MOCK_TESTIMONIALS } = require('../models/clinicModel');
const { MOCK_DOCTORS } = require('../models/doctorModel');

const parseClinicJsonFields = (clinic) => {
  if (!clinic) return clinic;
  const parsed = { ...clinic };
  
  const jsonFields = ['services', 'facilities', 'images', 'gallery', 'packages', 'openingHoursList'];
  jsonFields.forEach(field => {
    if (parsed[field]) {
      if (typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          parsed[field] = [];
        }
      }
    } else {
      parsed[field] = [];
    }
  });
  return parsed;
};

const parseDocJsonFields = (doc) => {
  if (!doc) return doc;
  const parsed = { ...doc };
  parsed.onlineConsultation = !!parsed.onlineConsultation;
  parsed.offlineConsultation = !!parsed.offlineConsultation;
  const jsonFields = ['languages', 'education', 'awards', 'specialExpertise'];
  jsonFields.forEach(field => {
    if (parsed[field]) {
      if (typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          parsed[field] = [];
        }
      }
    } else {
      parsed[field] = [];
    }
  });
  return parsed;
};

exports.getClinics = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(MOCK_CLINICS);
    }
    const { name, city, service } = req.query;
    const [rows] = await pool.query("SELECT * FROM clinics");
    
    let results = rows.length > 0 ? rows.map(parseClinicJsonFields) : [...MOCK_CLINICS];

    if (name) {
      results = results.filter(c => c.name.toLowerCase().includes(name.toString().toLowerCase()));
    }
    if (city) {
      results = results.filter(c => c.city.toLowerCase() === city.toString().toLowerCase());
    }
    if (service) {
      results = results.filter(c => c.services.some(s => s.toLowerCase() === service.toString().toLowerCase()));
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getPanchakarmaCenters = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const centers = MOCK_CLINICS.filter(c => c.type === "Panchakarma Center");
      return res.json(centers);
    }
    const [rows] = await pool.query("SELECT * FROM clinics WHERE type = 'Panchakarma Center'");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseClinicJsonFields));
    } else {
      const centers = MOCK_CLINICS.filter(c => c.type === "Panchakarma Center");
      res.json(centers);
    }
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedClinics = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const featured = MOCK_CLINICS.filter(c => c.rating >= 4.8);
      return res.json(featured);
    }
    const [rows] = await pool.query("SELECT * FROM clinics WHERE rating >= 4.8");
    if (rows && rows.length > 0) {
      res.json(rows.map(parseClinicJsonFields));
    } else {
      const featured = MOCK_CLINICS.filter(c => c.rating >= 4.8);
      res.json(featured);
    }
  } catch (err) {
    next(err);
  }
};

exports.getCities = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const mockCities = Array.from(new Set(MOCK_CLINICS.map(c => c.city)));
      return res.json(mockCities);
    }
    const [rows] = await pool.query("SELECT DISTINCT city FROM clinics");
    if (rows && rows.length > 0) {
      res.json(rows.map(r => r.city).filter(Boolean));
    } else {
      const mockCities = Array.from(new Set(MOCK_CLINICS.map(c => c.city)));
      res.json(mockCities);
    }
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const servicesSet = new Set();
      MOCK_CLINICS.forEach(c => c.services.forEach(s => servicesSet.add(s)));
      return res.json(Array.from(servicesSet));
    }
    const [rows] = await pool.query("SELECT * FROM clinics");
    const clinicsList = rows.length > 0 ? rows.map(parseClinicJsonFields) : MOCK_CLINICS;
    const servicesSet = new Set();
    clinicsList.forEach(c => c.services.forEach(s => servicesSet.add(s)));
    res.json(Array.from(servicesSet));
  } catch (err) {
    next(err);
  }
};

exports.getClinicById = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      const mockClinic = MOCK_CLINICS.find(c => c.id === req.params.id);
      return mockClinic ? res.json(mockClinic) : res.status(404).json({ error: "Clinic not found" });
    }
    const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
    if (rows && rows.length > 0) {
      res.json(parseClinicJsonFields(rows[0]));
    } else {
      const mockClinic = MOCK_CLINICS.find(c => c.id === req.params.id);
      if (mockClinic) {
        res.json(mockClinic);
      } else {
        res.status(404).json({ error: "Clinic not found" });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.getClinicDoctors = async (req, res, next) => {
  try {
    const pool = getPool();
    let clinic = null;
    let doctors = MOCK_DOCTORS;

    if (pool) {
      const [clinicRows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
      if (clinicRows && clinicRows.length > 0) {
        clinic = parseClinicJsonFields(clinicRows[0]);
      }
      
      const [doctorRows] = await pool.query("SELECT * FROM doctors");
      if (doctorRows && doctorRows.length > 0) {
        doctors = doctorRows.map(parseDocJsonFields);
      }
    }
    
    if (!clinic) {
      clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    }
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    const filteredDoctors = doctors.filter(d => 
      d.clinicName.toLowerCase().includes(clinic.name.toLowerCase().split(' ')[0]) ||
      d.city.toLowerCase() === clinic.city.toLowerCase()
    );
    res.json(filteredDoctors.length > 0 ? filteredDoctors : doctors.slice(0, 3));
  } catch (err) {
    next(err);
  }
};

exports.getClinicServices = async (req, res, next) => {
  try {
    const pool = getPool();
    let clinic = null;
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
      if (rows && rows.length > 0) {
        clinic = parseClinicJsonFields(rows[0]);
      }
    }
    if (!clinic) {
      clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    }
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    const allServicesDetails = [
      { id: 's-panch', name: 'Panchakarma', description: 'Classical fivefold detoxification and rejuvenation therapies.', icon: 'Activity' },
      { id: 's-abhy', name: 'Abhyanga', description: 'Warm herbal oil body massage to soothe Vata and lubricate tissues.', icon: 'Sparkles' },
      { id: 's-shir', name: 'Shirodhara', description: 'Pouring warm medicated liquid on the forehead to calm nervous pathways.', icon: 'Compass' },
      { id: 's-nasya', name: 'Nasya', description: 'Nasal drops of herbal oils to clear sinuses and tension headaches.', icon: 'Wind' },
      { id: 's-vaman', name: 'Vamana', description: 'Therapeutic vomiting targeting aggravated Kapha lung congestion.', icon: 'ShieldAlert' },
      { id: 's-virec', name: 'Virechana', description: 'Medicated purgation flushing metabolic heat from liver and blood.', icon: 'Droplets' },
      { id: 's-basti', name: 'Basti', description: 'Medicated enema balancing Vata in joints, bones, and colon.', icon: 'Home' },
      { id: 's-weight', name: 'Weight Management', description: 'Powder massages and custom nutrition resetting fat metabolism.', icon: 'Scale' },
      { id: 's-pcos', name: 'PCOS Care', description: 'Hormonal and reproductive systems stabilization with organic herbs.', icon: 'Heart' },
      { id: 's-diab', name: 'Diabetes Care', description: 'Pancreatic support herbs and doshic diets managing blood sugar.', icon: 'Activity' },
      { id: 's-stress', name: 'Stress Management', description: 'Autonomic nervous resets combining massages and adaptogens.', icon: 'Brain' }
    ];
    const services = allServicesDetails.filter(s => 
      clinic.services.some(cs => cs.toLowerCase() === s.name.toLowerCase())
    );
    res.json(services);
  } catch (err) {
    next(err);
  }
};

exports.getClinicReviews = async (req, res, next) => {
  try {
    const pool = getPool();
    let clinic = null;
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
      if (rows && rows.length > 0) {
        clinic = parseClinicJsonFields(rows[0]);
      }
    }
    if (!clinic) {
      clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    }
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    const reviews = [
      {
        id: `rev-${clinic.id}-1`,
        clinicId: clinic.id,
        patientName: "Amit Verma",
        rating: 5,
        comment: `Excellent experience! The therapists at ${clinic.name} are highly skilled. I underwent a Panchakarma cycle and feel entirely revitalized.`,
        date: "2026-06-01",
        recoveryResult: "Underwent 7-day Panchakarma; resolved chronic bloating and low back stiffness."
      },
      {
        id: `rev-${clinic.id}-2`,
        clinicId: clinic.id,
        patientName: "Sunita Deshmukh",
        rating: 4,
        comment: `Very clean and hygienic rooms. The doctor spent 30 minutes reading my pulse and analyzing my dosha. The custom oils are very therapeutic.`,
        date: "2026-05-24",
        recoveryResult: "Completed Shirodhara therapy; migraine frequency reduced from twice weekly to zero."
      }
    ];
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.getClinicGallery = async (req, res, next) => {
  try {
    const pool = getPool();
    let clinic = null;
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
      if (rows && rows.length > 0) {
        clinic = parseClinicJsonFields(rows[0]);
      }
    }
    if (clinic) {
      res.json(clinic.gallery || []);
    } else {
      const mockClinic = MOCK_CLINICS.find(c => c.id === req.params.id);
      res.json(mockClinic ? (mockClinic.gallery || []) : []);
    }
  } catch (err) {
    next(err);
  }
};

exports.getClinicPackages = async (req, res, next) => {
  try {
    const pool = getPool();
    let clinic = null;
    if (pool) {
      const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [req.params.id]);
      if (rows && rows.length > 0) {
        clinic = parseClinicJsonFields(rows[0]);
      }
    }
    if (clinic) {
      res.json(clinic.packages || []);
    } else {
      const mockClinic = MOCK_CLINICS.find(c => c.id === req.params.id);
      res.json(mockClinic ? (mockClinic.packages || []) : []);
    }
  } catch (err) {
    next(err);
  }
};

exports.getTestimonials = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(MOCK_TESTIMONIALS);
    }
    const [rows] = await pool.query("SELECT * FROM testimonials");
    res.json(rows.length > 0 ? rows : MOCK_TESTIMONIALS);
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ error: "MySQL database pool is offline." });
    }

    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing latitude or longitude in request body." });
    }

    await pool.query(
      "UPDATE clinics SET latitude = ?, longitude = ? WHERE id = ?",
      [parseFloat(latitude), parseFloat(longitude), id]
    );

    const [rows] = await pool.query("SELECT * FROM clinics WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Clinic not found in database." });
    }

    // Synchronize data/clinics.json file on disk
    const [freshClinics] = await pool.query("SELECT * FROM clinics");
    const jsonOutputPath = require('path').join(__dirname, '..', 'data', 'clinics.json');
    require('fs').writeFileSync(jsonOutputPath, JSON.stringify(freshClinics.map(parseClinicJsonFields), null, 2), 'utf-8');

    res.json({
      message: "Clinic live location coordinates updated successfully in MySQL.",
      clinic: parseClinicJsonFields(rows[0])
    });
  } catch (err) {
    next(err);
  }
};
