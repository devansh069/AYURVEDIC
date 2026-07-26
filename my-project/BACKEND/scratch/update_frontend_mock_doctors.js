// BACKEND/scratch/update_frontend_mock_doctors.js
const fs = require('fs');
const path = require('path');

const doctorsPath = path.join(__dirname, '..', 'data', 'doctors.json');
if (!fs.existsSync(doctorsPath)) {
  console.error("❌ BACKEND/data/doctors.json not found");
  process.exit(1);
}

const doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf-8'));
console.log(`🩺 Loaded ${doctors.length} real-world generated doctors.`);

// 1. Update directoryMockData.ts
const directoryMockPath = path.join(__dirname, '..', '..', 'FRONTEND', 'src', 'data', 'directoryMockData.ts');
if (fs.existsSync(directoryMockPath)) {
  let content = fs.readFileSync(directoryMockPath, 'utf-8');

  // Replace MOCK_DIRECTORY_DOCTORS content
  const startTag = 'export const MOCK_DIRECTORY_DOCTORS: DirectoryDoctor[] = [';
  const startIndex = content.indexOf(startTag);
  if (startIndex !== -1) {
    // Find the matching closing bracket for the array
    let openBrackets = 1;
    let endIndex = startIndex + startTag.length;
    while (openBrackets > 0 && endIndex < content.length) {
      if (content[endIndex] === '[') openBrackets++;
      if (content[endIndex] === ']') openBrackets--;
      endIndex++;
    }

    const formattedDoctors = doctors.map(d => ({
      id: d.id,
      name: d.name,
      photo: d.photo,
      qualification: d.qualification,
      specialization: d.specialization,
      experience: d.experience,
      rating: parseFloat(d.rating),
      reviewCount: d.reviewCount,
      city: d.city,
      clinicName: d.clinicName,
      consultationFee: d.consultationFee,
      onlineConsultationFee: d.onlineConsultationFee,
      languages: d.languages,
      availability: d.availability,
      successRate: d.successRate,
      patientsTreated: d.patientsTreated,
      verified: d.verified,
      bio: d.about
    }));

    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    const replacement = `export const MOCK_DIRECTORY_DOCTORS: DirectoryDoctor[] = ${JSON.stringify(formattedDoctors, null, 2)};`;

    fs.writeFileSync(directoryMockPath, before + replacement + after, 'utf-8');
    console.log("✅ Updated MOCK_DIRECTORY_DOCTORS in directoryMockData.ts");
  } else {
    console.warn("⚠️ Could not find MOCK_DIRECTORY_DOCTORS start tag in directoryMockData.ts");
  }
}

// 2. Update apiService.ts
const apiServicePath = path.join(__dirname, '..', '..', 'FRONTEND', 'src', 'services', 'apiService.ts');
if (fs.existsSync(apiServicePath)) {
  let content = fs.readFileSync(apiServicePath, 'utf-8');

  const startTag = 'export const MOCK_DOCTORS = [';
  const startIndex = content.indexOf(startTag);
  if (startIndex !== -1) {
    let openBrackets = 1;
    let endIndex = startIndex + startTag.length;
    while (openBrackets > 0 && endIndex < content.length) {
      if (content[endIndex] === '[') openBrackets++;
      if (content[endIndex] === ']') openBrackets--;
      endIndex++;
    }

    const formattedDoctors = doctors.map(d => ({
      id: d.id,
      name: d.name,
      photo: d.photo,
      qualification: d.qualification,
      specialization: d.specialization,
      experience: d.experience,
      rating: parseFloat(d.rating),
      reviewCount: d.reviewCount,
      city: d.city,
      clinicName: d.clinicName,
      consultationFee: d.consultationFee,
      onlineConsultationFee: d.onlineConsultationFee,
      languages: d.languages,
      availability: d.availability,
      successRate: d.successRate,
      patientsTreated: d.patientsTreated,
      verified: d.verified,
      about: d.about
    }));

    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    const replacement = `export const MOCK_DOCTORS = ${JSON.stringify(formattedDoctors, null, 2)};`;

    fs.writeFileSync(apiServicePath, before + replacement + after, 'utf-8');
    console.log("✅ Updated MOCK_DOCTORS in apiService.ts");
  } else {
    console.warn("⚠️ Could not find MOCK_DOCTORS start tag in apiService.ts");
  }
}
