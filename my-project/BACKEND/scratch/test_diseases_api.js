// BACKEND/scratch/test_diseases_api.js
const axios = require('axios');

async function testDiseasesApi() {
  try {
    console.log('Testing GET http://localhost:5174/api/diseases...');
    const response = await axios.get('http://localhost:5174/api/diseases');
    console.log(`✅ Received ${response.data.length} diseases from MySQL backend API!`);
    
    if (response.data.length > 0) {
      const sample = response.data[0];
      console.log('\nSample Disease Record (stored in MySQL):');
      console.log(`- ID: ${sample.id}`);
      console.log(`- Name: ${sample.name}`);
      console.log(`- Category: ${sample.category}`);
      console.log(`- Short Description: ${sample.shortDescription}`);
      console.log(`- Symptoms Count: ${Array.isArray(sample.symptoms) ? sample.symptoms.length : 0}`);
      console.log(`- Recommended Herbs: ${Array.isArray(sample.recommendedHerbs) ? sample.recommendedHerbs.join(', ') : sample.recommendedHerbs}`);
    }
  } catch (err) {
    console.error('❌ Error calling diseases API:', err.message);
  }
}

testDiseasesApi();
