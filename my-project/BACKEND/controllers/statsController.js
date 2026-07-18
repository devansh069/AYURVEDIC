// BACKEND/controllers/statsController.js
const { getPool } = require('../config/db');
const { MOCK_STATS } = require('../models/statsModel');

exports.getStats = async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json(MOCK_STATS);
    }
    const [rows] = await pool.query("SELECT patients, doctors, clinics, treatments FROM stats LIMIT 1");
    if (rows && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json(MOCK_STATS);
    }
  } catch (err) {
    next(err);
  }
};
