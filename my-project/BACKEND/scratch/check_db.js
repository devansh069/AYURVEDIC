const connectDB = require('../config/db');
const { getPool } = require('../config/db');

async function checkDatabase() {
  console.log("Connecting to database...");
  await connectDB();
  const pool = getPool();

  try {
    const [patients] = await pool.query("SELECT * FROM patients WHERE id = 'pat-123'");
    console.log(" Patients count for pat-123:", patients.length);
    if (patients.length > 0) {
      console.log("Active Patient:", patients[0].name, "-", patients[0].email, "-", patients[0].city);
    }

    const [wellness] = await pool.query("SELECT * FROM patient_wellness WHERE patientId = 'pat-123'");
    console.log(" Wellness record:", wellness[0]);

    const [goals] = await pool.query("SELECT * FROM patient_health_goals WHERE patientId = 'pat-123'");
    console.log(" Health goals:", goals.map(g => g.title));

    const [records] = await pool.query("SELECT * FROM patient_medical_records WHERE patientId = 'pat-123'");
    console.log(" Medical records count:", records.length);

    const [notifs] = await pool.query("SELECT * FROM notifications WHERE userId = 'pat-123'");
    console.log(" Notifications count:", notifs.length);

    const [doctor] = await pool.query("SELECT * FROM doctors WHERE id = 'dr-1'");
    console.log(" Doctor record exists:", doctor.length > 0 ? doctor[0].name : "No");

    const [consultations] = await pool.query("SELECT COUNT(*) as count FROM doctor_consultations");
    console.log(" Doctor consultations count in database:", consultations[0].count);

  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
