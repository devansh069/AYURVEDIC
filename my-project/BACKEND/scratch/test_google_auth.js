// BACKEND/scratch/test_google_auth.js
const axios = require('axios');

async function run() {
  try {
    console.log('Sending Google Auth request for google-verified-user@google.com as patient...');
    const response = await axios.post('http://127.0.0.1:5174/api/auth/google', {
      email: 'google-verified-user@google.com',
      role: 'patient'
    });
    console.log('STATUS:', response.status);
    console.log('DATA:', JSON.stringify(response.data, null, 2));

  } catch (e) {
    console.error('Request failed with error:', e.message);
    if (e.response) {
      console.error('RESPONSE DATA:', e.response.data);
    }
  }
}

run();
