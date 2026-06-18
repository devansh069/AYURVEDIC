// BACKEND/models/clinicModel.js

const MOCK_CLINICS = [
  {
    id: 'cl-1',
    name: 'Kerala Ayurveda Zen Sanctuary',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    type: 'Panchakarma Center',
    description: 'A luxurious five-star Ayurveda resort and detoxification sanctuary overlooking the tranquil backwaters of Kochi. Specializing in traditional Shodhana therapies and customized Panchakarma protocols under strict MD Vaidya supervision.',
    address: '12 Backwater Retreat, Fort Kochi',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    phone: '+91 484 2748390',
    email: 'contact@keralazen.com',
    website: 'https://www.keralazen.com',
    rating: 4.9,
    reviewCount: 284,
    yearsEstablished: 18,
    doctorsCount: 8,
    services: ['Panchakarma', 'Detox Therapy', 'Abhyanga', 'Shirodhara', 'Nasya', 'Virechana', 'Basti', 'Stress Management'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Accommodation', 'Diagnostic Support', 'Cafeteria', 'Wellness Programs'],
    openingHours: 'Mon-Sun: 07:00 AM - 08:00 PM',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
    ],
    latitude: 9.9312,
    longitude: 76.2673,
    mission: 'To guide individuals towards holistic rejuvenation using customized, traditional Panchakarma purges and healing backwater therapies.',
    history: 'Founded in 2008 in Fort Kochi, our sanctuary quickly gained international acclaim for preserving clinical Shodhana protocols and organic herbal oils compounding in Kerala.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', caption: 'Luxury Therapy Suite' },
      { id: 'gal-2', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', caption: 'Tranquil Backwater Courtyard' },
      { id: 'gal-3', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80', caption: 'Organic Compound Lab' },
      { id: 'gal-4', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', caption: 'Yoga Pavilion' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Royal Panchakarma Detoxification',
        description: 'Complete fivefold cleansing (Shodhana) with customized daily massages, steam chambers, and doshic meals.',
        duration: '7 Days',
        price: 25000,
        benefits: ['Complete cellular detox', 'Restores metabolic fire (Agni)', 'Soothes nervous system'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
      },
      {
        id: 'pkg-2',
        name: 'Stress & Insomnia Reversal',
        description: 'Combining continuous warm Shirodhara drips with grounding Vata-soothing body strokes.',
        duration: '5 Days',
        price: 18000,
        benefits: ['Lowers cortisol levels', 'Deep, restorative sleep', 'Relieves mental fatigue'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Tuesday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Wednesday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Thursday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Friday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Saturday', hours: '07:00 AM - 08:00 PM', closed: false },
      { day: 'Sunday', hours: '08:00 AM - 04:00 PM', closed: false }
    ]
  },
  {
    id: 'cl-2',
    name: 'AyurCare Wellness Hub',
    logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    type: 'Wellness Center',
    description: 'A premium, modern holistic health hub in the heart of Mumbai. We provide corporate stress relief programs, dietary doshic coaching, and traditional therapies customized for active urban lifestyles.',
    address: '45 Juhu Tara Road, Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 22 26154800',
    email: 'info@ayurcaremumbai.com',
    website: 'https://www.ayurcaremumbai.com',
    rating: 4.8,
    reviewCount: 198,
    yearsEstablished: 10,
    doctorsCount: 5,
    services: ['Shirodhara', 'Abhyanga', 'PCOS Treatment', 'Weight Management', 'Stress Management', 'Skin Care'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Accommodation', 'Wellness Programs'],
    openingHours: 'Mon-Sat: 08:00 AM - 07:00 PM',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'
    ],
    latitude: 19.1026,
    longitude: 72.8242,
    mission: 'To bridge traditional Vedic diagnostic science with fast-paced urban lifestyles, creating accessible paths to wellness.',
    history: 'Formed in 2016, AyurCare pioneered corporate wellness and preventive consultation in Mumbai, catering to hundreds of corporate leaders.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', caption: 'Lobby & Waiting Lounge' },
      { id: 'gal-2', url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', caption: 'Consultation Room' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Urban Metabolic Reset',
        description: 'Targeted at restoring weight balance and resetting digestion through oil massages and organic diet plan coaching.',
        duration: '5 Days',
        price: 12500,
        benefits: ['Boosts sluggish metabolism', 'Toxin scraping (Lekhana)', 'Dietary plan maps'],
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Tuesday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Wednesday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Thursday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Friday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Saturday', hours: '08:00 AM - 07:00 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  },
  {
    id: 'cl-3',
    name: 'Shuddhi Ayurveda Clinic',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    type: 'Ayurveda Clinic',
    description: 'Dedicated to cleansing your mind and body. Located in New Delhi, Shuddhi Clinic is a leading name in pulse diagnostics (Nadi Pariksha) and customized herbal medicines for metabolic diseases.',
    address: 'B-12 Greater Kailash I',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    phone: '+91 11 41635890',
    email: 'delhi@shuddhiayurveda.com',
    website: 'https://www.shuddhiayurveda.com',
    rating: 4.7,
    reviewCount: 154,
    yearsEstablished: 8,
    doctorsCount: 4,
    services: ['Panchakarma', 'Detox Therapy', 'Diabetes Care', 'Weight Management', 'Skin Care'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Diagnostic Support', 'Wellness Programs'],
    openingHours: 'Mon-Sat: 09:00 AM - 06:00 PM',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80'
    ],
    latitude: 28.5482,
    longitude: 77.2348,
    mission: 'To deliver precise root-cause analysis through Nadi Pariksha and restore vitality with organic Ayurvedic extracts.',
    history: 'Formed in 2018 in GK-1, Shuddhi has established standard protocols for metabolic disorders reversal.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80', caption: 'Clinical Examination Room' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Nadi Rejuvenation Program',
        description: 'Includes precise pulse tracking, 3 personalized therapies, and 30 days of customized herbal extracts.',
        duration: '3 Days',
        price: 8500,
        benefits: ['Nervous channel alignment', 'Systemic detoxification', 'Stress relief'],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Tuesday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Wednesday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Thursday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Friday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Saturday', hours: '09:00 AM - 06:00 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  },
  {
    id: 'cl-4',
    name: 'Himalayan Holistic Rejuvenation Hospital',
    logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    type: 'Ayurveda Hospital',
    description: 'An expansive inpatient Ayurvedic hospital nestled in the serene foothills of Rishikesh. Combining ancient scriptural therapies with clinical diagnostic standards. Famous for metabolic restoration programs.',
    address: 'Tapovan Hills, Badrinath Road',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    phone: '+91 135 2439800',
    email: 'heal@himalayanhospital.com',
    website: 'https://www.himalayanhospital.com',
    rating: 4.9,
    reviewCount: 312,
    yearsEstablished: 25,
    doctorsCount: 12,
    services: ['Panchakarma', 'Detox Therapy', 'Abhyanga', 'Shirodhara', 'Nasya', 'Virechana', 'Basti', 'Diabetes Care', 'Weight Management'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Accommodation', 'Diagnostic Support', 'Cafeteria', 'Wellness Programs'],
    openingHours: 'Mon-Sun: 24 Hours Open (Emergency available)',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80'
    ],
    latitude: 30.1314,
    longitude: 78.3150,
    mission: 'To offer complete therapeutic inpatient immersion merging ancient wisdom with modern diagnostic standards.',
    history: 'Celebrating 25 years in Tapovan, we have hosted patients from over 60 countries for chronic joint and metabolic rehabilitation.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', caption: 'Inpatient Deluxe Suite' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Himalayan Ayurvedic Immersion',
        description: 'Complete luxury clinical inpatient stay with 2 therapy sessions daily, custom yoga classes, and organic doshic diet plans.',
        duration: '14 Days',
        price: 48000,
        benefits: ['Deep joint lubrication (Janu Basti)', 'Complete digestive tract reset', 'Hormonal alignment'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '24 Hours Open', closed: false },
      { day: 'Tuesday', hours: '24 Hours Open', closed: false },
      { day: 'Wednesday', hours: '24 Hours Open', closed: false },
      { day: 'Thursday', hours: '24 Hours Open', closed: false },
      { day: 'Friday', hours: '24 Hours Open', closed: false },
      { day: 'Saturday', hours: '24 Hours Open', closed: false },
      { day: 'Sunday', hours: '24 Hours Open', closed: false }
    ]
  },
  {
    id: 'cl-5',
    name: 'Jiva Ayurveda Clinic & Rejuvenation Center',
    logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
    type: 'Ayurveda Clinic',
    description: 'Jiva provides authentic consultations and natural remedies for chronic conditions. Our team of doctors assesses your Prakriti to resolve illnesses from their root causes.',
    address: 'Sector 21C, Landmark Road',
    city: 'Faridabad',
    state: 'Haryana',
    country: 'India',
    phone: '+91 129 4040404',
    email: 'info@jiva.com',
    website: 'https://www.jiva.com',
    rating: 4.6,
    reviewCount: 420,
    yearsEstablished: 15,
    doctorsCount: 6,
    services: ['Detox Therapy', 'Abhyanga', 'PCOS Treatment', 'Diabetes Care', 'Stress Management'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Wellness Programs'],
    openingHours: 'Mon-Sat: 09:00 AM - 07:00 PM',
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80'
    ],
    latitude: 28.4116,
    longitude: 77.3155,
    mission: 'To digitize and standardize Ayurvedic consultations to ensure root cause healing reaches every household.',
    history: 'Jiva is one of the largest clinic networks in Northern India, serving chronic patients since 2011.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80', caption: 'Consultation & Pulse Center' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Prakriti Balance Package',
        description: 'Personalized constitution analysis, diet guidance, and 30-day supply of organic herbal formulas.',
        duration: '1 Day',
        price: 2500,
        benefits: ['Prakriti and Dosha analysis', 'Metabolic blueprint guidelines', 'Diet tracking schedules'],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Tuesday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Wednesday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Thursday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Friday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Saturday', hours: '09:00 AM - 07:00 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  },
  {
    id: 'cl-6',
    name: 'Somatheeram Ayurveda Village',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    type: 'Panchakarma Center',
    description: 'Somatheeram is the world’s first Ayurvedic resort, offering beautiful seaside cottages, yoga lessons, and complete Panchakarma programs in a pristine tropical landscape.',
    address: 'Chowara, Kovalam',
    city: 'Trivandrum',
    state: 'Kerala',
    country: 'India',
    phone: '+91 471 2266111',
    email: 'mail@somatheeram.in',
    website: 'https://www.somatheeram.in',
    rating: 4.9,
    reviewCount: 512,
    yearsEstablished: 30,
    doctorsCount: 15,
    services: ['Panchakarma', 'Detox Therapy', 'Abhyanga', 'Shirodhara', 'Nasya', 'Virechana', 'Basti', 'Skin Care'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Accommodation', 'Diagnostic Support', 'Cafeteria', 'Wellness Programs'],
    openingHours: 'Mon-Sun: 07:00 AM - 09:00 PM',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
    ],
    latitude: 8.3846,
    longitude: 76.9740,
    mission: 'To heal the world through seaside luxury wellness retreats and authentic classical Panchakarma routines.',
    history: 'Established in 1990, Somatheeram is the world’s first Ayurvedic village, recognized repeatedly by governments and ministries for exports excellence.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', caption: 'Seaside Therapy Room' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Seaside Purification program',
        description: '7 days of custom therapy, seaside cottage stay, dynamic yoga lessons, and custom organic meals.',
        duration: '7 Days',
        price: 35000,
        benefits: ['Complete bodily purification', 'Stress relief & grounding', 'Cardiovascular stamina'],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Tuesday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Wednesday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Thursday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Friday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Saturday', hours: '07:00 AM - 09:00 PM', closed: false },
      { day: 'Sunday', hours: '07:00 AM - 09:00 PM', closed: false }
    ]
  },
  {
    id: 'cl-7',
    name: 'Ayurmana Spine & Joint Wellness Center',
    logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    type: 'Holistic Healing Center',
    description: 'Ayurmana is specialized in treating chronic spine stiffness, sciatica, arthritis, and orthopedic ailments using traditional herbal paste poultices and targeted local enemas (Basti).',
    address: 'Kalyan Nagar, Outer Ring Road',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    phone: '+91 80 25493800',
    email: 'info@ayurmanabroad.com',
    website: 'https://www.ayurmanaspine.com',
    rating: 4.8,
    reviewCount: 167,
    yearsEstablished: 12,
    doctorsCount: 5,
    services: ['Abhyanga', 'Basti', 'Shirodhara', 'Stress Management'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Diagnostic Support', 'Wellness Programs'],
    openingHours: 'Mon-Sat: 08:30 AM - 06:30 PM',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80'
    ],
    latitude: 13.0232,
    longitude: 77.6418,
    mission: 'To deliver non-invasive orthotic joint care and muscular relief utilizing specialized classical local oil treatments.',
    history: 'Founded in Bangalore in 2014, Ayurmana is a premier center for spine alignments and skeletal joint disorders.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', caption: 'Spine & Joint Treatment Hall' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Spine & Sciatica Rejuvenation',
        description: 'Targeted Janu Basti, local oil pooling, herbal poultice massage (Patra Pinda Sveda), and custom lumbar stretches.',
        duration: '5 Days',
        price: 15500,
        benefits: ['Numbness reversal', 'Spine flexibility restoration', 'Joint pain management'],
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Tuesday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Wednesday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Thursday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Friday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Saturday', hours: '08:30 AM - 06:30 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  },
  {
    id: 'cl-8',
    name: 'Atreya Ayurvedic Hospital',
    logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    type: 'Ayurveda Hospital',
    description: 'Atreya offers state-of-the-art clinical inpatient facilities. Specialized in metabolic syndrome care, skin disorders, and complete Panchakarma detox cycles managed by award-winning Vaidyas.',
    address: 'Kothrud, Landmark Circle',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 20 25438900',
    email: 'pune@atreya.com',
    website: 'https://www.atreyaayurveda.com',
    rating: 4.7,
    reviewCount: 142,
    yearsEstablished: 14,
    doctorsCount: 7,
    services: ['Panchakarma', 'Detox Therapy', 'Virechana', 'Basti', 'Diabetes Care', 'Skin Care'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Accommodation', 'Diagnostic Support', 'Wellness Programs'],
    openingHours: 'Mon-Sun: 24 Hours Open',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80'
    ],
    latitude: 18.5074,
    longitude: 73.8077,
    mission: 'To heal chronic ailments through medical board certifications and strict hospital diagnostics coupled with traditional Shodhana.',
    history: 'A state-of-the-art medical Ayurvedic institution established in 2012 in Pune, offering 24/7 medical supervision.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80', caption: 'Clinical Ward & Therapy Block' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Clinical Skin Purification',
        description: 'For chronic psoriasis, eczema, and rashes. Incorporates custom Virechana purgation, organic blood purifiers, and cooling wraps.',
        duration: '10 Days',
        price: 22000,
        benefits: ['Pitta heat evacuation', 'Blood purification (Manjistha)', 'Silvery scale reduction'],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '24 Hours Open', closed: false },
      { day: 'Tuesday', hours: '24 Hours Open', closed: false },
      { day: 'Wednesday', hours: '24 Hours Open', closed: false },
      { day: 'Thursday', hours: '24 Hours Open', closed: false },
      { day: 'Friday', hours: '24 Hours Open', closed: false },
      { day: 'Saturday', hours: '24 Hours Open', closed: false },
      { day: 'Sunday', hours: '24 Hours Open', closed: false }
    ]
  },
  {
    id: 'cl-9',
    name: 'Sanjeevani Wellness Center & Yoga Ashram',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
    type: 'Wellness Center',
    description: 'Sanjeevani focuses on mental health restoration and yoga therapy. Combining daily pranayama, herbal oil drips, and constitutional diet plans to soothen adrenal exhaustion.',
    address: 'Kanakapura Road, Valley View',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    phone: '+91 80 28439900',
    email: 'ashram@sanjeevani.org',
    website: 'https://www.sanjeevaniayuryoga.org',
    rating: 4.8,
    reviewCount: 130,
    yearsEstablished: 16,
    doctorsCount: 4,
    services: ['Shirodhara', 'Abhyanga', 'Stress Management', 'Yoga Therapy'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Parking', 'Accommodation', 'Wellness Programs'],
    openingHours: 'Mon-Sun: 06:00 AM - 08:00 PM',
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80'
    ],
    latitude: 12.8943,
    longitude: 77.5458,
    mission: 'To promote mental tranquility and autonomic balance through yoga, meditation, and sensory calming routines.',
    history: 'Set up in 2010 on a peaceful campus on Kanakapura road, Sanjeevani provides stress management for urban professionals.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80', caption: 'Ashram Meditation Hall' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Vedic Mental Rejuvenation',
        description: 'Designed to relieve stress, combat burnout, and cure insomnia. Shirodhara drips, foot Abhyanga, and custom pranayama.',
        duration: '5 Days',
        price: 14000,
        benefits: ['Calms hyperactive Vata dosha', 'Enhances deep memory levels', 'Deep autonomic nervous reset'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Tuesday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Wednesday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Thursday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Friday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Saturday', hours: '06:00 AM - 08:00 PM', closed: false },
      { day: 'Sunday', hours: '06:00 AM - 08:00 PM', closed: false }
    ]
  },
  {
    id: 'cl-10',
    name: 'Madhavbaug Cardiac Care Clinic',
    logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    type: 'Holistic Healing Center',
    description: 'Madhavbaug is a certified leader in non-invasive cardiac care. Combining Panchakarma, diet regulation, and stress management, we help reverse heart diseases and type-2 diabetes naturally.',
    address: 'Thane West, Gokhale Road',
    city: 'Thane',
    state: 'Maharashtra',
    country: 'India',
    phone: '+91 22 25438800',
    email: 'care@madhavbaug.org',
    website: 'https://www.madhavbaug.org',
    rating: 4.7,
    reviewCount: 384,
    yearsEstablished: 20,
    doctorsCount: 8,
    services: ['Panchakarma', 'Diabetes Care', 'Weight Management', 'Stress Management'],
    facilities: ['Private Therapy Rooms', 'Online Consultation', 'Pharmacy', 'Parking', 'Diagnostic Support'],
    openingHours: 'Mon-Sat: 09:30 AM - 06:30 PM',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80'
    ],
    latitude: 19.2183,
    longitude: 72.9781,
    mission: 'To reduce dependencies on cardiovascular drugs through non-invasive therapies, herbal extracts, and clinical diet corrections.',
    history: 'A pioneer clinic established in 2006, Madhavbaug has treated over a lakh cardiac patients throughout Maharashtra.',
    gallery: [
      { id: 'gal-1', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', caption: 'Cardiac Diagnostics Area' }
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Heart Health & Reversal program',
        description: 'Specialized clinic checks, arterial stress evaluations, custom low-sodium meals, and fat-cleansing enemas.',
        duration: '7 Days',
        price: 19000,
        benefits: ['Cardiovascular stamina increase', 'Cleanses arterial walls (Ama removal)', 'Normalizes arterial pressure'],
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80'
      }
    ],
    openingHoursList: [
      { day: 'Monday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Tuesday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Wednesday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Thursday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Friday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Saturday', hours: '09:30 AM - 06:30 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ]
  }
];

const MOCK_TESTIMONIALS = [
  { id: 't-1', patientName: 'Rohit Malhotra', disease: 'Type 2 Diabetes', treatment: 'Panchakarma & Diet shifts', recoveryTime: '3 Months', text: 'Dr. Vikram Singh\'s guidelines completely regulated my HbA1c levels. The customized diet coupled with metabolic herbs restored my stamina!', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { id: 't-2', patientName: 'Priya Varghese', disease: 'Sciatic Spine Pain', treatment: 'Kativasti & Herbal Oils', recoveryTime: '4 Weeks', text: 'Authentic warm oil pooling therapies at the Kerala Zen center relieved my intense back and leg stiffness. I am pain-free and walking comfortably.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 't-3', patientName: 'Smriti Mishra', disease: 'Severe PCOS & Bloating', treatment: 'Hormonal Herbal Teas', recoveryTime: '6 Months', text: 'I struggled with cystic acne and irregular periods. Rejuvenation herbs normalized my cycle naturally and cleared my skin thoroughly.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' }
];

module.exports = {
  MOCK_CLINICS,
  MOCK_TESTIMONIALS
};
