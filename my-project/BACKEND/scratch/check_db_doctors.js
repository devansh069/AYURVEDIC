// BACKEND/scratch/check_db_doctors.js
const connectDB = require('../config/db');
const { getPool } = require('../config/db');

async function checkDoctors() {
  await connectDB();
  const pool = getPool();
  if (!pool) return;
  const [rows] = await pool.query("SELECT id, name, specialization, qualification, experience, fee, consultationFee FROM doctors LIMIT 5");
  console.log("🩺 Seeded Doctors in MySQL:", rows);
  process.exit();
}

checkDoctors();
