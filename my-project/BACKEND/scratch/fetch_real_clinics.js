// BACKEND/scratch/fetch_real_clinics.js
const axios = require('axios');
const connectDB = require('../config/db');
const { getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const CITIES = [
  { name: 'Jaipur', bbox: '26.80,75.70,27.00,75.90', state: 'Rajasthan' },
  { name: 'Mumbai', bbox: '18.90,72.80,19.20,73.00', state: 'Maharashtra' },
  { name: 'Kochi', bbox: '9.90,76.20,10.10,76.40', state: 'Kerala' }
];

const CLINIC_PHOTOS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
  'https://images.unsplash.com/photo-1502740479091-6398b19db310?w=800&q=80'
];

const LOGOS = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80'
];

const SERVICES_POOL = [
  'Panchakarma', 'Detox Therapy', 'Abhyanga', 'Shirodhara',
  'Nasya', 'Virechana', 'Basti', 'Stress Management',
  'Weight Management', 'PCOS Treatment', 'Diabetes Care', 'Skin Care'
];

const FACILITIES_POOL = [
  'Private Therapy Rooms', 'Online Consultation', 'Pharmacy',
  'Parking', 'Accommodation', 'Diagnostic Support', 'Cafeteria', 'Wellness Programs'
];

async function fetchClinicsFromOverpass() {
  const allFetched = [];
  let index = 1;

  for (const city of CITIES) {
    try {
      console.log(`📡 Querying Overpass API for real clinics in ${city.name}...`);
      const query = `[out:json][timeout:15];node["amenity"="clinic"](${city.bbox});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await axios.get(url, { headers: { 'User-Agent': 'AyurvedaConnectDemo/1.0' } });

      if (response.data && response.data.elements) {
        const elements = response.data.elements.slice(0, 4); // Get up to 4 real clinics per city
        console.log(`✨ Found ${elements.length} real clinics in ${city.name}.`);

        for (const el of elements) {
          const rawName = el.tags.name || `Ayurvedic Healing Center ${city.name}`;
          // Clean/ayurvedize the name if generic
          const name = rawName.toLowerCase().includes('clinic') || rawName.toLowerCase().includes('hospital') || rawName.toLowerCase().includes('ayur') 
            ? rawName 
            : `${rawName} Ayurvedic Clinic`;

          const address = el.tags['addr:street'] || el.tags['addr:full'] || `Main Market Road, ${city.name}`;
          const phone = el.tags.phone || el.tags['contact:phone'] || `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`;
          const email = el.tags.email || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'clinic'}.com`;
          const website = el.tags.website || `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'clinic'}.com`;

          const rating = parseFloat((4.2 + Math.random() * 0.7).toFixed(1));
          const reviewCount = Math.floor(10 + Math.random() * 240);
          const yearsEstablished = Math.floor(5 + Math.random() * 20);
          const doctorsCount = Math.floor(2 + Math.random() * 6);

          const services = [...SERVICES_POOL].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 4));
          const facilities = [...FACILITIES_POOL].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3));

          const photo = CLINIC_PHOTOS[index % CLINIC_PHOTOS.length];
          const logo = LOGOS[index % LOGOS.length];

          const gallery = [
            { id: `gal-${index}-1`, url: CLINIC_PHOTOS[(index + 1) % CLINIC_PHOTOS.length], caption: 'Luxury Therapy Suite' },
            { id: `gal-${index}-2`, url: CLINIC_PHOTOS[(index + 2) % CLINIC_PHOTOS.length], caption: 'Consultation & Pulse Diagnosis' }
          ];

          const packages = [
            {
              id: `pkg-${index}-1`,
              name: 'Royal Panchakarma Cleansing',
              description: 'Classic fivefold body detoxification with specialized oils and custom diets.',
              duration: '7 Days',
              price: 15000 + Math.floor(Math.random() * 15) * 1000,
              benefits: ['Cellular purification', 'Rejuvenates Vata/Pitta flow'],
              image: CLINIC_PHOTOS[(index + 3) % CLINIC_PHOTOS.length]
            }
          ];

          const openingHoursList = [
            { day: 'Monday', hours: '08:00 AM - 07:00 PM', closed: false },
            { day: 'Tuesday', hours: '08:00 AM - 07:00 PM', closed: false },
            { day: 'Wednesday', hours: '08:00 AM - 07:00 PM', closed: false },
            { day: 'Thursday', hours: '08:00 AM - 07:00 PM', closed: false },
            { day: 'Friday', hours: '08:00 AM - 07:00 PM', closed: false },
            { day: 'Saturday', hours: '08:00 AM - 05:00 PM', closed: false },
            { day: 'Sunday', hours: 'Closed', closed: true }
          ];

          allFetched.push({
            id: `cl-${index}`,
            name,
            logo,
            bannerImage: photo,
            type: Math.random() > 0.5 ? 'Panchakarma Center' : 'Wellness Center',
            description: `A certified holistic healthcare center in ${city.name} providing premium pulse diagnosis, organic decoctions compoundings, and customized therapies targeting systemic imbalances under the guidance of expert MD Vaidyas.`,
            address,
            city: city.name,
            state: city.state,
            country: 'India',
            phone,
            email,
            website,
            rating,
            reviewCount,
            yearsEstablished,
            doctorsCount,
            services,
            facilities,
            openingHours: 'Mon-Sat: 08:00 AM - 07:00 PM',
            images: [photo, CLINIC_PHOTOS[(index + 1) % CLINIC_PHOTOS.length]],
            latitude: el.lat,
            longitude: el.lon,
            mission: 'To guide individuals towards balance and long-term wellness using pure Ayurvedic therapies and holistic dietary coaching.',
            history: `Established to extend natural clinical therapies, our center in ${city.name} has served hundreds of local and corporate patients.`,
            gallery,
            packages,
            openingHoursList
          });

          index++;
        }
      }
    } catch (err) {
      console.error(`⚠️ Error fetching Overpass data for ${city.name}:`, err.message);
    }
  }

  // Fallback if Overpass API returned no clinics
  if (allFetched.length === 0) {
    console.log('⚠️ Overpass API returned empty elements. Using rich mock clinic dataset...');
    const backupPath = path.join(__dirname, '..', 'models', 'clinicModel.js');
    if (fs.existsSync(backupPath)) {
      const { MOCK_CLINICS } = require(backupPath);
      return MOCK_CLINICS;
    }
  }

  return allFetched;
}

async function run() {
  try {
    await connectDB();
    const pool = getPool();

    const realClinics = await fetchClinicsFromOverpass();
    console.log(`\n💾 Storing ${realClinics.length} clinics in MySQL database...`);

    // Clear old clinics table
    await pool.query('DELETE FROM clinics');

    for (const cl of realClinics) {
      await pool.query(`
        INSERT INTO clinics (
          id, name, logo, bannerImage, type, description, address, city, state, country,
          phone, email, website, rating, reviewCount, yearsEstablished, doctorsCount,
          services, facilities, openingHours, images, latitude, longitude, mission, history,
          gallery, packages, openingHoursList
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        cl.id, cl.name, cl.logo, cl.bannerImage, cl.type, cl.description, cl.address, cl.city, cl.state, cl.country,
        cl.phone, cl.email, cl.website, parseFloat(cl.rating), parseInt(cl.reviewCount, 10), parseInt(cl.yearsEstablished, 10), parseInt(cl.doctorsCount, 10),
        JSON.stringify(cl.services), JSON.stringify(cl.facilities), cl.openingHours, JSON.stringify(cl.images),
        parseFloat(cl.latitude), parseFloat(cl.longitude), cl.mission, cl.history,
        JSON.stringify(cl.gallery), JSON.stringify(cl.packages), JSON.stringify(cl.openingHoursList)
      ]);
    }

    console.log('✅ Stored successfully in MySQL "clinics" table.');

    // Save back to JSON data file to keep sync
    const jsonOutputPath = path.join(__dirname, '..', 'data', 'clinics.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(realClinics, null, 2), 'utf-8');
    console.log(`✅ Synchronized database file in ${jsonOutputPath}.`);

  } catch (e) {
    console.error('❌ Migration / Fetch execution failed:', e);
  } finally {
    process.exit();
  }
}

run();
