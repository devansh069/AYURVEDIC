// BACKEND/scratch/test_doctor_google_login.js
const axios = require('axios');

async function testDoctorAuth() {
  const BASE_URL = 'http://localhost:5174/api';

  console.log('🧪 Testing doctor Google authentication integration...');
  try {
    // We will test the auto-registration and login of a doctor
    // Simulating access token / payload request
    const payload = {
      accessToken: 'MOCK_DOCTOR_ACCESS_TOKEN_XYZ_123',
      idToken: 'MOCK_DOCTOR_ID_TOKEN'
    };

    // Note: Since this would contact Google userinfo APIs, it might fail unless we mock the axios call
    // or simulate it directly in the db. Let's see if we can trigger doctorAuthController.googleLogin.
    // To make sure it doesn't fail on real HTTP request, let's look at the database.
    console.log('Running code verification directly to check endpoints registration.');
    
    // We can also check if the route is accessible
    const res = await axios.post(`${BASE_URL}/auth/doctor/google-login`, payload)
      .catch(err => err.response);
    
    console.log('Response status from server:', res.status);
    console.log('Response error/payload (expected token verification error if token is mock):', res.data);
    
    if (res.status === 400 && res.data.error === 'Invalid Google token.') {
      console.log('✅ Route is properly mapped and intercepted by Google validation logic!');
    } else {
      console.log('⚠️ Unexpected response:', res.data);
    }
  } catch (err) {
    console.error('Error during test execution:', err.message);
  }
}

testDoctorAuth();
