// BACKEND/scratch/seed_doctors_gemini.js
require('dotenv').config();
const connectDB = require('../config/db');
const { getPool } = require('../config/db');
const { generateGeminiContent } = require('../config/gemini');
const fs = require('fs');
const path = require('path');

const TARGET_CITIES = ['Jaipur', 'Mumbai', 'Delhi', 'Kochi', 'Bangalore', 'Pune', 'Dehradun', 'Chennai'];
const SPECIALIZATIONS = [
  'Panchakarma Specialist',
  'Kayachikitsa (General Medicine)',
  'Shalya Tantra (Ayurvedic Surgery & Marma)',
  'Prasuti Tantra & Stri Roga (Gynaecology)',
  'Diabetes & Metabolic Disorders',
  'Arthritis & Spine Specialist',
  'Skin & Hair Disorders (Kitibha)',
  'Mental Wellness & Nootropic Therapies'
];

const PORTRAITS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
  'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
  'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80'
];

async function seedDoctorsWithGemini() {
  console.log('🚀 Connecting to MySQL Database to seed real-world Ayurvedic doctors...');
  await connectDB();
  const pool = getPool();

  if (!pool) {
    console.error('❌ Database connection pool is offline');
    return;
  }

  const totalDoctors = 24;
  const allSeededDoctors = [];

  console.log(`📡 Generating ${totalDoctors} real-world Ayurvedic doctor profiles via Gemini AI API...`);

  for (let i = 0; i < totalDoctors; i++) {
    const spec = SPECIALIZATIONS[i % SPECIALIZATIONS.length];
    const city = TARGET_CITIES[i % TARGET_CITIES.length];
    const portrait = PORTRAITS[i % PORTRAITS.length];
    const id = `doc-dir-${i + 1}`;

    console.log(`🤖 Generating profile [${id}] for ${spec} in ${city}...`);

    const prompt = `You are a traditional Ayurvedic university director. Generate a highly realistic, clinical profile for an Ayurvedic Doctor specializing in "${spec}" and practicing in the city of "${city}", India.

Return ONLY a valid JSON object matching the following structure without markdown codeblock wrappers:
{
  "name": "Full name with prefix e.g. Dr. Rajesh Sharma",
  "qualification": "e.g. BAMS, MD (Ayurveda - Panchakarma) or BAMS, MS (Shalya Tantra)",
  "experience": 12, // number of years between 5 and 35
  "rating": 4.8, // between 4.5 and 4.9
  "reviewCount": 75, // between 20 and 200
  "consultationFee": 750, // realistic Indian fee between 300 and 1500
  "onlineConsultationFee": 600, // slightly lower than consultationFee
  "languages": ["English", "Hindi", "Sanskrit", "Local State Language"],
  "clinicName": "Realistic clinic name e.g. Patanjali Wellness, Kottakkal Arya Vaidya Sala branch, or Jiva Ayurveda",
  "about": "A 3-sentence professional bio emphasizing their clinical experience, diagnostic approach, and target treatments (e.g. Basti, Shirodhara, herbs).",
  "education": [
    "B.A.M.S - National Institute of Ayurveda, Jaipur",
    "M.D - Banaras Hindu University (BHU), Varanasi"
  ],
  "awards": [
    "Ayur Vaidya Award 2021",
    "Clinical Excellence in Ayurveda 2024"
  ],
  "specialExpertise": [
    "Pulse Diagnosis (Nadi Pariksha)",
    "Panchakarma Detoxification",
    "Herbal Formulations"
  ],
  "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM)",
  "successRate": 88 // percentage between 80 and 97
}`;

    let aiData = null;
    try {
      const responseText = await generateGeminiContent(prompt, "You output pure JSON objects without markdown block formatting.");
      if (responseText) {
        let clean = responseText.trim();
        if (clean.startsWith('```')) {
          clean = clean.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        aiData = JSON.parse(clean);
      }
    } catch (e) {
      console.warn(`⚠️ Gemini API parsing issue for ${spec}: ${e.message}`);
    }

    const name = aiData?.name || `Dr. Vaidya Sharma ${i + 1}`;
    const qualification = aiData?.qualification || 'BAMS, MD (Kaya Chikitsa)';
    const experience = aiData?.experience || 10;
    const rating = aiData?.rating || 4.8;
    const reviewCount = aiData?.reviewCount || 50;
    const fee = aiData?.consultationFee || 500;
    const onlineFee = aiData?.onlineConsultationFee || 450;
    const languages = aiData?.languages || ['English', 'Hindi'];
    const clinicName = aiData?.clinicName || 'Jiva Ayurveda Clinic';
    const about = aiData?.about || 'Senior practitioner of traditional Ayurvedic medicine, offering personalized body type diagnostics (Prakriti Analysis) and Panchakarma treatment guidelines.';
    const education = aiData?.education || ['BAMS - Gujarat Ayurved University'];
    const awards = aiData?.awards || ['Vaidya Ratna Award'];
    const specialExpertise = aiData?.specialExpertise || ['Pulse Diagnosis', 'Diet counseling'];
    const availability = aiData?.availability || 'Mon - Sat (10:00 AM - 5:00 PM)';
    const successRate = aiData?.successRate || 90;

    const email = name.toLowerCase().replace(/[^a-z]/g, '') + i + "@ayurvedaconnect.com";

    await pool.query(`
      INSERT INTO doctors (
        id, name, email, password, specialization, qualification, experience, rating, reviewCount,
        fee, consultationFee, onlineConsultationFee, languages, clinicName, city, state, about,
        education, awards, specialExpertise, availability, successRate, patientsTreated, verified,
        onlineConsultation, offlineConsultation, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        specialization = VALUES(specialization),
        qualification = VALUES(qualification),
        experience = VALUES(experience),
        rating = VALUES(rating),
        reviewCount = VALUES(reviewCount),
        fee = VALUES(fee),
        consultationFee = VALUES(consultationFee),
        onlineConsultationFee = VALUES(onlineConsultationFee),
        languages = VALUES(languages),
        clinicName = VALUES(clinicName),
        city = VALUES(city),
        state = VALUES(state),
        about = VALUES(about),
        education = VALUES(education),
        awards = VALUES(awards),
        specialExpertise = VALUES(specialExpertise),
        availability = VALUES(availability),
        successRate = VALUES(successRate),
        patientsTreated = VALUES(patientsTreated),
        verified = VALUES(verified),
        onlineConsultation = VALUES(onlineConsultation),
        offlineConsultation = VALUES(offlineConsultation),
        photo = VALUES(photo)
    `, [
      id, name, email, 'password', spec, qualification, experience, rating, reviewCount,
      fee, fee, onlineFee, JSON.stringify(languages), clinicName, city, 'India', about,
      JSON.stringify(education), JSON.stringify(awards), JSON.stringify(specialExpertise),
      availability, successRate, experience * 120, 1, onlineFee > 0 ? 1 : 0, fee > 0 ? 1 : 0, portrait
    ]);

    allSeededDoctors.push({
      id, name, email, password: 'password', specialization: spec, qualification, experience, rating, reviewCount,
      fee, consultationFee: fee, onlineConsultationFee: onlineFee, languages, clinicName, city, state: 'India', about,
      education, awards, specialExpertise, availability, successRate, patientsTreated: experience * 120, verified: true,
      onlineConsultation: onlineFee > 0, offlineConsultation: fee > 0, photo: portrait
    });

    console.log(`✅ Saved doctor "${name}" in ${city} into MySQL database.`);
  }

  // Save to doctors.json file on disk
  const filePath = path.join(__dirname, '..', 'data', 'doctors.json');
  fs.writeFileSync(filePath, JSON.stringify(allSeededDoctors, null, 2), 'utf-8');
  console.log(`✅ Synchronized ${allSeededDoctors.length} doctors inside ${filePath}`);

  console.log('\n🎉 Successfully seeded all 24 doctors with real-world dynamically generated profiles!');
  process.exit();
}

seedDoctorsWithGemini();
