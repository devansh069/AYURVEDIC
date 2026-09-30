const mysql = require('mysql2/promise');

async function cleanDummyData() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Princy@1979',
    database: 'ayurveda'
  });

  console.log('--- CLEANING DUMMY CLIENT AND DOCTOR DATA ---');

  // 1. Clean patient-dependent tables
  await conn.query("DELETE FROM ai_chat_messages");
  console.log('Cleared ai_chat_messages');

  await conn.query("DELETE FROM patient_wellness");
  console.log('Cleared patient_wellness');

  await conn.query("DELETE FROM patient_health_goals");
  console.log('Cleared patient_health_goals');

  await conn.query("DELETE FROM patient_medical_records");
  console.log('Cleared patient_medical_records');

  await conn.query("DELETE FROM patient_diet_plans");
  console.log('Cleared patient_diet_plans');

  await conn.query("DELETE FROM patient_recovery_tracker");
  console.log('Cleared patient_recovery_tracker');

  await conn.query("DELETE FROM notifications");
  console.log('Cleared notifications');

  await conn.query("DELETE FROM treatment_bookings");
  console.log('Cleared treatment_bookings');

  await conn.query("DELETE FROM doctor_consultations");
  console.log('Cleared doctor_consultations');

  await conn.query("DELETE FROM doctor_appointments");
  console.log('Cleared doctor_appointments');

  // 2. Clear all dummy patients
  await conn.query("DELETE FROM patients");
  console.log('Cleared all dummy patients');

  // 3. Clear dummy doctor dr-1 and test doctors
  await conn.query("DELETE FROM doctors WHERE id = 'dr-1' OR id LIKE 'doc-178%'");
  console.log("Cleared dummy doctor 'dr-1' and test doctor accounts");

  const [patientsCount] = await conn.query("SELECT COUNT(*) as count FROM patients");
  console.log('Patients count now:', patientsCount[0].count);

  const [doctorsCount] = await conn.query("SELECT COUNT(*) as count FROM doctors");
  console.log('Doctors count now (verified directory):', doctorsCount[0].count);

  const [doctorsList] = await conn.query("SELECT id, name, specialization, clinicName FROM doctors LIMIT 5");
  console.log('Sample verified directory doctors:', doctorsList);

  await conn.end();
}

cleanDummyData().catch(console.error);
