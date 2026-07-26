// BACKEND/scratch/test_doctors_api.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5174/api';

async function testDoctorsApi() {
  console.log('🧪 Testing Doctors API & Recommendations...\n');

  // 1. GET /api/doctors
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    console.log(`✅ GET /api/doctors: Success. Returned ${res.data.length} doctors.`);
    if (res.data.length > 0) {
      const doc = res.data[0];
      console.log(`   Sample: "${doc.name}" | Spec: ${doc.specialization} | Fee: ₹${doc.consultationFee}`);
    }
  } catch (err) {
    console.error('❌ GET /api/doctors failed:', err.message);
  }

  // 2. GET /api/doctors?specialization=Panchakarma
  try {
    const res = await axios.get(`${BASE_URL}/doctors?specialization=Panchakarma`);
    console.log(`\n✅ GET /api/doctors?specialization=Panchakarma: Success. Found ${res.data.length} matches.`);
    if (res.data.length > 0) {
      console.log(`   First Match: "${res.data[0].name}" | Specialization: ${res.data[0].specialization}`);
    }
  } catch (err) {
    console.error('❌ GET /api/doctors?specialization=Panchakarma failed:', err.message);
  }

  // 3. GET /api/doctors?specialization=Diabetes
  try {
    const res = await axios.get(`${BASE_URL}/doctors?specialization=Diabetes`);
    console.log(`\n✅ GET /api/doctors?specialization=Diabetes: Success. Found ${res.data.length} matches.`);
    if (res.data.length > 0) {
      console.log(`   First Match: "${res.data[0].name}" | Specialization: ${res.data[0].specialization}`);
    }
  } catch (err) {
    console.error('❌ GET /api/doctors?specialization=Diabetes failed:', err.message);
  }

  console.log('\n🏁 Doctor API Testing finished.');
}

testDoctorsApi();
