// BACKEND/scratch/test_signup.js
const axios = require('axios');

async function run() {
  try {
    // 1. Patient signup test
    const patientEmail = `test-pat-${Date.now()}@test.com`;
    console.log(`Testing patient signup with email ${patientEmail}...`);
    const patRes = await axios.post('http://127.0.0.1:5174/api/auth/patient/signup', {
      name: 'Test Patient',
      email: patientEmail,
      password: 'password123',
      age: 30,
      gender: 'Male',
      city: 'Pune',
      doshaType: 'Vata',
      healthGoals: ['Weight Management', 'Improved Digestion']
    });
    console.log('PATIENT SIGNUP STATUS:', patRes.status);
    console.log('PATIENT SIGNUP DATA:', JSON.stringify(patRes.data, null, 2));

    // 2. Doctor signup test
    const doctorEmail = `test-doc-${Date.now()}@test.com`;
    console.log(`\nTesting doctor signup with email ${doctorEmail}...`);
    const docRes = await axios.post('http://127.0.0.1:5174/api/auth/doctor/signup', {
      name: 'Dr. Test Doctor',
      email: doctorEmail,
      password: 'password123',
      specialization: 'Shalya Chikitsa',
      qualification: 'BAMS, MS',
      experience: 8,
      city: 'Mumbai',
      state: 'Maharashtra',
      clinicName: 'Test Ayurvedic Clinic'
    });
    console.log('DOCTOR SIGNUP STATUS:', docRes.status);
    console.log('DOCTOR SIGNUP DATA:', JSON.stringify(docRes.data, null, 2));

  } catch (e) {
    console.error('Signup failed with error:', e.response ? e.response.data : e.message);
  }
}

run();
