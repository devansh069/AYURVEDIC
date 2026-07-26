import axios from 'axios';

const BACKEND_URL = 'http://localhost:5174/api';

// Static local mock data for fallback or offline mode
export const MOCK_STATS = {
  patients: 10450,
  doctors: 1120,
  clinics: 512,
  treatments: 54
};

export const MOCK_DISEASES = [
  { id: 'dis-1', name: 'Diabetes', slug: 'diabetes', description: 'Known as Madhumeha in Ayurveda, managing blood glucose through Kapha and Pitta dosha balancing.', category: 'Lifestyle' },
  { id: 'dis-2', name: 'PCOS', slug: 'pcos', description: 'Hormonal and reproductive system restoration through ovarian tissue rejuvenation and toxic waste removal.', category: 'Women\'s Health' },
  { id: 'dis-3', name: 'Arthritis', slug: 'arthritis', description: 'Addressing joint pain (Amavata or Sandhivata) by removing toxins and lubricating connective tissues.', category: 'Bone & Joints' },
  { id: 'dis-4', name: 'Migraine', slug: 'migraine', description: 'Alleviating deep vascular headaches by soothing aggravated Pitta-Vata channels near the nervous system.', category: 'Nervous System' },
  { id: 'dis-5', name: 'Psoriasis', slug: 'psoriasis', description: 'Clearing systemic skin scaling and inflammation (Kitibha Kushtha) through blood purification therapies.', category: 'Skin Care' },
  { id: 'dis-6', name: 'Obesity', slug: 'obesity', description: 'Reversing lipid tissue overgrowth (Sthoulya) by accelerating metabolic fire (Agni) and modifying diet.', category: 'Metabolic' }
];

export const MOCK_TREATMENT_CATEGORIES = [
  { id: 'cat-panch', name: "Panchakarma", description: "Classical fivefold detoxification and rejuvenation therapies.", icon: "Activity" },
  { id: 'cat-detox', name: "Detox Therapy", description: "Cleansing body channels of accumulated toxins (Ama).", icon: "Sparkles" },
  { id: 'cat-herb', name: "Herbal Therapy", description: "Botanical formulations custom-tailored for organ system healing.", icon: "Sprout" },
  { id: 'cat-yoga', name: "Yoga Therapy", description: "Pranayama and alignment postures to stabilize nervous energy.", icon: "Compass" },
  { id: 'cat-life', name: "Lifestyle Therapy", description: "Adapting daily schedules (Dinacharya) to match body constitution.", icon: "Clock" },
  { id: 'cat-prog', name: "Wellness Programs", description: "Multidisciplinary health restoration plans for chronic conditions.", icon: "Heart" }
];

export const MOCK_TREATMENTS = [
  {
    id: 'trt-1',
    name: 'Panchakarma',
    slug: 'panchakarma',
    category: 'Panchakarma',
    description: 'The ultimate 5-action deep tissue purification and cellular level detoxification regime.',
    overview: 'Panchakarma is the cornerstone of Ayurvedic detoxification. It consists of five major procedures (Vamana, Virechana, Basti, Nasya, and Raktamokshana) designed to deep-cleanse body tissues, release accumulated metabolic waste (Ama), and restore primary dosha harmony.',
    benefits: ['Removes cellular toxins', 'Balances Vata, Pitta, and Kapha', 'Rejuvenates digestive fire (Agni)', 'Strengthens immune system'],
    procedure: 'Panchakarma involves three phases: Poorva Karma (preparatory oiling & sweating), Pradhana Karma (the main cleansing therapies), and Paschat Karma (dietary rehabilitation rules).',
    duration: '7 - 21 Days',
    recoveryTime: '3 - 7 Days',
    costEstimate: 15000,
    suitableFor: ['Chronic Digestive Issues', 'Arthritis', 'Skin Conditions', 'Metabolic Disorders'],
    contraindications: ['Severe exhaustion', 'Pregnancy', 'Acute infectious fevers'],
    precautions: ['Strict diet rules must be followed', 'Avoid direct cold draft winds', 'Refrain from heavy exercise'],
    steps: ['Snehana (Internal & external oiling)', 'Swedana (Herbal steam therapy)', 'Pradhana Karma (Detoxification acts)', 'Samsarjana Krama (Dietary return schedule)'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    rating: 4.9,
    reviewCount: 154,
    faq: [{ question: 'Is Panchakarma painful?', answer: 'No, the therapies consist of oil massages, herbal steams, and gentle elimination procedures designed for soothing detoxification.' }]
  },
  {
    id: 'trt-2',
    name: 'Vamana',
    slug: 'vamana',
    category: 'Panchakarma',
    description: 'Therapeutic emesis for expelling excess Kapha dosha from the upper respiratory and digestive tracts.',
    overview: 'Vamana is one of the five Panchakarma therapies specifically targeted at eliminating aggravated Kapha dosha. By inducing therapeutic vomiting through safe herbal mixtures, it clears respiratory channels, chest congestion, and metabolic sluggishness.',
    benefits: ['Clears respiratory passages', 'Cures chronic asthma and bronchitis', 'Improves digestion', 'Reduces Kapha skin issues like psoriasis'],
    procedure: 'Preparatory oiling (Snehana) is done for days. On the morning of therapy, the patient consumes special milk or licorice decoction, followed by emetic herbs under strict medical supervision.',
    duration: '3 - 5 Days',
    recoveryTime: '2 Days',
    costEstimate: 4500,
    suitableFor: ['Chronic Bronchitis', 'Asthma', 'Psoriasis', 'Hypothyroidism'],
    contraindications: ['Heart diseases', 'Hypertension', 'Children', 'Elderly'],
    precautions: ['Complete rest is required', 'Drink warm liquids only', 'Do not sleep during daytime'],
    steps: ['Internal oil consumption', 'Full-body oil massage', 'Emetic decoction administration', 'Post-purging throat soothing and light diet'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    rating: 4.8,
    reviewCount: 88,
    faq: [{ question: 'Is Vamana safe?', answer: 'Yes, when done under qualified Vaidya supervision using precise herbal decoctions matching body strength.' }]
  },
  {
    id: 'trt-3',
    name: 'Virechana',
    slug: 'virechana',
    category: 'Panchakarma',
    description: 'Therapeutic purgation to cleanse blood channels and eliminate aggravated Pitta dosha from the liver and gallbladder.',
    overview: 'Virechana is a clinical purification therapy targeting Pitta dosha. It cleanses the liver, gallbladder, and small intestine of metabolic heat toxins, purifying the blood and restoring metabolic balance.',
    benefits: ['Purifies blood and heals skin diseases', 'Cures chronic acidity and gastritis', 'Improves liver function', 'Controls hormonal imbalances'],
    procedure: 'After preparatory oiling, the patient is administered natural purgative powders (like Senna or Trivrit) in the morning to induce safe, controlled bowel cleansing.',
    duration: '5 - 7 Days',
    recoveryTime: '2 Days',
    costEstimate: 5000,
    suitableFor: ['Eczema & Acne', 'PCOS', 'Gastritis & Ulcers', 'Gout'],
    contraindications: ['Diarrhea', 'Dehydration', 'Dysentery'],
    precautions: ['Avoid cold food and water', 'Refrain from physical exertion', 'Take light food post-cleanse'],
    steps: ['Preparatory internal Ghee drinking', 'External massage & steam', 'Purgative administration', 'Monitoring and dietary recovery'],
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80',
    rating: 4.9,
    reviewCount: 112,
    faq: [{ question: 'How many purgations happen in Virechana?', answer: 'Typically between 10 to 30 controlled bowel movements occur, which clear internal toxic heat from the blood and liver channels.' }]
  },
  {
    id: 'trt-4',
    name: 'Basti',
    slug: 'basti',
    category: 'Panchakarma',
    description: 'Medicated enema therapy to balance Vata dosha in the colon, addressing bone, joint, and nervous system disorders.',
    overview: 'Basti is considered the mother of all Ayurvedic treatments because it directly controls Vata dosha, the primary force behind most chronic illnesses. Through medicated oil and decoction enemas, it lubricates the colon, nourishes bone tissues, and calms the nervous system.',
    benefits: ['Lubricates joints and cures arthritis', 'Eradicates chronic constipation', 'Strengthens nervous system', 'Heals lower back pain and sciatica'],
    procedure: 'Medicated herbal oils or herbal decoctions are introduced via the rectal route using specialized enema bags under clinical conditions.',
    duration: '8 - 30 Days',
    recoveryTime: '3 Days',
    costEstimate: 8000,
    suitableFor: ['Sciatica', 'Osteoarthritis', 'Chronic Constipation', 'Hemiplegia'],
    contraindications: ['Active bleeding from rectum', 'Severe hemorrhoids', 'Indigestion'],
    precautions: ['Keep abdomen warm', 'Avoid heavy physical strain', 'Eat warm food only'],
    steps: ['Medicated oil enema (Anuvasana)', 'Decoction enema (Niruha)', 'Abdominal gentle massage', 'Warm water bathing and light food'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    rating: 4.9,
    reviewCount: 145,
    faq: [{ question: 'Why is Basti rectal?', answer: 'The colon is the primary seat of Vata dosha, and rectal absorption bypassing liver metabolism allows herbs to directly nourish joint and nervous tissues.' }]
  },
  {
    id: 'trt-5',
    name: 'Nasya',
    slug: 'nasya',
    category: 'Panchakarma',
    description: 'Nasal administration of medicated oils to clear sinuses, relieve chronic headaches, and calm mental stress.',
    overview: 'Nasya is the administration of medicated liquids (oils, juices, or powders) through the nasal passages. In Ayurveda, the nose is considered the gateway to the brain, and Nasya clears sinus blocks, alleviates migraines, and sharpens sensory perception.',
    benefits: ['Clears chronic sinus blocks', 'Relieves migraines and tension headaches', 'Prevents hair fall and early greying', 'Improves sleep and mental clarity'],
    procedure: 'The face and neck are massaged and steamed. Medicated oil drops (like Anu Taila) are administered in each nostril, followed by throat gargling and herbal smoke inhalation.',
    duration: '3 - 7 Days',
    recoveryTime: '1 Day',
    costEstimate: 2500,
    suitableFor: ['Migraines', 'Sinusitis', 'Cervical Spondylosis', 'Facial Paralysis'],
    contraindications: ['Immediately after eating', 'Acute cold/flu with fever', 'Under 7 or over 80 years'],
    precautions: ['Do not blow nose immediately', 'Avoid cold drafts', 'Do not wash head for a few hours'],
    steps: ['Facial massage (Mukha Abhyanga)', 'Facial steaming (Nadi Sweda)', 'Nasal oil drops drop-in', 'Gargle and herbal smoke inhalation'],
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80',
    rating: 4.7,
    reviewCount: 92,
    faq: [{ question: 'Does Nasya burn?', answer: 'Mild nasal tingling is normal and depends on the type of oil used (e.g. Anu Taila). It subsides after gargling with warm water.' }]
  },
  {
    id: 'trt-6',
    name: 'Raktamokshana',
    slug: 'raktamokshana',
    category: 'Panchakarma',
    description: 'Controlled therapeutic bloodletting to treat severe skin diseases, gout, and systemic blood impurity.',
    overview: 'Raktamokshana is the blood purification therapy of Panchakarma, targeted at flushing deep-seated Pitta blood toxins. Using clinical leeches (Jalaukavacharana) or syringe extraction, it purges localized skin inflammation and gout accumulations.',
    benefits: ['Instantly relieves skin inflammation', 'Cures severe chronic eczema and psoriasis', 'Reduces localized gout swelling', 'Purifies vascular channels'],
    procedure: 'Clinical, non-poisonous leeches are placed on the affected skin region to absorb toxic blood, or blood is drawn under sterile conditions.',
    duration: '1 - 3 Days',
    recoveryTime: '3 Days',
    costEstimate: 6000,
    suitableFor: ['Psoriasis patches', 'Chronic Eczema', 'Gouty Arthritis', 'Varicose Ulcers'],
    contraindications: ['Anemia', 'Hemophilia', 'Extreme weakness', 'Pregnancy'],
    precautions: ['Keep the wound dry and clean', 'Apply organic turmeric paste', 'Avoid exposure to direct heat'],
    steps: ['Area sterilization', 'Leech placement and suction monitoring', 'Leech removal with turmeric', 'Aseptic dressing'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
    rating: 4.8,
    reviewCount: 54,
    faq: [{ question: 'Do clinical leeches hurt?', answer: 'No, leech saliva contains natural anesthetic compounds, making the bite feel like a minor mosquito prick.' }]
  },
  {
    id: 'trt-7',
    name: 'Abhyanga',
    slug: 'abhyanga',
    category: 'Detox Therapy',
    description: 'Warm herbal oil body massage to soothe Vata, lubricate tissues, and stimulate circulation.',
    overview: 'Abhyanga is the classical full-body massage using warm medicated oils matched to the patient\'s dosha. It stimulates lymphatic drainage, calms the nervous system, and improves skin texture.',
    benefits: ['Reduces physical fatigue and body ache', 'Moisturizes and tones skin', 'Soothes nervous energy', 'Improves sleep patterns'],
    procedure: 'Rhythmic, synchronized strokes are applied to the entire body using customized warm herbal oils (like Mahanarayan or Dhanwantharam) for 45-60 minutes.',
    duration: '1 Day',
    recoveryTime: '0 Days',
    costEstimate: 2000,
    suitableFor: ['Fatigue', 'Joint Stiffness', 'Stress', 'Dry Skin'],
    contraindications: ['Severe indigestion', 'Fever', 'Acute inflammatory conditions'],
    precautions: ['Take a warm bath after session', 'Avoid eating heavy food immediately', 'Avoid cold drinks'],
    steps: ['Selection of herbal oil', 'Synchronized body massage', 'Rest for oil absorption', 'Warm herbal bath'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    rating: 4.9,
    reviewCount: 188,
    faq: [{ question: 'Can I do Abhyanga daily?', answer: 'Yes! Self-Abhyanga can be practiced daily before bathing to maintain joint lubrication and youthfulness.' }]
  },
  {
    id: 'trt-8',
    name: 'Shirodhara',
    slug: 'shirodhara',
    category: 'Lifestyle Therapy',
    description: 'Continuous pouring of warm medicated liquid on the forehead to calm the nervous system and relieve anxiety.',
    overview: 'Shirodhara is a unique Ayurvedic therapy where warm medicated liquid (oil, milk, or buttermilk) is poured in a continuous stream onto the forehead. It induces deep meditative states, balances brain chemistry, and relieves stress.',
    benefits: ['Alleviates chronic anxiety and stress', 'Cures severe insomnia', 'Relieves migraines and mental fatigue', 'Improves cognitive memory'],
    procedure: 'The patient lies down. A customized clay or metal pot is suspended over the forehead, pouring warm liquid in a rhythmic oscillation for 30-45 minutes.',
    duration: '3 - 7 Days',
    recoveryTime: '0 Days',
    costEstimate: 3500,
    suitableFor: ['Insomnia', 'Anxiety', 'Migraines', 'Mental Exhaustion'],
    contraindications: ['Brain tumors', 'Cuts/wounds on scalp', 'High fever'],
    precautions: ['Keep the head protected from drafts', 'Refrain from active brain tasks post-session', 'Do not sleep late'],
    steps: ['Medicated liquid preparation', 'Forehead stream pouring', 'Gentle scalp massage', 'Hair wash and rest'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    rating: 4.9,
    reviewCount: 204,
    faq: [{ question: 'What liquids are used in Shirodhara?', answer: 'Depending on the dosha: Ksheera (milk) for Pitta heat, Takra (buttermilk) for stress, and Taila (herbal oils) for Vata wind.' }]
  },
  {
    id: 'trt-9',
    name: 'Udvartana',
    slug: 'udvartana',
    category: 'Detox Therapy',
    description: 'Dry powder massage using scraping motions to break down subcutaneous fat and reduce Kapha dosha.',
    overview: 'Udvartana is a lymphatic massage performed using dry herbal powders in a direction opposite to hair growth. It helps break down fat cells, improves skin complexion, and manages obesity.',
    benefits: ['Reduces subcutaneous fat deposits', 'Tones muscles and skin', 'Exfoliates dead skin cells', 'Stimulates lymphatic circulation'],
    procedure: 'Custom dry herbal powders (like Triphala or Kolakulathadi) are rubbed vigorously onto the body in upward strokes for 45 minutes.',
    duration: '7 - 14 Days',
    recoveryTime: '1 Day',
    costEstimate: 2200,
    suitableFor: ['Obesity', 'Cellulite', 'Lethargy', 'Oily Skin'],
    contraindications: ['Dry skin conditions', 'Eczema', 'Wounds'],
    precautions: ['Avoid scraping on cuts', 'Take warm showers', 'Avoid moisturizing immediately'],
    steps: ['Powder warming', 'Vigorous upward scraping massage', 'Sweating chamber (optional)', 'Warm bath'],
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80',
    rating: 4.8,
    reviewCount: 110,
    faq: [{ question: 'Does Udvartana help in weight loss?', answer: 'Yes, it breaks down subcutaneous fat deposits and improves cellular metabolism when paired with dietary discipline.' }]
  },
  {
    id: 'trt-10',
    name: 'Herbal Therapy',
    slug: 'herbal-therapy',
    category: 'Herbal Therapy',
    description: 'Tailored organic botanical formulations to target chronic organ imbalances.',
    overview: 'Ayurvedic Herbal Therapy uses customized formulations (Churnas, Arishtas, and Kashayams) to treat specific system ailments, restoring digestive fire and nourishing bodily tissues (Dhatus).',
    benefits: ['Targeted organ healing', 'No chemical side effects', 'Strengthens digestion', 'Restores metabolic pathways'],
    procedure: 'Consultation with a Vaidya, pulse diagnostics, formulation prescription, and step-by-step intake schedule.',
    duration: '30 - 90 Days',
    recoveryTime: 'Ongoing',
    costEstimate: 1500,
    suitableFor: ['Indigestion', 'Low Immunity', 'Chronic Fatigue', 'Metabolic Imbalances'],
    contraindications: ['Self-medication without consulting a doctor'],
    precautions: ['Observe intake timings strictly', 'Report stomach irritation', 'Drink lukewarm water only'],
    steps: ['Dosha analysis', 'Custom formulation compounding', 'Ingestion schedule', 'Weekly review'],
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80',
    rating: 4.8,
    reviewCount: 125,
    faq: [{ question: 'Are Ayurvedic herbs safe for kidneys?', answer: 'Yes, when prescribed by verified Vaidyas. Avoid unverified heavy metal formulations sold over-the-counter.' }]
  },
  {
    id: 'trt-11',
    name: 'Detox Therapy',
    slug: 'detox-therapy',
    category: 'Detox Therapy',
    description: 'Systemic cleansing processes to clear body channels of accumulated metabolic toxins (Ama).',
    overview: 'Detox Therapy focuses on mobilizing and eliminating Ama (unprocessed metabolic toxins) using herbal teas, cleansing diets, and light therapeutic purgation.',
    benefits: ['Clears channel blocks', 'Relieves body heaviness', 'Freshens breath and improves skin', 'Restores natural energy levels'],
    procedure: 'A 3-5 day program involving toxin-digesting herbs (Ama Pachana) followed by mild laxatives and organic diet mapping.',
    duration: '3 - 5 Days',
    recoveryTime: '1 Day',
    costEstimate: 3000,
    suitableFor: ['Fatigue', 'Coated Tongue', 'Digestive Sluggishness', 'Bad Breath'],
    contraindications: ['Acute general weakness', 'Extreme emaciation'],
    precautions: ['Stick to warm mung dal soup', 'Do not drink cold water', 'Limit physical exertion'],
    steps: ['Pulse analysis', 'Ama digestion diet', 'Mild laxative administration', 'Rejuvenation diet startup'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
    rating: 4.7,
    reviewCount: 95,
    faq: [{ question: 'What is Ama?', answer: 'Ama is undigested metabolic waste that coats stomach linings and block channels, manifesting as fatigue and sluggishness.' }]
  },
  {
    id: 'trt-12',
    name: 'Yoga Therapy',
    slug: 'yoga-therapy',
    category: 'Yoga Therapy',
    description: 'Asanas and breathing techniques selected to restore physiological balance and lower stress.',
    overview: 'Yoga Therapy uses restorative postures, breathing flows (Pranayama), and meditative visualisations designed to balance nervous energy, lubricate joints, and improve lung capacity.',
    benefits: ['Lowers blood pressure and stress', 'Improves skeletal mobility', 'Enhances lung capacity', 'Stimulates abdominal organs'],
    procedure: 'Custom daily sessions guided by certified yoga experts matching the individual\'s body constitution.',
    duration: '15 - 30 Days',
    recoveryTime: '0 Days',
    costEstimate: 4000,
    suitableFor: ['Chronic Stress', 'Hypertension', 'Back Pain', 'Anxiety'],
    contraindications: ['Recent spinal surgeries', 'Acute disc herniation'],
    precautions: ['Do not force postures', 'Coordinate breath with moves', 'Rest in Shavasana post-practice'],
    steps: ['Body constitution assessment', 'Custom posture selection', 'Pranayama mapping', 'Daily guided practice'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    rating: 4.8,
    reviewCount: 140,
    faq: [{ question: 'Is Yoga Therapy similar to general yoga?', answer: 'No, Yoga Therapy is customized to treat specific medical conditions, adapting postures using props to match physical restrictions.' }]
  },
  {
    id: 'trt-13',
    name: 'Stress Management Program',
    slug: 'stress-management-program',
    category: 'Wellness Programs',
    description: 'Comprehensive wellness program combining Shirodhara, Abhyanga, and mental adaptogens to alleviate anxiety.',
    overview: 'Our Stress Management Program is a multidisciplinary wellness path designed to calm aggravated Vata energy. It integrates Shirodhara oil dripping, full-body massages, adaptogenic herbs, and breathing disciplines to restore mental peace.',
    benefits: ['Lowers cortisol levels', 'Cures insomnia and restores sleep cycles', 'Relieves nervous anxiety', 'Balances blood pressure'],
    procedure: 'Daily sessions of Shirodhara, Abhyanga, and guided relaxation techniques, accompanied by adaptogenic herbal formulations.',
    duration: '7 - 14 Days',
    recoveryTime: '2 Days',
    costEstimate: 12000,
    suitableFor: ['Chronic Stress', 'Anxiety Neurosis', 'Adrenal Fatigue', 'Insomnia'],
    contraindications: ['Acute psychiatric crises'],
    precautions: ['Limit screen time to 1 hour daily', 'Avoid toxic environments', 'Refrain from heavy caffeine intake'],
    steps: ['Initial stress assessment', 'Daily Shirodhara & Abhyanga', 'Nervous tissue nourishing herbs', 'Lifestyle routine integration'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    rating: 4.9,
    reviewCount: 198,
    faq: [{ question: 'How soon can I see results?', answer: 'Most patients experience marked improvements in sleep quality and calm states within the first 3 days of Shirodhara pouring.' }]
  },
  {
    id: 'trt-14',
    name: 'Weight Management Program',
    slug: 'weight-management-program',
    category: 'Wellness Programs',
    description: 'A tailored program featuring dry powder massages (Udvartana) and fat-scraping diets.',
    overview: 'The Weight Management Program focuses on burning deep fat tissues (Meda Dhatu) and clearing metabolic channels using Udvartana massage, thermogenic herbs, and customized low-Kapha nutrition.',
    benefits: ['Accelerates lipid metabolism', 'Trims fat lines and tones skin', 'Stimulates digestive fire (Agni)', 'Maintains healthy energy levels'],
    procedure: 'Dry powder massage cycles, internal detox teas, metabolic accelerating herbs, and a customized diet chart.',
    duration: '14 - 28 Days',
    recoveryTime: '3 Days',
    costEstimate: 14000,
    suitableFor: ['Obesity', 'Slow Metabolism', 'Fatty Liver', 'High Cholesterol'],
    contraindications: ['Pregnancy', 'Severe osteoporosis'],
    precautions: ['Follow diet charts precisely', 'Avoid eating late at night', 'Drink warm water with ginger'],
    steps: ['Body fat mapping', 'Dry herbal scrapings (Udvartana)', 'Liver fire stimulating herbs', 'Daily brisk walking routine'],
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80',
    rating: 4.8,
    reviewCount: 175,
    faq: [{ question: 'Is fasting required?', answer: 'No, Ayurveda discourages starvation. We serve satisfying, light, and digestible foods that stimulate digestion without building fat.' }]
  },
  {
    id: 'trt-15',
    name: 'PCOS Wellness Program',
    slug: 'pcos-wellness-program',
    category: 'Wellness Programs',
    description: 'A specialized hormonal balancing program utilizing channel-cleansing herbs and reproductive tonics.',
    overview: 'Our PCOS Wellness Program targets the root metabolic blockages in the female reproductive channel (Artava Srotas). By combining liver detoxification, hormone-balancing herbs (Shatavari, Ashoka), and customized yogic postures, we restore ovulation cycles and reduce cyst accumulation naturally.',
    benefits: ['Regulates menstrual cycles', 'Reduces cystic acne and facial hair', 'Improves insulin sensitivity', 'Supports natural fertility'],
    procedure: 'Virechana blood cleansing, custom herbal supplements, ovarian tissue nourishment, and hormone-stabilizing yoga.',
    duration: '30 - 90 Days',
    recoveryTime: 'Ongoing',
    costEstimate: 18000,
    suitableFor: ['Irregular Periods', 'Ovarian Cysts', 'Hormonal Acne', 'Insulin Resistance'],
    contraindications: ['None'],
    precautions: ['Requires elimination of processed flours', 'Avoid cold dairy products', 'Maintain early dinner patterns'],
    steps: ['Hormonal profiling', 'Purification therapy (Virechana)', 'Hormonal balancing herbs', 'Surya Namaskar & dietary corrections'],
    image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&q=80',
    rating: 4.9,
    reviewCount: 220,
    faq: [{ question: 'Can cysts be completely resolved?', answer: 'Yes. By clearing channel blockages (Kapha blocks) and enhancing local blood circulation, cysts are naturally absorbed and normal ovulation resumes.' }]
  }
];

export const MOCK_DOCTORS = [
  {
    "id": "doc-dir-1",
    "name": "Dr. Aditya Vardhan Sharma",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 124,
    "city": "Jaipur",
    "clinicName": "Shri Dhanwantari Panchakarma & Wellness Center",
    "consultationFee": 800,
    "onlineConsultationFee": 600,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Aditya Vardhan Sharma is a distinguished Panchakarma expert with over 18 years of clinical practice focusing on chronic metabolic and musculoskeletal disorders. He utilizes a meticulous Nadi Pariksha diagnostic approach to customize intensive detoxification therapies like Virechana and Basti for his patients. His practice integrates classical Shirodhara techniques with evidence-based herbal protocols to ensure holistic restoration of the Tridosha balance."
  },
  {
    "id": "doc-dir-2",
    "name": "Dr. Aniruddh Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Mumbai",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency - Mumbai Branch",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Aniruddh Deshpande is a seasoned clinician specializing in internal medicine with over 18 years of experience in managing chronic lifestyle disorders. He integrates classical Nadi Pariksha with modern diagnostic tools to create comprehensive healing protocols for metabolic and respiratory ailments. His practice focuses on root-cause elimination through personalized Panchakarma therapies such as Basti and Shirodhara alongside authentic herbal formulations."
  },
  {
    "id": "doc-dir-3",
    "name": "Dr. Ashutosh Bhardwaj",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Delhi",
    "clinicName": "Dhanwantari Shalya Chikitsalaya & Marma Center",
    "consultationFee": 1000,
    "onlineConsultationFee": 800,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 94,
    "patientsTreated": 2160,
    "verified": true,
    "about": "A seasoned practitioner specializing in para-surgical procedures like Kshara Sutra therapy for anorectal disorders and Marma Chikitsa for musculoskeletal issues. He integrates ancient Shalya Tantra principles with modern diagnostic methods to provide minimally invasive and holistic surgical care. His practice is renowned in Delhi for successfully treating complex cases of fistula-in-ano and chronic sports injuries using traditional Ayurvedic techniques."
  },
  {
    "id": "doc-dir-4",
    "name": "Dr. Lakshmi S. Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency, Kochi Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Malayalam",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Lakshmi Nair is a distinguished specialist with over 18 years of experience in female reproductive health, focusing on root-cause diagnosis through Prakriti analysis. She is renowned for her expertise in managing infertility and hormonal imbalances using specialized Uttara Basti and tailor-made herbal protocols. Her clinical approach integrates traditional Ayurvedic wisdom with personalized lifestyle modifications to ensure long-term wellness for women."
  },
  {
    "id": "doc-dir-5",
    "name": "Dr. Raghavendra Hegde",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Bangalore",
    "clinicName": "Indus Valley Ayurvedic Centre, Indiranagar",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Kannada"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Raghavendra Hegde specializes in managing Type 2 diabetes and metabolic syndrome through a blend of traditional Nadi Pariksha and evidence-based clinical protocols. His approach integrates customized Panchakarma therapies like Virechana and Takradhara with proprietary herbal formulations to improve insulin sensitivity and metabolic health. He focuses on long-term lifestyle modification and root-cause reversal of metabolic imbalances to ensure sustainable patient wellness."
  },
  {
    "id": "doc-dir-6",
    "name": "Dr. Vinay Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Sanjeevani Ayurvedic Spine & Joint Clinic",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Vinay Deshpande is a dedicated specialist with over 18 years of clinical expertise in treating complex spinal conditions and chronic arthritic disorders. He utilizes a precision-based approach combining Nadi Pariksha (Pulse Diagnosis) with specialized Shodhana and Shamana therapies to restore joint mobility and alleviate pain. His clinical practice is renowned for successful non-surgical interventions using Kati Basti, Greva Basti, and customized herbal decoctions."
  },
  {
    "id": "doc-dir-7",
    "name": "Dr. Arvind Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 134,
    "city": "Dehradun",
    "clinicName": "Shivalik Ayurvedic Skin & Wellness Center",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Nautiyal has over 18 years of clinical experience in treating chronic skin conditions like Psoriasis (Kitibha) and Eczema through traditional Ayurvedic principles. He utilizes Nadi Pariksha to identify underlying Dosha imbalances and focuses on Rakta Shodhana (blood purification) through customized Panchakarma therapies. His treatment plans integrate Shodhana (detox) and Shamana (palliative herbs) along with strict dietary guidelines for long-term skin health."
  },
  {
    "id": "doc-dir-8",
    "name": "Dr. K. Ananthakrishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 18,
    "rating": 4.9,
    "reviewCount": 142,
    "city": "Chennai",
    "clinicName": "Sree Shankara Ayurveda Nilayam",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Tamil",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Ananthakrishnan is a distinguished specialist in Manasa Roga with nearly two decades of clinical experience in treating cognitive decline and anxiety disorders. His diagnostic approach integrates classical Nadi Pariksha with modern psychological assessments to create personalized Medhya Rasayana (nootropic) protocols. He specializes in therapeutic interventions such as Shirodhara, Nasya, and customized herbal formulations to enhance mental clarity and emotional balance."
  },
  {
    "id": "doc-dir-9",
    "name": "Dr. Aditya Pratap Singh",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 142,
    "city": "Jaipur",
    "clinicName": "Dhanwantari Ayurveda & Panchakarma Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Singh is a seasoned practitioner with over 18 years of clinical expertise in classical Panchakarma therapies and metabolic rejuvenation. He employs precise Nadi Pariksha for root-cause diagnosis, specializing in Vamana and Virechana procedures to treat chronic lifestyle disorders. His approach integrates authentic Shirodhara and Basti treatments with personalized herbal protocols for holistic wellness."
  },
  {
    "id": "doc-dir-10",
    "name": "Dr. Sandeep Kulkarni",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 19,
    "rating": 4.9,
    "reviewCount": 156,
    "city": "Mumbai",
    "clinicName": "Shree Dhanwantari Ayurvedic Clinic & Research Centre",
    "consultationFee": 1200,
    "onlineConsultationFee": 900,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2280,
    "verified": true,
    "about": "Dr. Sandeep Kulkarni is a seasoned Kayachikitsa specialist with nearly two decades of experience in managing chronic lifestyle disorders through traditional Shodhana and Shamana therapies. He integrates classical Nadi Pariksha with modern diagnostic insights to provide personalized treatment protocols for metabolic and autoimmune conditions. His expertise lies in Agni management and the administration of specialized Rasayana procedures to restore systemic balance."
  },
  {
    "id": "doc-dir-11",
    "name": "Dr. Vikramaditya Singh",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Delhi",
    "clinicName": "Dhanwantari Shalya & Marma Chikitsa Kendra",
    "consultationFee": 1200,
    "onlineConsultationFee": 900,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 94,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Vikramaditya Singh is a seasoned Shalya Tantra expert with nearly two decades of experience specializing in para-surgical procedures like Kshara Sutra and Agnikarma. He employs a rigorous diagnostic approach, integrating Marma Chikitsa with specialized herbal protocols to manage complex anorectal disorders and chronic pain. His practice is dedicated to providing minimally invasive Ayurvedic surgical solutions that focus on rapid recovery and long-term wellness."
  },
  {
    "id": "doc-dir-12",
    "name": "Dr. Radhika Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 14,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala Agency & Ayurvedic Clinic, Kochi",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Malayalam",
      "Sanskrit",
      "Hindi"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 1680,
    "verified": true,
    "about": "Dr. Radhika Nair is a highly accomplished Ayurvedic gynaecologist with over 14 years of dedicated experience in managing complex female reproductive disorders. She utilizes classical Ashtasthana Pariksha (eight-fold diagnosis) and Nadi Pariksha to identify underlying dosha imbalances before creating personalized treatment regimes. Her clinical expertise lies in administering specialized therapies like Uttar Basti and Yoniprakshalana, alongside traditional herbal formulations, for successfully managing PCOD, uterine fibroids, and female infertility."
  },
  {
    "id": "doc-dir-13",
    "name": "Dr. K. S. Venkatesh Murthy",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 22,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Bangalore",
    "clinicName": "Sri Sri Tattva Panchakarma Center, Bangalore",
    "consultationFee": 850,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Hindi",
      "Kannada",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 2640,
    "verified": true,
    "about": "With over two decades of clinical practice, Dr. Murthy specializes in managing type 2 diabetes and metabolic syndrome through personalized Kayachikitsa protocols. He utilizes Nadi Pariksha for deep diagnostic insights, focusing on correcting the root cause of metabolic imbalances rather than just suppressing symptoms. His treatment plans integrate traditional Shodhana therapies like Virechana with specialized herbal formulations to naturally improve glucose metabolism and prevent diabetic complications."
  },
  {
    "id": "doc-dir-14",
    "name": "Dr. Aniket Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Sanjeevani Ayurvedic Spine & Joint Center",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Deshpande is a renowned specialist with over 18 years of experience in managing chronic musculoskeletal disorders through traditional Ayurvedic protocols. He employs a rigorous Nadi Pariksha diagnostic approach to create personalized treatment plans focused on avoiding surgery for complex spinal conditions. His practice integrates specialized Panchakarma therapies like Kati Basti and Griva Basti with potent herbal formulations to ensure long-term joint health and mobility."
  },
  {
    "id": "doc-dir-15",
    "name": "Dr. Anand Vardhan Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 18,
    "rating": 4.7,
    "reviewCount": 134,
    "city": "Dehradun",
    "clinicName": "Himalayan Vedic Healing Center, Dehradun",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Anand Vardhan Nautiyal is a seasoned clinician with nearly two decades of experience in managing chronic skin disorders and hair loss through classical Ayurvedic principles. His diagnostic process focuses on Nadi Pariksha and Doshic imbalance analysis to treat conditions like Kitibha (Psoriasis) and scalp infections from the root. He is renowned for his mastery in Shodhana therapies, particularly Takradhara and Vamana, paired with bespoke herbal protocols for lasting recovery."
  },
  {
    "id": "doc-dir-16",
    "name": "Dr. Vikram Krishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Chennai",
    "clinicName": "Arya Vaidya Pharmacy (AVP) Clinic, Mylapore",
    "consultationFee": 800,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Tamil",
      "Sanskrit",
      "Hindi"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "about": "Dr. Vikram Krishnan is a highly regarded Ayurvedic physician with over 16 years of expertise in treating anxiety, sleep disorders, and cognitive decline. He utilizes traditional Nadi Pariksha (pulse diagnosis) along with modern clinical assessments to understand each patient's unique mind-body constitution. His customized treatment protocols leverage Medhya Rasayanas (nootropic herbs) combined with Panchakarma therapies like Shirodhara and Nasya to restore mental equilibrium and cognitive vitality."
  },
  {
    "id": "doc-dir-17",
    "name": "Dr. Devendra Prasad Sharma",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Panchakarma)",
    "specialization": "Panchakarma Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Jaipur",
    "clinicName": "Shree Radhey Ayurvedic Panchakarma Kendra",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Rajasthani"
    ],
    "availability": "Mon - Sat (9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "With over 18 years of clinical practice, Dr. Devendra Prasad Sharma is dedicated to restoring systemic balance through customized Panchakarma therapies. He utilizes traditional Nadi Pariksha (pulse diagnosis) to identify root constitutional imbalances and design personalized detoxification regimens. His clinical expertise lies in successfully managing chronic musculoskeletal disorders, stress-induced ailments, and digestive issues using therapies like Basti, Shirodhara, and classical herbal formulations."
  },
  {
    "id": "doc-dir-18",
    "name": "Dr. Sanjay Deshmukh",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Kayachikitsa (General Medicine)",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Mumbai",
    "clinicName": "Dhanvantari Holistic Healing Center",
    "consultationFee": 1200,
    "onlineConsultationFee": 1000,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Marathi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 2160,
    "verified": true,
    "about": "Dr. Sanjay Deshmukh is a seasoned Kayachikitsa specialist with nearly two decades of experience in treating chronic metabolic and digestive disorders through classical Ayurvedic protocols. He combines Nadi Pariksha with evidence-based research to design personalized treatment plans involving Deepana, Pachana, and targeted Panchakarma therapies. His clinical focus remains on reversing lifestyle diseases using pure herbal formulations and rigorous lifestyle modifications."
  },
  {
    "id": "doc-dir-19",
    "name": "Dr. Devendra Kumar Mishra",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Shalya Tantra)",
    "specialization": "Shalya Tantra (Ayurvedic Surgery & Marma)",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Delhi",
    "clinicName": "Dhanvantari Shalya Chikitsalaya & Marma Care",
    "consultationFee": 800,
    "onlineConsultationFee": 650,
    "languages": [
      "English",
      "Hindi",
      "Sanskrit",
      "Punjabi"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 92,
    "patientsTreated": 1920,
    "verified": true,
    "about": "With over 16 years of clinical excellence, Dr. Devendra Mishra specializes in Shalya Tantra with a focus on minimally invasive Ayurvedic surgical techniques and Marma Chikitsa. His diagnostic approach integrates traditional Nadi Pariksha with modern radiological assessments to determine the most effective path of healing. He is widely recognized for his high success rates in managing complex ano-rectal disorders using Kshara Sutra and relieving chronic pain through Agnikarma and Raktamokshana."
  },
  {
    "id": "doc-dir-20",
    "name": "Dr. Meera Nair",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MS (Ayurveda - Prasuti Tantra & Stri Roga)",
    "specialization": "Prasuti Tantra & Stri Roga (Gynaecology)",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Kochi",
    "clinicName": "Kottakkal Arya Vaidya Sala, Ernakulam Kochi",
    "consultationFee": 500,
    "onlineConsultationFee": 400,
    "languages": [
      "English",
      "Malayalam",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (9:30 AM - 1:30 PM, 4:30 PM - 7:30 PM)",
    "successRate": 92,
    "patientsTreated": 1920,
    "verified": true,
    "about": "With over 16 years of dedicated clinical practice, Dr. Meera Nair is a highly respected specialist in Prasuti Tantra & Stri Roga (Ayurvedic Gynaecology and Obstetrics) in Kochi. She employs deep-rooted Ayurvedic diagnostic methods like Nadi Pariksha and Ashtasthana Pariksha to identify root causes of hormonal imbalances and reproductive disorders. Her expertise lies in administering specialized therapies such as Uttara Basti, Yonidhavana, and customized herbal formulations for treating PCOS, infertility, and menopausal issues."
  },
  {
    "id": "doc-dir-21",
    "name": "Dr. Raghavendra Bhat",
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Diabetes & Metabolic Disorders",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 124,
    "city": "Bangalore",
    "clinicName": "Kottakkal Arya Vaidya Sala, Indiranagar Clinic",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "English",
      "Kannada",
      "Hindi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "about": "With over 18 years of clinical expertise, Dr. Raghavendra Bhat specializes in the holistic management of Type-2 Diabetes (Prameha) and metabolic disorders through evidence-based Ayurveda. He employs precise Nadi Pariksha (pulse diagnosis) to understand constitutional imbalances and designs customized root-cause treatment protocols. His therapies integrate specialized Panchakarma detoxifications like Virechana, tailored dietary regimens, and classical herbal formulations to restore metabolic harmony."
  },
  {
    "id": "doc-dir-22",
    "name": "Dr. Ananth Deshpande",
    "photo": "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Arthritis & Spine Specialist",
    "experience": 18,
    "rating": 4.8,
    "reviewCount": 142,
    "city": "Pune",
    "clinicName": "Kerala Ayurveda Vaidyashala, Deccan Gymkhana Branch",
    "consultationFee": 800,
    "onlineConsultationFee": 600,
    "languages": [
      "English",
      "Hindi",
      "Marathi",
      "Sanskrit"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 91,
    "patientsTreated": 2160,
    "verified": true,
    "about": "With over 18 years of clinical expertise, Dr. Ananth Deshpande specializes in managing chronic musculoskeletal and spinal disorders through traditional Ayurvedic protocols. He utilizes precise Nadi Pariksha (pulse diagnosis) to tailor personalized Shodhana (detoxification) and Shamana (palliative) therapies. His integrative approach combines specialized Panchakarma therapies like Janu Basti and Greeva Basti with targeted herbal formulations to restore joint mobility and spinal health."
  },
  {
    "id": "doc-dir-23",
    "name": "Dr. Harish Chandra Nautiyal",
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Kayachikitsa)",
    "specialization": "Skin & Hair Disorders (Kitibha)",
    "experience": 16,
    "rating": 4.7,
    "reviewCount": 112,
    "city": "Dehradun",
    "clinicName": "Devbhoomi Ayurvedic Skin & Panchakarma Kendra",
    "consultationFee": 600,
    "onlineConsultationFee": 500,
    "languages": [
      "Hindi",
      "English",
      "Sanskrit",
      "Garhwali"
    ],
    "availability": "Mon - Sat (10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "about": "With over 16 years of dedicated clinical practice, Dr. Nautiyal specializes in managing chronic skin and hair disorders like Kitibha (Psoriasis) through classical Ayurvedic protocols. His diagnostic approach integrates traditional Nadi Pariksha (Pulse Diagnosis) with modern clinical evaluation to pinpoint deep-seated dosha imbalances. He designs personalized treatment regimens combining intensive Panchakarma therapies like Raktamokshana and Takradhara alongside customized herbo-mineral formulations."
  },
  {
    "id": "doc-dir-24",
    "name": "Dr. Madhavan Krishnan",
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    "qualification": "BAMS, MD (Ayurveda - Manasa Roga)",
    "specialization": "Mental Wellness & Nootropic Therapies",
    "experience": 16,
    "rating": 4.8,
    "reviewCount": 112,
    "city": "Chennai",
    "clinicName": "Arya Vaidya Pharmacy (AVP) Clinic, Mylapore",
    "consultationFee": 800,
    "onlineConsultationFee": 700,
    "languages": [
      "English",
      "Tamil",
      "Sanskrit",
      "Malayalam"
    ],
    "availability": "Mon - Sat (10:00 AM - 1:30 PM, 5:00 PM - 8:30 PM)",
    "successRate": 91,
    "patientsTreated": 1920,
    "verified": true,
    "about": "With over 16 years of clinical excellence, Dr. Madhavan specializes in treating stress, anxiety, and cognitive decline using authentic Ayurvedic methodologies. His diagnostic approach deeply integrates Nadi Pariksha (pulse diagnosis) with modern psychological assessments to understand each patient's unique mind-body constitution. He designs highly personalized recovery pathways featuring Shirodhara, Nasya, and proprietary Medhya Rasayana formulations to restore emotional and neurological balance."
  }
];;

export const MOCK_CLINICS = [
  {
    id: 'cl-1',
    name: 'Kerala Ayurveda Zen Sanctuary',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    type: 'Panchakarma Center' as const,
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
    type: 'Wellness Center' as const,
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
    type: 'Ayurveda Clinic' as const,
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
    type: 'Ayurveda Hospital' as const,
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
    type: 'Ayurveda Clinic' as const,
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
    type: 'Panchakarma Center' as const,
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
    type: 'Holistic Healing Center' as const,
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
    type: 'Ayurveda Hospital' as const,
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
    type: 'Wellness Center' as const,
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
    type: 'Holistic Healing Center' as const,
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

export const MOCK_TESTIMONIALS = [
  { id: 't-1', patientName: 'Rohit Malhotra', disease: 'Type 2 Diabetes', treatment: 'Panchakarma & Diet shifts', recoveryTime: '3 Months', text: 'Dr. Vikram Singh\'s guidelines completely regulated my HbA1c levels. The customized diet coupled with metabolic herbs restored my stamina!', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { id: 't-2', patientName: 'Priya Varghese', disease: 'Sciatic Spine Pain', treatment: 'Kativasti & Herbal Oils', recoveryTime: '4 Weeks', text: 'Authentic warm oil pooling therapies at the Kerala Zen center relieved my intense back and leg stiffness. I am pain-free and walking comfortably.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 't-3', patientName: 'Smriti Mishra', disease: 'Severe PCOS & Bloating', treatment: 'Hormonal Herbal Teas', recoveryTime: '6 Months', text: 'I struggled with cystic acne and irregular periods. Rejuvenation herbs normalized my cycle naturally and cleared my skin thoroughly.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' }
];

export interface ApiResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

// Custom Axios instance with a short timeout to prevent long loading screens
const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1500 // 1.5 seconds timeout
});

export const apiService = {
  getStats: async (): Promise<ApiResponse<typeof MOCK_STATS>> => {
    try {
      const response = await client.get('/stats');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_STATS, isFallback: true, error: err.message };
    }
  },

  getDiseases: async (): Promise<ApiResponse<typeof MOCK_DISEASES>> => {
    try {
      const response = await client.get('/diseases');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_DISEASES, isFallback: true, error: err.message };
    }
  },

  getTreatments: async (): Promise<ApiResponse<typeof MOCK_TREATMENTS>> => {
    try {
      const response = await client.get('/treatments');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_TREATMENTS, isFallback: true, error: err.message };
    }
  },

  getDoctors: async (): Promise<ApiResponse<typeof MOCK_DOCTORS>> => {
    try {
      const response = await client.get('/doctors');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_DOCTORS, isFallback: true, error: err.message };
    }
  },

  getClinics: async (): Promise<ApiResponse<typeof MOCK_CLINICS>> => {
    try {
      const response = await client.get('/clinics');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_CLINICS, isFallback: true, error: err.message };
    }
  },

  getTestimonials: async (): Promise<ApiResponse<typeof MOCK_TESTIMONIALS>> => {
    try {
      const response = await client.get('/testimonials');
      return { data: response.data, isFallback: false };
    } catch (err: any) {
      return { data: MOCK_TESTIMONIALS, isFallback: true, error: err.message };
    }
  }
};



