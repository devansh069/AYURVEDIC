// BACKEND/scratch/test_treatments_api.js
const axios = require('axios');

async function testTreatmentsApi() {
  try {
    console.log('Testing GET http://localhost:5174/api/treatments...');
    const response = await axios.get('http://localhost:5174/api/treatments');
    console.log(`✅ Received ${response.data.length} treatments from MySQL backend API!`);
    
    if (response.data.length > 0) {
      const sample = response.data[0];
      console.log('\nSample Treatment Record (stored in MySQL):');
      console.log(`- ID: ${sample.id}`);
      console.log(`- Name: ${sample.name}`);
      console.log(`- Category: ${sample.category}`);
      console.log(`- Duration: ${sample.duration}`);
      console.log(`- Cost Estimate: ₹${sample.costEstimate}`);
      console.log(`- Procedure Summary: ${sample.procedure ? sample.procedure.substring(0, 150) + '...' : 'N/A'}`);
      console.log(`- Benefits Count: ${Array.isArray(sample.benefits) ? sample.benefits.length : 0}`);
      console.log(`- Steps Count: ${Array.isArray(sample.steps) ? sample.steps.length : 0}`);
    }
  } catch (err) {
    console.error('❌ Error calling treatments API:', err.message);
  }
}

testTreatmentsApi();
