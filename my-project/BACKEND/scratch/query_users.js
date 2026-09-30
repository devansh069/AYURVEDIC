const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Princy@1979',
    database: 'ayurveda'
  });

  console.log('=== ALL PATIENTS (CLIENTS) ===');
  const [patients] = await conn.query('SELECT id, name, email, phone, age, gender, city, doshaType, loginProvider, joinedDate FROM patients');
  console.log(JSON.stringify(patients, null, 2));

  console.log('=== ALL DOCTORS (COUNT: ' + (await conn.query('SELECT COUNT(*) as c FROM doctors'))[0][0].c + ') ===');
  const [recentOrNonStandardDoctors] = await conn.query(
    "SELECT id, name, email, specialization, clinicName, city, rating, loginProvider FROM doctors WHERE loginProvider != 'local' OR id NOT LIKE 'doc-dir%' ORDER BY id ASC"
  );
  console.log(JSON.stringify(recentOrNonStandardDoctors, null, 2));

  console.log('=== RECENT CONSULTATIONS / APPOINTMENTS ===');
  const [consultations] = await conn.query("SELECT * FROM doctor_consultations ORDER BY createdAt DESC LIMIT 5");
  console.log('Consultations:', JSON.stringify(consultations, null, 2));

  const [appointments] = await conn.query("SELECT * FROM doctor_appointments ORDER BY createdAt DESC LIMIT 5");
  console.log('Appointments:', JSON.stringify(appointments, null, 2));

  await conn.end();
}

run().catch(console.error);
