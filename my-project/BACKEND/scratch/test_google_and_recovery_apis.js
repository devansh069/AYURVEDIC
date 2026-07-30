// BACKEND/scratch/test_google_and_recovery_apis.js
const axios = require('axios');

async function testEndpoints() {
  const BASE_URL = 'http://localhost:5174/api';

  console.log('🧪 Testing patient recovery logging endpoint...');
  try {
    const point = {
      chartType: 'weekly',
      name: 'Wk 7',
      progress: 85,
      target: 95
    };
    
    const headers = {
      'x-user-id': 'pat-123',
      'x-user-role': 'patient'
    };

    const res = await axios.post(`${BASE_URL}/patient/recovery/log`, point, { headers });
    if (res.data && res.data.success) {
      console.log('✅ Recovery log saved successfully in MySQL!');
      console.log('Updated Weekly Metrics count:', res.data.data.weeklyMetrics.length);
      console.log('Latest log point details:', res.data.data.weeklyMetrics[res.data.data.weeklyMetrics.length - 1]);
    } else {
      console.error('❌ Failed to log recovery progress:', res.data);
    }
  } catch (err) {
    console.error('❌ Error testing logProgressPoint:', err.response ? err.response.data : err.message);
  }
}

testEndpoints();
