// BACKEND/controllers/statsController.js
const { MOCK_STATS } = require('../models/statsModel');

exports.getStats = (req, res, next) => {
  try {
    res.json(MOCK_STATS);
  } catch (err) {
    next(err);
  }
};
