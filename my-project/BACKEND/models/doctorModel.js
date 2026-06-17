// BACKEND/models/doctorModel.js

const MOCK_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma',
    specialization: 'General Ayurveda & Panchakarma',
    qualification: 'BAMS, MD (Ayurveda) - Panchakarma Specialist',
    experience: 12,
    rating: 4.8,
    reviewCount: 124,
    fee: 500,
    consultationFee: 500,
    languages: ['Hindi', 'English', 'Sanskrit'],
    clinicName: 'Panchakarma Healing Sanctuary',
    city: 'Kochi',
    state: 'Kerala',
    about: 'Dr. Ananya Sharma is a renowned Ayurvedic physician specializing in Panchakarma therapies and detox wellness. With over 12 years of experience, she focuses on diagnosing root causes of disorders using ancient Nadi Pariksha and restoring system balance through customized detoxification regimens.',
    education: [
      'BAMS - Government Ayurveda College, Trivandrum',
      'MD in Panchakarma - IPGT & RA, Jamnagar',
      'Certificate Course in Yoga & Meditation - Kerala University'
    ],
    awards: [
      'AyurVaidya Excellence Award 2024',
      'Best Panchakarma Specialist of Kerala (2022)',
      'Member of National Ayurvedic Medical Association'
    ],
    specialExpertise: ['Panchakarma Detox', 'Stress Relief', 'Chronic Insomnia Therapy', 'Digestive Rejuvenation'],
    availability: 'Mon-Sat, 9:00 AM - 5:00 PM',
    onlineConsultation: true,
    offlineConsultation: true,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Iyer',
    specialization: 'Joint Care & Orthopedic Ayurveda',
    qualification: 'BAMS, MS (Ayurveda Shalya Tantra) - Marma Expert',
    experience: 15,
    rating: 4.9,
    reviewCount: 210,
    fee: 800,
    consultationFee: 800,
    languages: ['Tamil', 'English', 'Hindi', 'Malayalam'],
    clinicName: 'Marma Joint & Spine Healing Center',
    city: 'Chennai',
    state: 'Tamil Nadu',
    about: 'Dr. Rajesh Iyer is a seasoned Ayurveda surgeon and Marma specialist, focused on joint health, chronic spine disorders, and skeletal alignments. He combines traditional herbal oils with ancient Marma pressure techniques to treat back, knee, and neck conditions without surgical interventions.',
    education: [
      'BAMS - Madras Ayurveda College, Chennai',
      'MS in Shalya Tantra - SDM College of Ayurveda, Udupi',
      'Fellowship in Pain Management - Medvarsity'
    ],
    awards: [
      'Sushruta Rashtriya Award 2023',
      'Marma Chikitsa Samrat Title (2021)',
      'Executive Committee Member of Association of Ayurvedic Surgeons'
    ],
    specialExpertise: ['Marma Joint Therapy', 'Janu Basti', 'Sciatica Management', 'Rheumatoid Arthritis Care'],
    availability: 'Mon-Fri, 10:00 AM - 6:00 PM',
    onlineConsultation: false,
    offlineConsultation: true,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80'
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Gupta',
    specialization: 'Ayurvedic Dermatology & Skin Care',
    qualification: 'BAMS, Diploma in Ayurvedic Cosmetology',
    experience: 8,
    rating: 4.7,
    reviewCount: 96,
    fee: 600,
    consultationFee: 600,
    languages: ['Hindi', 'English', 'Punjabi'],
    clinicName: 'Siddha Skin & Hair Clinic',
    city: 'New Delhi',
    state: 'Delhi',
    about: 'Dr. Priya Gupta is a highly dedicated physician expert in treating deep skin disorders (Kushtha) and hair concerns through blood purification, herbal pastes, and metabolic path corrections. She focuses on using nature\'s bounty to restore external radiance and eliminate deep internal cellular impurities.',
    education: [
      'BAMS - Ayurvedic & Unani Tibbia College, New Delhi',
      'Diploma in Ayurvedic Cosmetology - NIA, Jaipur',
      'Advanced Skin Therapy Training - Bangalore'
    ],
    awards: [
      'Young Achiever in Ayurvedic Dermatology 2022',
      'Dermatology Panelist at World Ayurveda Congress',
      'Member of Ayurvedic Cosmetology Council'
    ],
    specialExpertise: ['Psoriasis Treatment', 'Cystic Acne Healing', 'Eczema Management', 'Hair Fall Therapy'],
    availability: 'Mon-Sat, 11:00 AM - 7:00 PM',
    onlineConsultation: true,
    offlineConsultation: true,
    photo: 'https://images.unsplash.com/photo-1594824436998-058a2312422b?w=400&q=80'
  },
  {
    id: 'doc-4',
    name: 'Dr. Vikram Singh',
    specialization: 'Metabolic & Diabetes Management',
    qualification: 'BAMS, MD (Kaya Chikitsa) - Internal Medicine Expert',
    experience: 20,
    rating: 4.9,
    reviewCount: 342,
    fee: 1000,
    consultationFee: 1000,
    languages: ['Hindi', 'English', 'Gujarati'],
    clinicName: 'Madhu-Meha Reversal Clinic',
    city: 'Mumbai',
    state: 'Maharashtra',
    about: 'Dr. Vikram Singh has over 20 years of expertise in internal Ayurvedic medicine (Kaya Chikitsa), specialized in managing metabolic imbalances, particularly Type 2 Diabetes (Madhumeha) and thyroid concerns. He has successfully helped hundreds of patients reduce drug dependencies through personalized dietary correction and pancreatic support herbs.',
    education: [
      'BAMS - Banaras Hindu University (BHU), Varanasi',
      'MD in Kaya Chikitsa - National Institute of Ayurveda (NIA), Jaipur',
      'PhD in Diabetes Management in Ayurveda - BHU'
    ],
    awards: [
      'Dhanwantari National Award 2025',
      'Pioneer of Diabetes Reversal in Ayurveda (2020)',
      'Advisor to AYUSH Ministry on Metabolic Disorders'
    ],
    specialExpertise: ['Diabetes Management', 'Thyroid Rejuvenation', 'Metabolic Correction', 'Weight Control'],
    availability: 'Mon-Fri, 9:00 AM - 4:00 PM',
    onlineConsultation: true,
    offlineConsultation: false,
    photo: 'https://images.unsplash.com/photo-1537368910025-7028500a263c?w=400&q=80'
  }
];

module.exports = {
  MOCK_DOCTORS
};
