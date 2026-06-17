// BACKEND/controllers/clinicController.js
const { MOCK_CLINICS, MOCK_TESTIMONIALS } = require('../models/clinicModel');
const { MOCK_DOCTORS } = require('../models/doctorModel');

exports.getClinics = (req, res, next) => {
  try {
    const { name, city, service } = req.query;
    let results = [...MOCK_CLINICS];

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

exports.getPanchakarmaCenters = (req, res, next) => {
  try {
    const centers = MOCK_CLINICS.filter(c => c.type === "Panchakarma Center");
    res.json(centers);
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedClinics = (req, res, next) => {
  try {
    const featured = MOCK_CLINICS.filter(c => c.rating >= 4.8);
    res.json(featured);
  } catch (err) {
    next(err);
  }
};

exports.getCities = (req, res, next) => {
  try {
    const cities = Array.from(new Set(MOCK_CLINICS.map(c => c.city)));
    res.json(cities);
  } catch (err) {
    next(err);
  }
};

exports.getServices = (req, res, next) => {
  try {
    const servicesSet = new Set();
    MOCK_CLINICS.forEach(c => c.services.forEach(s => servicesSet.add(s)));
    res.json(Array.from(servicesSet));
  } catch (err) {
    next(err);
  }
};

exports.getClinicById = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    if (clinic) {
      res.json(clinic);
    } else {
      res.status(404).json({ error: "Clinic not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getClinicDoctors = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }
    const doctors = MOCK_DOCTORS.filter(d => 
      d.clinicName.toLowerCase().includes(clinic.name.toLowerCase().split(' ')[0]) ||
      d.city.toLowerCase() === clinic.city.toLowerCase()
    );
    res.json(doctors.length > 0 ? doctors : MOCK_DOCTORS.slice(0, 3));
  } catch (err) {
    next(err);
  }
};

exports.getClinicServices = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
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

exports.getClinicReviews = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
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

exports.getClinicGallery = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    if (clinic) {
      res.json(clinic.gallery || []);
    } else {
      res.status(404).json({ error: "Clinic not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getClinicPackages = (req, res, next) => {
  try {
    const clinic = MOCK_CLINICS.find(c => c.id === req.params.id);
    if (clinic) {
      res.json(clinic.packages || []);
    } else {
      res.status(404).json({ error: "Clinic not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTestimonials = (req, res, next) => {
  try {
    res.json(MOCK_TESTIMONIALS);
  } catch (err) {
    next(err);
  }
};
