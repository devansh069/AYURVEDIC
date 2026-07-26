// BACKEND/scratch/audit_treatments_real.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5174/api';

async function auditTreatmentsPageData() {
  console.log('🔍 Auditing Treatment Page Live Real-World Data...\n');

  // 1. Audit /api/treatments
  try {
    const res = await axios.get(`${BASE_URL}/treatments`);
    console.log(`💆 GET /api/treatments: Returned ${res.data.length} real treatment records from MySQL.`);
    if (res.data.length > 0) {
      const trt = res.data[0];
      console.log(`\n📌 Sample Treatment Profile [${trt.id}]: "${trt.name}"`);
      console.log(`   - Category: ${trt.category}`);
      console.log(`   - Duration: ${trt.duration}`);
      console.log(`   - Estimated Cost: ₹${trt.costEstimate}`);
      console.log(`   - Clinical Overview: ${trt.overview ? trt.overview.substring(0, 140) + '...' : 'N/A'}`);
      console.log(`   - Benefits (${Array.isArray(trt.benefits) ? trt.benefits.length : 0}): ${Array.isArray(trt.benefits) ? trt.benefits.join(', ') : trt.benefits}`);
      console.log(`   - 3-Phase Procedure Steps (${Array.isArray(trt.steps) ? trt.steps.length : 0}):`);
      if (Array.isArray(trt.steps)) {
        trt.steps.forEach(s => {
          console.log(`     • Step ${s.stepNumber || s.title}: ${s.title} (${s.duration || ''}) - ${s.description ? s.description.substring(0, 70) + '...' : ''}`);
        });
      }
      console.log(`   - Modern Medical Mechanism: ${trt.modernData ? JSON.stringify(trt.modernData.mechanismOfAction || trt.modernData) : 'N/A'}`);
    }
  } catch (err) {
    console.error('❌ Error fetching treatments:', err.message);
  }

  // 2. Audit /api/treatment-categories
  try {
    const catRes = await axios.get(`${BASE_URL}/treatment-categories`);
    console.log(`\n🏷️ GET /api/treatment-categories: Returned ${catRes.data.length} categories.`);
  } catch (err) {
    console.error('❌ Error fetching treatment categories:', err.message);
  }

  // 3. Audit /api/popular-treatments
  try {
    const popRes = await axios.get(`${BASE_URL}/popular-treatments`);
    console.log(`\n⭐ GET /api/popular-treatments: Returned ${popRes.data.length} high-rated treatments.`);
  } catch (err) {
    console.error('❌ Error fetching popular treatments:', err.message);
  }

  console.log('\n✅ Treatment Page audit successfully completed!');
}

auditTreatmentsPageData();
