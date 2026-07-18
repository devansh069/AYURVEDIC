const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '..', '..', 'FRONTEND', 'src', 'data', 'directoryMockData.ts');
const jsonOutputPath = path.join(__dirname, '..', 'data', 'doctors.json');

try {
  const content = fs.readFileSync(tsFilePath, 'utf-8');

  // Find the array content
  const startToken = 'export const MOCK_DIRECTORY_DOCTORS: DirectoryDoctor[] = [';
  const startIndex = content.indexOf(startToken);
  if (startIndex === -1) {
    console.error("Could not find start token in TS file!");
    process.exit(1);
  }

  // Find matching closing bracket
  let bracketCount = 1;
  let index = startIndex + startToken.length;
  let arrayText = '[';

  while (bracketCount > 0 && index < content.length) {
    const char = content[index];
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    arrayText += char;
    index++;
  }

  // Evaluate the TS array text as JS
  const doctors = eval(arrayText);
  console.log(`Parsed ${doctors.length} doctors from TS mockup file.`);

  // Map fields to match MySQL doctors table columns
  const mappedDoctors = doctors.map(doc => ({
    id: doc.id,
    name: doc.name,
    photo: doc.photo,
    qualification: doc.qualification,
    specialization: doc.specialization,
    experience: doc.experience,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    city: doc.city,
    state: getIndianState(doc.city),
    clinicName: doc.clinicName,
    consultationFee: doc.consultationFee,
    onlineConsultationFee: doc.onlineConsultationFee,
    languages: doc.languages,
    availability: doc.availability,
    successRate: doc.successRate,
    patientsTreated: doc.patientsTreated,
    verified: doc.verified ? 1 : 0,
    about: doc.bio
  }));

  function getIndianState(city) {
    const cityStateMap = {
      'Ahmedabad': 'Gujarat',
      'Mumbai': 'Maharashtra',
      'Delhi': 'Delhi',
      'Bangalore': 'Karnataka',
      'Pune': 'Maharashtra',
      'Hyderabad': 'Telangana',
      'Jaipur': 'Rajasthan',
      'Chandigarh': 'Chandigarh',
      'Kochi': 'Kerala',
      'Chennai': 'Tamil Nadu',
      'New Delhi': 'Delhi'
    };
    return cityStateMap[city] || 'India';
  }

  fs.writeFileSync(jsonOutputPath, JSON.stringify(mappedDoctors, null, 2), 'utf-8');
  console.log("Successfully generated doctors.json in BACKEND/data/!");
} catch (err) {
  console.error("Error parsing doctors array:", err.message);
  process.exit(1);
}
