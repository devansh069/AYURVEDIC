const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Princy@1979',
    database: 'ayurveda'
  });

  const [existing] = await conn.query('SELECT id FROM doctors WHERE id = ?', ['doc-1790795836394']);
  if (existing.length === 0) {
    await conn.query(`
      INSERT INTO doctors (
        id, name, email, password, specialization, qualification, experience, rating, reviewCount,
        consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
        education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
        onlineConsultation, offlineConsultation, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'doc-1790795836394', 'Rajesh kumar', 'priyanshik2706@gmail.com', 'password', 'Ayurvedic General Physician', 'BAMS, MD (Ayurveda)', 10, 5.0, 15,
      500, 400, JSON.stringify(['Hindi', 'English']), 'Ayurveda Wellness Center', 'Jaipur', 'Rajasthan',
      'Dr. Rajesh kumar is a certified Ayurvedic General Physician with extensive clinical experience in classical Ayurvedic healing, pulse diagnosis (Nadi Pariksha), and herbal formulations for chronic lifestyle disorders.',
      JSON.stringify(['BAMS - National Institute of Ayurveda, Jaipur', 'MD (Ayurveda) - Gujarat Ayurved University, Jamnagar']),
      JSON.stringify(['AYUSH Board Certified Practitioner', 'Excellence in Clinical Ayurveda Award 2023']),
      JSON.stringify(['Nadi Pariksha (Pulse Diagnosis)', 'Panchakarma Therapies', 'Digestive & Metabolic Disorders', 'Herbal Pharmacotherapy']),
      'Mon-Fri (10:00 AM - 4:00 PM)', 95, 120, 1, 1, 1,
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=256&q=80'
    ]);
    console.log('Restored doc-1790795836394');
  }

  const [rows] = await conn.query('SELECT id, name, email, specialization, qualification, about, education, awards, specialExpertise FROM doctors WHERE id = ?', ['doc-1790795836394']);
  console.log('DOCTOR IN DB:');
  console.log(JSON.stringify(rows[0], null, 2));

  await conn.end();
}

run().catch(console.error);
