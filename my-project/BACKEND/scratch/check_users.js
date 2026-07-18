// BACKEND/scratch/check_users.js
const connectDB = require('../config/db');
const { getPool } = require('../config/db');

async function run() {
  try {
    await connectDB();
    const pool = getPool();
    
    const [patients] = await pool.query('SELECT id, name, email, city, doshaType, joinedDate FROM patients');
    console.log('--- PATIENTS IN MYSQL ---');
    console.log(JSON.stringify(patients, null, 2));

    const [doctors] = await pool.query('SELECT id, name, email, specialization, city FROM doctors WHERE email IS NOT NULL');
    console.log('\n--- DOCTORS IN MYSQL WITH EMAILS ---');
    console.log(JSON.stringify(doctors, null, 2));

  } catch (e) {
    console.error('Error querying MySQL database:', e.message);
  } finally {
    process.exit();
  }
}

run();
