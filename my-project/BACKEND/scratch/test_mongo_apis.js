// BACKEND/scratch/test_mongo_apis.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5174/api';

async function testAllMongoApis() {
  console.log('🧪 Testing Express MongoDB Disease APIs...\n');

  // 1. GET /api/diseases
  try {
    const res = await axios.get(`${BASE_URL}/diseases`);
    console.log(`✅ GET /api/diseases: Success. Returned ${res.data.data.length} diseases.`);
    console.log(`   Pagination info:`, res.data.pagination);
  } catch (err) {
    console.error('❌ GET /api/diseases failed:', err.message);
  }

  // 2. GET /api/diseases/search
  try {
    const res = await axios.get(`${BASE_URL}/diseases/search?q=Diabetes`);
    console.log(`\n✅ GET /api/diseases/search?q=Diabetes: Success. Found ${res.data.length} matches.`);
    if (res.data.length > 0) {
      console.log(`   First match: "${res.data[0].diseaseName}"`);
    }
  } catch (err) {
    console.error('❌ GET /api/diseases/search failed:', err.message);
  }

  // 3. GET /api/diseases/popular
  try {
    const res = await axios.get(`${BASE_URL}/diseases/popular`);
    console.log(`\n✅ GET /api/diseases/popular: Success. Returned ${res.data.length} popular diseases.`);
  } catch (err) {
    console.error('❌ GET /api/diseases/popular failed:', err.message);
  }

  // 4. GET /api/diseases/latest
  try {
    const res = await axios.get(`${BASE_URL}/diseases/latest`);
    console.log(`\n✅ GET /api/diseases/latest: Success. Returned ${res.data.length} latest diseases.`);
  } catch (err) {
    console.error('❌ GET /api/diseases/latest failed:', err.message);
  }

  // 5. GET /api/diseases/trending
  try {
    const res = await axios.get(`${BASE_URL}/diseases/trending`);
    console.log(`\n✅ GET /api/diseases/trending: Success. Returned ${res.data.length} trending diseases.`);
  } catch (err) {
    console.error('❌ GET /api/diseases/trending failed:', err.message);
  }

  // 6. GET /api/diseases/:slug
  try {
    const res = await axios.get(`${BASE_URL}/diseases/diabetes`);
    console.log(`\n✅ GET /api/diseases/diabetes: Success. Loaded details for "${res.data.diseaseName}"`);
    console.log(`   Category: ${res.data.category} | Alternative Names: ${res.data.alternativeNames.join(', ')}`);
  } catch (err) {
    console.error('❌ GET /api/diseases/diabetes failed:', err.message);
  }

  console.log('\n🏁 MongoDB API Testing finished.');
}

testAllMongoApis();
