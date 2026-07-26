// BACKEND/scratch/verify_real_data.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5174/api';

async function verifyAllRealData() {
  console.log('🔍 Auditing Real-World Data on Backend & Database...\n');

  // 1. Audit Clinics Data
  try {
    const res = await axios.get(`${BASE_URL}/clinics`);
    console.log(`🏥 CLINICS API: Returned ${res.data.length} real clinic records.`);
    if (res.data.length > 0) {
      const sample = res.data[0];
      console.log(`   Sample Clinic: "${sample.name}"`);
      console.log(`   Location: ${sample.address}, ${sample.city}, ${sample.state}`);
      console.log(`   Coordinates: Lat ${sample.latitude}, Lon ${sample.longitude}`);
      console.log(`   Phone: ${sample.phone} | Website: ${sample.website}`);
      console.log(`   Services: ${Array.isArray(sample.services) ? sample.services.slice(0, 3).join(', ') : sample.services}`);
      console.log(`   Banner Image: ${sample.bannerImage ? 'YES' : 'NO'}`);
    }
  } catch (err) {
    console.error('❌ Clinics API Error:', err.message);
  }

  // 2. Audit Home Stats
  try {
    const res = await axios.get(`${BASE_URL}/stats`);
    console.log(`\n📊 STATS API: Patients: ${res.data.patients}, Doctors: ${res.data.doctors}, Clinics: ${res.data.clinics}, Treatments: ${res.data.treatments}`);
  } catch (err) {
    console.error('❌ Stats API Error:', err.message);
  }

  // 3. Audit Doctors Data
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    console.log(`\n🩺 DOCTORS API: Returned ${res.data.length} doctor records.`);
    if (res.data.length > 0) {
      const sample = res.data[0];
      console.log(`   Sample Doctor: ${sample.name} (${sample.qualification}, ${sample.specialization})`);
      console.log(`   City: ${sample.city} | Fee: ₹${sample.fee}`);
    }
  } catch (err) {
    console.error('❌ Doctors API Error:', err.message);
  }

  // 4. Audit Diseases Data (Gemini API enriched)
  try {
    const res = await axios.get(`${BASE_URL}/diseases`);
    console.log(`\n🌿 DISEASES API: Returned ${res.data.length} real disease records.`);
    if (res.data.length > 0) {
      const sample = res.data[0];
      console.log(`   Sample Disease: ${sample.name} (${sample.category})`);
      console.log(`   Ayurvedic Perspective: ${sample.ayurvedicPerspective ? sample.ayurvedicPerspective.substring(0, 120) + '...' : 'N/A'}`);
    }
  } catch (err) {
    console.error('❌ Diseases API Error:', err.message);
  }

  // 5. Audit Treatments Data (Gemini API enriched)
  try {
    const res = await axios.get(`${BASE_URL}/treatments`);
    console.log(`\n💆 TREATMENTS API: Returned ${res.data.length} Panchakarma & therapy records.`);
    if (res.data.length > 0) {
      const sample = res.data[0];
      console.log(`   Sample Treatment: ${sample.name} (${sample.duration}, ₹${sample.costEstimate})`);
    }
  } catch (err) {
    console.error('❌ Treatments API Error:', err.message);
  }

  console.log('\n✅ Data audit complete!');
}

verifyAllRealData();
