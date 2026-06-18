// BACKEND/controllers/treatmentController.js
const { MOCK_TREATMENT_CATEGORIES, MOCK_TREATMENTS } = require('../models/treatmentModel');
const { MOCK_DOCTORS } = require('../models/doctorModel');

exports.getTreatmentCategories = (req, res, next) => {
  try {
    res.json(MOCK_TREATMENT_CATEGORIES);
  } catch (err) {
    next(err);
  }
};

exports.getTreatments = (req, res, next) => {
  try {
    res.json(MOCK_TREATMENTS);
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentById = (req, res, next) => {
  try {
    const trt = MOCK_TREATMENTS.find(t => t.id === req.params.id || t.slug === req.params.id);
    if (trt) {
      res.json(trt);
    } else {
      res.status(404).json({ error: "Treatment not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentDoctors = (req, res, next) => {
  try {
    const trt = MOCK_TREATMENTS.find(t => t.id === req.params.id || t.slug === req.params.id);
    if (!trt) {
      return res.status(404).json({ error: "Treatment not found" });
    }
    const matched = MOCK_DOCTORS.filter(doc => {
      const spec = doc.specialization.toLowerCase();
      const exp = doc.specialExpertise.map(e => e.toLowerCase());
      const cat = trt.category.toLowerCase();
      return spec.includes(cat) || 
             spec.includes("general") || 
             spec.includes("kayachikitsa") || 
             exp.some(e => e.includes(trt.name.toLowerCase()) || e.includes(cat));
    });
    const results = matched.length > 0 ? matched.slice(0, 6) : MOCK_DOCTORS.slice(0, 6);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentFaqs = (req, res, next) => {
  try {
    const trt = MOCK_TREATMENTS.find(t => t.id === req.params.id || t.slug === req.params.id);
    if (trt) {
      res.json(trt.faq || []);
    } else {
      res.status(404).json({ error: "Treatment not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentRecoveryTimeline = (req, res, next) => {
  try {
    const trt = MOCK_TREATMENTS.find(t => t.id === req.params.id || t.slug === req.params.id);
    if (!trt) {
      return res.status(404).json({ error: "Treatment not found" });
    }
    const timeline = [
      { step: "Week 1", description: `Primary response initiation. Digestive adjustments and body adapting to the therapeutic inputs of ${trt.name}.` },
      { step: "Week 2", description: `Active channel purification. Cleansing of toxins (Ama) starts, which might cause mild healing fatigue.` },
      { step: "Week 4", description: `Dosha stabilization and system rebalancing. Notable improvement in digestive fire (Agni) and general energy.` },
      { step: "Month 2", description: `Deep tissue (Dhatu) rejuvenation and cell repair. Targeted chronic symptoms begin to fade.` },
      { step: "Month 3", description: "Establishment of dynamic health balance, complete vitality, and ongoing maintenance through seasonal diet guidelines." }
    ];
    res.json(timeline);
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentPersonalizedPlan = (req, res, next) => {
  try {
    const trt = MOCK_TREATMENTS.find(t => t.id === req.params.id || t.slug === req.params.id);
    if (!trt) {
      return res.status(404).json({ error: "Treatment not found" });
    }
    const age = parseInt(req.query.age) || 30;
    const goal = req.query.goal || "Restore systemic energy balance";
    const dosha = (req.query.dosha || "Vata").toLowerCase();

    let diet = [];
    let lifestyle = [];
    let timeline = "";

    if (dosha === "vata") {
      diet = [
        "Warm, freshly cooked grounding foods (basmati rice, warm soups, oats).",
        "Incorporate healthy fats like raw Ghee, sesame oil, and almond oil.",
        "Sweet, sour, and salty tastes; avoid dry, cold, or carbonated items."
      ];
      lifestyle = [
        "Perform a 10-minute self-Abhyanga massage with warm sesame oil before bathing.",
        "Practice 15 minutes of calming Nadi Shodhana (breath balancing) pranayama.",
        "Strict sleep hygiene: retire by 10:00 PM and protect your joints from cold drafts."
      ];
      timeline = "6 Weeks. Focus is on nourishing bodily tissues and grounding nervous energy.";
    } else if (dosha === "pitta") {
      diet = [
        "Cooling, soothing, and moderately heavy foods (sweet fruits, leafy greens, coconut).",
        "Favor sweet, bitter, and astringent tastes; strictly avoid spicy, fried, or fermented foods.",
        "Drink refreshing herbal teas like peppermint, coriander seeds, or rose infusions."
      ];
      lifestyle = [
        "Massage the soles of your feet and scalp with organic coconut oil before bed.",
        "Practice sheetali (cooling breath) pranayama and light, non-competitive yoga.",
        "Avoid direct mid-day sun exposure and balance intense work cycles with leisure."
      ];
      timeline = "8 Weeks. Focus is on cooling metabolic fire, purifying the blood, and soothing skin/liver channels.";
    } else { // kapha
      diet = [
        "Warm, dry, light, and spicy foods (barley, quinoa, steamed vegetables).",
        "Favor spicy, bitter, and astringent tastes; restrict heavy dairy, sugars, and salt.",
        "Sip warm ginger-cinnamon tea throughout the day to boost sluggish metabolism."
      ];
      lifestyle = [
        "Perform dry skin brushing (Garshana) each morning to stimulate lymphatic circulation.",
        "Engage in 30-45 minutes of active, vigorous physical yoga or brisk walking.",
        "Avoid daytime sleeping, keep warm, and maintain a highly active daily routine."
      ];
      timeline = "12 Weeks. Focus is on reducing tissue congestion, eliminating excess phlegm/fat, and accelerating internal heat.";
    }

    const plan = {
      patientAge: age,
      healthGoal: goal,
      doshaType: dosha.charAt(0).toUpperCase() + dosha.slice(1),
      suggestedTherapy: `${trt.name} specialized protocol`,
      suggestedDiet: diet,
      suggestedLifestyle: lifestyle,
      expectedTimeline: timeline
    };

    res.json(plan);
  } catch (err) {
    next(err);
  }
};

exports.getPopularTreatments = (req, res, next) => {
  try {
    const popular = MOCK_TREATMENTS.filter(t => t.rating >= 4.9);
    res.json(popular);
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedTreatments = (req, res, next) => {
  try {
    res.json(MOCK_TREATMENTS.slice(4, 9));
  } catch (err) {
    next(err);
  }
};
