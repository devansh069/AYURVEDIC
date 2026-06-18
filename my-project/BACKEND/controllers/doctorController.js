// BACKEND/controllers/doctorController.js
const { MOCK_DOCTORS } = require('../models/doctorModel');

exports.getDoctors = (req, res, next) => {
  try {
    res.json(MOCK_DOCTORS);
  } catch (err) {
    next(err);
  }
};

exports.getDoctorById = (req, res, next) => {
  try {
    const doctor = MOCK_DOCTORS.find(d => d.id === req.params.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: "Doctor not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getSpecializations = (req, res, next) => {
  try {
    const specializations = Array.from(new Set(MOCK_DOCTORS.map(d => d.specialization)));
    res.json(specializations);
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedDoctors = (req, res, next) => {
  try {
    const featured = MOCK_DOCTORS.slice(0, 6);
    res.json(featured);
  } catch (err) {
    next(err);
  }
};

exports.getTopRatedDoctors = (req, res, next) => {
  try {
    const topRated = [...MOCK_DOCTORS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    res.json(topRated);
  } catch (err) {
    next(err);
  }
};

exports.getDoctorReviews = (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const reviews = [
      {
        id: `rev-${doctorId}-1`,
        doctorId,
        patientName: "Sanjay Dixit",
        rating: 5,
        comment: "Excellent doctor! The Ayurvedic treatment plan was very detailed and holistic.",
        date: "2026-06-05"
      },
      {
        id: `rev-${doctorId}-2`,
        doctorId,
        patientName: "Meenakshi K.",
        rating: 4,
        comment: "Very patient listener. Explained the dosha imbalance perfectly.",
        date: "2026-06-02"
      }
    ];
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.getDoctorAvailability = (req, res, next) => {
  try {
    const doctor = MOCK_DOCTORS.find(d => d.id === req.params.id);
    res.json({
      availability: doctor ? doctor.availability : "Mon-Sat, 9AM - 5PM",
      slots: [
        "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
      ]
    });
  } catch (err) {
    next(err);
  }
};
