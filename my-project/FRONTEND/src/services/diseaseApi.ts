import axios from 'axios';

const BACKEND_URL = 'http://localhost:5174/api';

// TypeScript Interfaces
export interface RecoveryTimeline {
  step: string;
  description: string;
  duration?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ModernData {
  wikiExtract?: string | null;
  wikiImage?: string | null;
  fdaApprovedDrugs?: string[];
  lastSynced?: string;
}

export interface Disease {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  symptoms: string[];
  causes: string[];
  ayurvedicPerspective: string;
  treatments: string[];
  recommendedHerbs: string[];
  dietRecommendations: string[];
  foodsToAvoid: string[];
  lifestyleRecommendations: string[];
  recoveryTimeline: RecoveryTimeline[];
  severity: 'Low' | 'Moderate' | 'High';
  image: string;
  faq: FAQ[];
  modernData?: ModernData | null;
}

export interface DiseaseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Local mock fallback data (contains the 10 detailed diseases matching backend)
export const MOCK_DISEASE_CATEGORIES: DiseaseCategory[] = [
  { id: 'cat-1', name: "Digestive Disorders", description: "Imbalances in digestive fire (Agni) leading to toxin (Ama) buildup.", icon: "Activity" },
  { id: 'cat-2', name: "Skin Disorders", description: "Blood impurity and liver channel blockages manifest as external skin issues.", icon: "Info" },
  { id: 'cat-3', name: "Women's Health", description: "Hormonal and reproductive system regulation through tissue nourishment.", icon: "Droplets" },
  { id: 'cat-4', name: "Respiratory Disorders", description: "Breath channel (Prana Vaha Srotas) blockages causing wheezing.", icon: "Wind" },
  { id: 'cat-5', name: "Lifestyle Diseases", description: "Metabolic and cardiovascular issues originating from poor lifestyle habits.", icon: "Heart" },
  { id: 'cat-6', name: "Mental Wellness", description: "Restoring psychological calmness and quality sleep cycles.", icon: "Brain" },
];

export const MOCK_DISEASES: Disease[] = [
  {
    id: "dis-1",
    name: "Diabetes",
    slug: "diabetes",
    category: "Lifestyle Diseases",
    shortDescription: "Known as Madhumeha in Ayurveda, managing blood glucose through Kapha and Pitta dosha balancing.",
    severity: "High",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80",
    symptoms: ["Excessive thirst", "Frequent urination", "Fatigue", "Slow healing cuts", "Numbness in hands/feet"],
    causes: ["Kapha imbalance", "Lack of physical activity", "Excessive intake of sweets and heavy foods"],
    ayurvedicPerspective: "Known as Madhumeha, it is a metabolic disorder (Prameha) dominated by Kapha dosha, which affects fat tissues and urine chemistry due to low digestive fire (Agni).",
    treatments: ["Panchakarma (Virechana & Basti)", "Regular intake of herbal decocations"],
    recommendedHerbs: ["Gurmar (Gymnema)", "Nisha-Amalaki (Turmeric & Amla)", "Vijaysar", "Methi (Fenugreek)"],
    dietRecommendations: ["Barley grains", "Bitter gourd juice", "Fenugreek seeds", "Roasted chickpeas"],
    foodsToAvoid: ["Refined sugars", "White rice", "Yoghurt and heavy dairy", "Cold beverages"],
    lifestyleRecommendations: ["Mandukasana (Frog pose) Yoga", "Daily 45-minute brisk morning walks", "Avoiding daytime sleeping"],
    recoveryTimeline: [
      { step: "Dosha Evaluation", description: "Assess metabolic fire (Agni) levels", duration: "1 Week" },
      { step: "Toxin Clearing", description: "Deep cleansing herbs to remove blockages", duration: "3 Weeks" },
      { step: "Glycemic Stabilisation", description: "Herbal supplements and diet charts", duration: "8 Weeks" },
      { step: "Maintenance", description: "Adopting custom lifestyle schedules", duration: "Ongoing" }
    ],
    faq: [
      { question: "Is Ayurvedic treatment safe alongside insulin?", answer: "Yes, Ayurvedic herbs work synergistically and help reduce insulin resistance under professional Vaidya guidance." }
    ]
  },
  {
    id: "dis-2",
    name: "PCOS",
    slug: "pcos",
    category: "Women's Health",
    shortDescription: "Hormonal and reproductive system restoration through ovarian tissue nourishment.",
    severity: "Moderate",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=500&q=80",
    symptoms: ["Irregular cycles", "Hirsutism", "Weight gain", "Cystic acne", "Thinning hair"],
    causes: ["Artava Srotas blockages", "Kapha-Vata imbalances", "Stress and processed food intake"],
    ayurvedicPerspective: "Originates from a Kapha-Vata blockage in the channels regulating the reproductive fluids (Artava Srotas), resulting in cyst accumulation and metabolic stagnation.",
    treatments: ["Uttar Basti", "Virechana detoxification", "Abhyanga body massages"],
    recommendedHerbs: ["Shatavari", "Kanchnar Guggulu", "Ashoka bark", "Aloevera juice"],
    dietRecommendations: ["Warm sesame water", "Fresh papaya", "Sprouted legumes", "Leafy vegetables"],
    foodsToAvoid: ["Cold dairy", "Processed bakery items", "Excessive red meat", "Refined flour"],
    lifestyleRecommendations: ["Butterfly pose & Surya Namaskar", "Stress management", "Early dinner (before 7 PM)"],
    recoveryTimeline: [
      { step: "Srotas Cleansing", description: "Clearing blockages in reproductive paths", duration: "2 Weeks" },
      { step: "Cycle Regulation", description: "Balancing Vata energy flow (Apana Vayu)", duration: "12 Weeks" },
      { step: "Hormonal Harmony", description: "Nourishing ovaries and balancing insulin levels", duration: "24 Weeks" }
    ],
    faq: [
      { question: "Can PCOS be completely cured by Ayurveda?", answer: "Yes, by targeting the root metabolic blockages, normal ovarian function and regular cycles can be restored permanently." }
    ]
  },
  {
    id: "dis-3",
    name: "Arthritis",
    slug: "arthritis",
    category: "Lifestyle Diseases",
    shortDescription: "Addressing joint pain (Amavata or Sandhivata) by removing toxins and lubricating connective tissues.",
    severity: "High",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    symptoms: ["Joint swelling", "Morning stiffness", "Chronic joint pain", "Reduced mobility", "Fatigue"],
    causes: ["Accumulated toxins (Ama)", "Aggravated Vata dosha", "Exposure to cold and damp conditions"],
    ayurvedicPerspective: "Known as Amavata (similar to Rheumatoid Arthritis) or Sandhivata (Osteoarthritis). It involves the accumulation of Ama (undigested toxins) in joint junctions due to impaired Agni.",
    treatments: ["Panchakarma (Virechana & Basti)", "Patra Pinda Sveda (herbal poultice massage)", "Janu Basti"],
    recommendedHerbs: ["Shallaki (Boswellia)", "Guggulu", "Nirgundi", "Ginger (Sunthi)"],
    dietRecommendations: ["Warm soups", "Cooked grains with Ghee", "Garlic and ginger infusions", "Warm water"],
    foodsToAvoid: ["Yoghurt and cheese", "Nightshade vegetables (potatoes, tomatoes)", "Cold salads", "White beans"],
    lifestyleRecommendations: ["Gentle joint rotations (Sukshma Vyayama)", "Daily application of warm sesame oil", "Keeping joints warm"],
    recoveryTimeline: [
      { step: "Ama Digestion", description: "Consuming hot spices to clear raw metabolic toxins", duration: "2 Weeks" },
      { step: "Vata Pacification", description: "Warm oil pooling and herbal lubrication", duration: "6 Weeks" },
      { step: "Tissue Rejuvenation", description: "Strengthening bones and joints (Asthi Dhatu)", duration: "16 Weeks" }
    ],
    faq: [
      { question: "How does Shallaki help with pain?", answer: "Shallaki is a natural anti-inflammatory agent that blocks inflammatory compounds without causing stomach irritation." }
    ]
  },
  {
    id: "dis-4",
    name: "Migraine",
    slug: "migraine",
    category: "Mental Wellness",
    shortDescription: "Alleviating deep vascular headaches by soothing aggravated Pitta-Vata channels near the nervous system.",
    severity: "Moderate",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
    symptoms: ["One-sided throbbing pain", "Sensitivity to light & sound", "Nausea or vomiting", "Visual visual aura"],
    causes: ["Pitta-Vata imbalance", "Irregular sleep cycles", "Excessive heat and direct sun exposure"],
    ayurvedicPerspective: "Considered as Ardhavabhedaka, it is primarily a Vata-Pitta disorder aggravated by sluggish digestion (Mandagni), leading to heat blockages in head channels.",
    treatments: ["Nasya therapy (herbal nasal drops)", "Shirodhara (warm oil dripping)", "Foot massage (Pada Abhyanga)"],
    recommendedHerbs: ["Brahmi", "Godanti Bhasma", "Ashwagandha", "Yashtimadhu (Licorice)"],
    dietRecommendations: ["Sweet juicy fruits", "Cow's Ghee", "Coconut water", "Cooling milk with cardamom"],
    foodsToAvoid: ["Fermented foods", "Spicy pickles and chillies", "Caffeine and chocolates", "Stale food"],
    lifestyleRecommendations: ["Pranayama (Anulom Vilom)", "Dark room meditation", "Consistent sleep schedule"],
    recoveryTimeline: [
      { step: "Channel Clearing", description: "Nasal drops (Nasya) to clear sinus and head channels", duration: "2 Weeks" },
      { step: "Nervous Soothing", description: "Shirodhara to relieve stress and lower vascular pressure", duration: "4 Weeks" },
      { step: "Root Prevention", description: "Digestive supplements to prevent toxic gas generation", duration: "12 Weeks" }
    ],
    faq: [
      { question: "Why is Shirodhara recommended for migraines?", answer: "Shirodhara relaxes the central nervous system, reduces adrenaline levels, and dilates cranial vessels, preventing migraine triggers." }
    ]
  },
  {
    id: "dis-5",
    name: "Psoriasis",
    slug: "psoriasis",
    category: "Skin Disorders",
    shortDescription: "Clearing systemic skin scaling and inflammation (Kitibha Kushtha) through blood purification therapies.",
    severity: "High",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80",
    symptoms: ["Silvery scale patches", "Severe skin itching", "Dry cracked skin", "Inflamed reddish patches"],
    causes: ["Vata-Kapha skin imbalance", "Toxic food combinations (Viruddha Ahara)", "Severe mental stress"],
    ayurvedicPerspective: "Referred to as Kitibha Kushtha, it involves the accumulation of toxins in the skin tissues (Tvach), blood (Rakta), and lymphatic fluids (Lasika) due to incompatible food pairings.",
    treatments: ["Vamana (induced vomiting)", "Virechana (purgation)", "Takradhara (buttermilk head drip)"],
    recommendedHerbs: ["Neem", "Manjistha", "Khadir", "Haridra (Turmeric)"],
    dietRecommendations: ["Bitter vegetables", "Mung beans", "Light squash", "Boiled warm water"],
    foodsToAvoid: ["Fish with milk (incompatible)", "Sour citrus fruits", "Salty chips", "Alcohol and fermented items"],
    lifestyleRecommendations: ["Yoga for emotional balancing", "Applying cold-pressed coconut oil mixed with camphor", "Avoiding harsh chemical soaps"],
    recoveryTimeline: [
      { step: "Toxin Purging", description: "Clinical Panchakarma to expel blood impurities", duration: "4 Weeks" },
      { step: "Blood Purifying", description: "Bitter herb regimens to neutralize metabolic acid", duration: "12 Weeks" },
      { step: "Skin Repair", description: "Moisturising pastes and tissue building herbs", duration: "24 Weeks" }
    ],
    faq: [
      { question: "What is Viruddha Ahara?", answer: "It refers to incompatible food combinations, like eating fish and milk together, which Ayurveda warns creates toxic blood reactions." }
    ]
  },
  {
    id: "dis-6",
    name: "Obesity",
    slug: "obesity",
    category: "Lifestyle Diseases",
    shortDescription: "Reversing lipid tissue overgrowth (Sthoulya) by accelerating metabolic fire (Agni) and modifying diet.",
    severity: "Moderate",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80",
    symptoms: ["Shortness of breath on exertion", "Excessive sweating", "Lethargy & low energy", "Constant hunger cravings"],
    causes: ["Kapha dosha imbalance", "Sluggish metabolic fire (Meda Dhatvagni)", "Sedentary lifestyle"],
    ayurvedicPerspective: "Known as Medoroga or Sthoulya. The fat tissue channel (Meda Vaha Srotas) becomes blocked, converting all nutrition into fat instead of building bone or muscle.",
    treatments: ["Udvartana (dry powder body massage)", "Lekhana Basti (scraping enemas)", "Virechana"],
    recommendedHerbs: ["Guggulu", "Triphala", "Vrikshamla (Garcinia)", "Ginger"],
    dietRecommendations: ["Barley and millet", "Warm honey water on empty stomach", "Green leafy salads", "Warm spices"],
    foodsToAvoid: ["Cold water", "Sweets and ice creams", "Deep fried items", "Excessive wheat and rice"],
    lifestyleRecommendations: ["Kapalbhati and Surya Namaskar", "Active physical exercise", "No sleeping in the afternoon"],
    recoveryTimeline: [
      { step: "Channel Opening", description: "Dry powder massages (Udvartana) to break down fat", duration: "3 Weeks" },
      { step: "Metabolism Reset", description: "Herbs to accelerate liver fire (Dhatvagni)", duration: "8 Weeks" },
      { step: "Tissue Balancing", description: "Building muscle tissue while trimming lipids", duration: "16 Weeks" }
    ],
    faq: [
      { question: "Why is cold water restricted in weight management?", answer: "Cold water dampens the digestive fire (Agni), slows down the metabolism, and increases Kapha dosha, which promotes fat storage." }
    ]
  },
  {
    id: "dis-7",
    name: "Asthma",
    slug: "asthma",
    category: "Respiratory Disorders",
    shortDescription: "Relieving breath channel blockages (Prana Vaha Srotas) by clearing chest mucus.",
    severity: "High",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    symptoms: ["Wheezing sound", "Tightness in chest", "Shortness of breath", "Dry cough", "Sleep disruptions"],
    causes: ["Kapha-Vata breath imbalance", "Exposure to cold air and dust", "Eating cold, heavy foods"],
    ayurvedicPerspective: "Called Tamaka Shwasa. It originates in the digestive system, where impaired stomach digestion produces mucus that travels upwards and block breathing paths (Prana Vaha Srotas).",
    treatments: ["Vamana (therapeutic vomiting)", "Mrídu Swedana (light chest warming)", "Nasyam"],
    recommendedHerbs: ["Vasa (Adhatoda)", "Kantakari", "Tulsi", "Trikatu (Ginger, Black pepper, Long pepper)"],
    dietRecommendations: ["Warm soups", "Rice with cumin", "Ginger tea", "Warm water with honey"],
    foodsToAvoid: ["Bananas and curd", "Cold items from refrigerator", "Carbonated drinks", "Heavy deep-fried flours"],
    lifestyleRecommendations: ["Pranayama (Bhastrika)", "Daily chest inhalation of steam with eucalyptus", "Avoiding cold drafty rooms"],
    recoveryTimeline: [
      { step: "Mucus Liquification", description: "Applying salt-oil to chest with local heat", duration: "1 Week" },
      { step: "Congestion Clearing", description: "Expelling deep thoracic toxins via Vamana or herbs", duration: "3 Weeks" },
      { step: "Lung Rejuvenation", description: "Respiratory tonics (Rasayana) to strengthen airways", duration: "12 Weeks" }
    ],
    faq: [
      { question: "Is Asthma treatment linkable to digestion?", answer: "Yes! Ayurveda teaches that weak stomach Agni creates toxic phlegm, which travels and constricts breathing channels." }
    ]
  },
  {
    id: "dis-8",
    name: "Gastritis",
    slug: "gastritis",
    category: "Digestive Disorders",
    shortDescription: "Cooling burning sensations in the stomach (Amlapitta) by regulating digestive acid.",
    severity: "Moderate",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80",
    symptoms: ["Burning chest pain", "Sour belching", "Nausea after eating", "Stomach bloating", "Indigestion"],
    causes: ["Aggravated Pitta dosha", "Spicy, fermented, and sour foods", "Skipping meals and eating late"],
    ayurvedicPerspective: "Referred to as Amlapitta. Aggravated Pitta dosha increases the sourness and acidity of digestive fluids, leading to localized inflammation in stomach linings.",
    treatments: ["Virechana (purgation)", "Avipattikar Churna intake", "Cold milk therapies"],
    recommendedHerbs: ["Amalaki (Amla)", "Yashtimadhu (Licorice)", "Shatavari", "Aloe Vera"],
    dietRecommendations: ["Boiled rice with coconut milk", "Pomegranate juice", "Mung dal soup", "Fennel seed water"],
    foodsToAvoid: ["Vinegar and tomatoes", "Red chillies and garlic", "Fermented batters", "Sour curd"],
    lifestyleRecommendations: ["Cooling Sheetali Pranayama", "Eating meals at fixed timings", "Avoiding sleeping immediately after lunch"],
    recoveryTimeline: [
      { step: "Acid Neutralisation", description: "Cooling sweet herbs to soothe inflamed lining", duration: "1 Week" },
      { step: "Pitta Expulsion", description: "Mild purgation to throw out sour bile from the system", duration: "3 Weeks" },
      { step: "Agni Correction", description: "Restoring balanced digestive fire without generating acid", duration: "8 Weeks" }
    ],
    faq: [
      { question: "How does Licorice help Gastritis?", answer: "Licorice root coats and protects the stomach lining, encouraging healthy mucus secretion to buffer against excess acid." }
    ]
  },
  {
    id: "dis-9",
    name: "Insomnia",
    slug: "insomnia",
    category: "Mental Wellness",
    shortDescription: "Calming hyperactive mind channels (Anidra) using soothing oil massages and mental adaptogens.",
    severity: "Low",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
    symptoms: ["Difficulty falling asleep", "Waking up in the middle of night", "Waking up tired", "Daytime irritability"],
    causes: ["Aggravated Vata dosha", "Overactive mind (Tarpaka Kapha dryout)", "Excessive blue-light exposure"],
    ayurvedicPerspective: "Known as Anidra. Caused by Vata-Tarpaka dryness. High Vata energy excites the mind, preventing the heavy, calming Kapha energy required to fall asleep naturally.",
    treatments: ["Shirodhara", "Abhyanga (warm body massage)", "Pada Abhyanga (warm foot rub before bed)"],
    recommendedHerbs: ["Ashwagandha", "Jatamansi", "Brahmi", "Tagar (Valerian)"],
    dietRecommendations: ["Warm buffalo milk with nutmeg", "Oatmeal", "Sweet almonds", "Mashed rice with Ghee"],
    foodsToAvoid: ["Coffee, green tea, carbonated drinks", "Dry crunchy crackers", "Spicy food at dinner"],
    lifestyleRecommendations: ["Gentle meditation before bed", "Massaging soles and temples with warm sesame oil", "No screens 2 hours before bed"],
    recoveryTimeline: [
      { step: "Mind Soothing", description: "Warm head oil drippings (Shirodhara) to quiet thoughts", duration: "1 Week" },
      { step: "Vata Regulation", description: "Calming herbs to balance nervous transmission", duration: "3 Weeks" },
      { step: "Sleep Cycle Restore", description: "Consistency in bedtime routines and nourishing diet", duration: "6 Weeks" }
    ],
    faq: [
      { question: "Why buffalo milk for sleep?", answer: "Ayurveda considers buffalo milk heavier and more calming (inducing natural sleepiness) compared to cow milk." }
    ]
  },
  {
    id: "dis-10",
    name: "Anxiety",
    slug: "anxiety",
    category: "Mental Wellness",
    shortDescription: "Balancing neurological wind (Manovaha Srotas) through stabilizing breathing and brain tonics.",
    severity: "Moderate",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
    symptoms: ["Racing thoughts", "Palpitations", "Nervous tremors", "Restlessness", "Cold hands and feet"],
    causes: ["Hyperactive Prana Vayu", "Weak nervous tissue (Majja Dhatu)", "Irregular eating and sleeping patterns"],
    ayurvedicPerspective: "A Vata disorder affecting the mind channels (Manovaha Srotas). The erratic nature of Vata mimics wind, causing racing thoughts, nervousness, and lack of grounding.",
    treatments: ["Shirodhara", "Abhyanga", "Pranayama (Nadi Shodhana)"],
    recommendedHerbs: ["Ashwagandha", "Brahmi", "Shankhpushpi", "Vacha"],
    dietRecommendations: ["Warm, sweet, and oily foods", "Cooked root vegetables", "Ghee", "Warm soups and stews"],
    foodsToAvoid: ["Raw cold vegetables", "Dry snacks and chips", "Caffeine, energy drinks, and alcohol"],
    lifestyleRecommendations: ["Daily grounding meditation", "Self-massage (Abhyanga) every morning", "Yoga for grounding (Vrikshasana)"],
    recoveryTimeline: [
      { step: "System Grounding", description: "Nourishing oil massage to lower erratic wind energy", duration: "2 Weeks" },
      { step: "Brain Tonics", description: "Nootropic herbs to repair and soothe nervous tissues", duration: "6 Weeks" },
      { step: "Stability Routine", description: "Rigid sleep, eating, and meditation time mappings", duration: "12 Weeks" }
    ],
    faq: [
      { question: "How does Ashwagandha calm anxiety?", answer: "Ashwagandha acts as an adaptogen that lowers cortisol levels, strengthens the nervous system, and calms Vata dosha." }
    ]
  }
];

export interface DiseaseResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000
});

export const diseaseApi = {
  getDiseaseCategories: async (): Promise<DiseaseResponse<DiseaseCategory[]>> => {
    try {
      const res = await client.get('/disease-categories');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_DISEASE_CATEGORIES, isFallback: true, error: err.message };
    }
  },

  getDiseases: async (): Promise<DiseaseResponse<Disease[]>> => {
    try {
      const res = await client.get('/diseases');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_DISEASES, isFallback: true, error: err.message };
    }
  },

  getDiseaseById: async (id: string): Promise<DiseaseResponse<Disease | undefined>> => {
    try {
      const res = await client.get(`/diseases/${id}`);
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      const found = MOCK_DISEASES.find(d => d.id === id || d.slug === id);
      return { data: found, isFallback: true, error: err.message };
    }
  },

  getPopularDiseases: async (): Promise<DiseaseResponse<Disease[]>> => {
    try {
      const res = await client.get('/popular-diseases');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      const popular = MOCK_DISEASES.filter(d => 
        ["diabetes", "pcos", "arthritis", "migraine", "psoriasis"].includes(d.slug)
      );
      return { data: popular, isFallback: true, error: err.message };
    }
  },

  syncDiseases: async (): Promise<DiseaseResponse<any>> => {
    try {
      const res = await client.post('/diseases/sync');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: null, isFallback: true, error: err.message };
    }
  }
};
