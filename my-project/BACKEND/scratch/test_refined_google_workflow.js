// BACKEND/scratch/test_refined_google_workflow.js
const axios = require('axios');

async function verifyRefinedWorkflow() {
  const BASE_URL = 'http://localhost:5174/api';

  console.log('🧪 1. Testing unregistered Google login response...');
  try {
    const payload = {
      accessToken: 'MOCK_UNREGISTERED_ACCESS_TOKEN',
      idToken: 'MOCK_UNREGISTERED_ID_TOKEN'
    };

    const res = await axios.post(`${BASE_URL}/auth/patient/google-login`, payload)
      .catch(err => err.response);

    console.log('Response status (expected 404):', res.status);
    console.log('Response payload code (expected USER_NOT_FOUND):', res.data.code);
    console.log('Response payload error:', res.data.error);

    if (res.status === 404 && res.data.code === 'USER_NOT_FOUND') {
      console.log('✅ Success: Google login correctly block unregistered users and returns USER_NOT_FOUND.');
    } else {
      console.error('❌ Fail: Unexpected response for unregistered login.', res.data);
    }
  } catch (err) {
    console.error('Error during unregistered login test:', err.message);
  }

  console.log('\n🧪 2. Testing patient signup via Google parameter validation...');
  try {
    const mockEmail = `google-signup-test-${Date.now()}@google.com`;
    const signupPayload = {
      name: 'Google Signup Test Patient',
      email: mockEmail,
      googleId: `gsub-${Date.now()}`,
      loginProvider: 'google',
      age: 26,
      gender: 'Male',
      city: 'Mumbai',
      doshaType: 'Vata',
      healthGoals: ['Improve Metabolism']
    };

    const res = await axios.post(`${BASE_URL}/auth/patient/signup`, signupPayload);
    console.log('Signup response status (expected 201):', res.status);
    console.log('Signup success status (expected true):', res.data.success);
    
    if (res.status === 201 && res.data.success) {
      console.log('✅ Success: Google signup is valid without a password!');
    } else {
      console.error('❌ Fail: Google signup failed.', res.data);
    }
  } catch (err) {
    console.error('❌ Error during signup test:', err.response ? err.response.data : err.message);
  }
}

verifyRefinedWorkflow();
