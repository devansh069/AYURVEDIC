const connectDB = require('../config/db');
const Disease = require('../models/Disease');
const DiseaseCategory = require('../models/DiseaseCategory');

async function check() {
  await connectDB();
  const count = await Disease.count();
  console.log('DISEASE COUNT IN DB:', count);
  const catCount = await DiseaseCategory.count();
  console.log('CATEGORY COUNT IN DB:', catCount);
  const first = await Disease.findOne();
  console.log('FIRST DISEASE:', first ? first.diseaseName : 'NONE');
  process.exit(0);
}

check();
