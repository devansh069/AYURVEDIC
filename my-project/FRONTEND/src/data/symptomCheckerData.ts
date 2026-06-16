// ─── AI Symptom Checker Mock Data ───────────────────────────────────────────

export interface Symptom {
  id: string;
  name: string;
  category: string;
  icon: string;
  severity: 'mild' | 'moderate' | 'severe';
  relatedDoshas: ('Vata' | 'Pitta' | 'Kapha')[];
  description: string;
}

export interface DoshaProfile {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  percentage: number;
  color: string;
  gradient: string;
  description: string;
  primaryTraits: string[];
  imbalanceSymptoms: string[];
  recommendations: string[];
  herbs: string[];
  diet: string[];
  lifestyle: string[];
}

export interface AyurvedicRemedyCard {
  id: string;
  name: string;
  type: 'herb' | 'diet' | 'therapy' | 'lifestyle' | 'yoga';
  forDoshas: ('Vata' | 'Pitta' | 'Kapha')[];
  description: string;
  benefits: string[];
  dosage?: string;
  timing?: string;
  icon: string;
  urgency: 'preventive' | 'supportive' | 'therapeutic';
  rating: number;
}

export interface HealthInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  trend: 'improving' | 'stable' | 'declining';
  score: number;
  color: string;
}

export interface AssessmentQuestion {
  id: string;
  step: number;
  question: string;
  subtitle: string;
  type: 'single' | 'multi' | 'scale' | 'text';
  options?: { value: string; label: string; icon: string; description?: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface AnalysisResult {
  id: string;
  condition: string;
  ayurvedicName: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  doshaImbalance: ('Vata' | 'Pitta' | 'Kapha')[];
  description: string;
  symptoms: string[];
  remedies: AyurvedicRemedyCard[];
  dietPlan: string[];
  lifestyleChanges: string[];
  whenToSeeDoctor: string;
  recoveryTime: string;
}

export interface HealthMetric {
  date: string;
  energy: number;
  digestion: number;
  sleep: number;
  stress: number;
  immunity: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ─── Symptom Categories ──────────────────────────────────────────────────────

export const SYMPTOM_CATEGORIES = [
  'Digestive', 'Respiratory', 'Skin', 'Mental/Emotional',
  'Musculoskeletal', 'Sleep', 'Energy', 'Reproductive', 'Neurological', 'Cardiovascular'
];

// ─── Mock Symptoms ────────────────────────────────────────────────────────────

export const MOCK_SYMPTOMS: Symptom[] = [
  // Digestive
  { id: 's1', name: 'Bloating', category: 'Digestive', icon: '🫁', severity: 'mild', relatedDoshas: ['Vata', 'Kapha'], description: 'Feeling of fullness and distension in abdomen' },
  { id: 's2', name: 'Acid Reflux', category: 'Digestive', icon: '🔥', severity: 'moderate', relatedDoshas: ['Pitta'], description: 'Burning sensation in chest and throat' },
  { id: 's3', name: 'Constipation', category: 'Digestive', icon: '⚠️', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Difficulty in bowel movements' },
  { id: 's4', name: 'Diarrhea', category: 'Digestive', icon: '💧', severity: 'moderate', relatedDoshas: ['Pitta', 'Vata'], description: 'Loose watery stools more than 3 times daily' },
  { id: 's5', name: 'Nausea', category: 'Digestive', icon: '🤢', severity: 'moderate', relatedDoshas: ['Kapha', 'Pitta'], description: 'Urge to vomit or stomach discomfort' },
  { id: 's6', name: 'Loss of Appetite', category: 'Digestive', icon: '🍽️', severity: 'mild', relatedDoshas: ['Kapha'], description: 'Reduced desire to eat meals' },
  // Respiratory
  { id: 's7', name: 'Cough', category: 'Respiratory', icon: '😷', severity: 'mild', relatedDoshas: ['Kapha', 'Vata'], description: 'Persistent or recurring cough' },
  { id: 's8', name: 'Cold & Congestion', category: 'Respiratory', icon: '🤧', severity: 'mild', relatedDoshas: ['Kapha'], description: 'Nasal congestion and runny nose' },
  { id: 's9', name: 'Shortness of Breath', category: 'Respiratory', icon: '💨', severity: 'severe', relatedDoshas: ['Vata', 'Kapha'], description: 'Difficulty breathing or breathlessness' },
  { id: 's10', name: 'Sore Throat', category: 'Respiratory', icon: '🦷', severity: 'mild', relatedDoshas: ['Pitta', 'Kapha'], description: 'Pain and irritation in throat' },
  // Skin
  { id: 's11', name: 'Skin Rash', category: 'Skin', icon: '🔴', severity: 'moderate', relatedDoshas: ['Pitta'], description: 'Redness, itching or eruptions on skin' },
  { id: 's12', name: 'Dry Skin', category: 'Skin', icon: '🌵', severity: 'mild', relatedDoshas: ['Vata'], description: 'Rough, flaky or dehydrated skin' },
  { id: 's13', name: 'Oily Skin/Acne', category: 'Skin', icon: '✨', severity: 'moderate', relatedDoshas: ['Pitta', 'Kapha'], description: 'Excess sebum and acne breakouts' },
  { id: 's14', name: 'Eczema/Psoriasis', category: 'Skin', icon: '🔶', severity: 'severe', relatedDoshas: ['Pitta', 'Vata'], description: 'Chronic inflammatory skin conditions' },
  // Mental/Emotional
  { id: 's15', name: 'Anxiety', category: 'Mental/Emotional', icon: '😰', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Excessive worry or fear' },
  { id: 's16', name: 'Depression', category: 'Mental/Emotional', icon: '😔', severity: 'severe', relatedDoshas: ['Kapha', 'Vata'], description: 'Persistent sadness and loss of interest' },
  { id: 's17', name: 'Brain Fog', category: 'Mental/Emotional', icon: '🌫️', severity: 'moderate', relatedDoshas: ['Kapha', 'Vata'], description: 'Difficulty concentrating or thinking clearly' },
  { id: 's18', name: 'Irritability', category: 'Mental/Emotional', icon: '😤', severity: 'mild', relatedDoshas: ['Pitta'], description: 'Easily agitated or angry mood' },
  // Musculoskeletal
  { id: 's19', name: 'Joint Pain', category: 'Musculoskeletal', icon: '🦴', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Pain or stiffness in joints' },
  { id: 's20', name: 'Back Pain', category: 'Musculoskeletal', icon: '🔙', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Pain in lower, mid or upper back' },
  { id: 's21', name: 'Muscle Cramps', category: 'Musculoskeletal', icon: '💪', severity: 'mild', relatedDoshas: ['Vata'], description: 'Involuntary painful muscle contractions' },
  { id: 's22', name: 'Weakness/Fatigue', category: 'Musculoskeletal', icon: '😴', severity: 'moderate', relatedDoshas: ['Kapha', 'Vata'], description: 'General physical weakness or tiredness' },
  // Sleep
  { id: 's23', name: 'Insomnia', category: 'Sleep', icon: '🌙', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Difficulty falling or staying asleep' },
  { id: 's24', name: 'Excessive Sleep', category: 'Sleep', icon: '😪', severity: 'mild', relatedDoshas: ['Kapha'], description: 'Sleeping too much or feeling drowsy always' },
  { id: 's25', name: 'Restless Sleep', category: 'Sleep', icon: '🛌', severity: 'mild', relatedDoshas: ['Vata', 'Pitta'], description: 'Disturbed sleep with frequent waking' },
  // Energy
  { id: 's26', name: 'Low Energy', category: 'Energy', icon: '⚡', severity: 'moderate', relatedDoshas: ['Kapha', 'Vata'], description: 'Persistent lack of vitality or motivation' },
  { id: 's27', name: 'Burnout', category: 'Energy', icon: '🔋', severity: 'severe', relatedDoshas: ['Pitta', 'Vata'], description: 'Complete physical and mental exhaustion' },
  { id: 's28', name: 'Hyperactivity', category: 'Energy', icon: '⚡', severity: 'mild', relatedDoshas: ['Vata', 'Pitta'], description: 'Excessive energy, restlessness, inability to relax' },
  // Reproductive
  { id: 's29', name: 'Irregular Periods', category: 'Reproductive', icon: '🌺', severity: 'moderate', relatedDoshas: ['Vata'], description: 'Irregular menstrual cycles' },
  { id: 's30', name: 'Hormonal Imbalance', category: 'Reproductive', icon: '⚖️', severity: 'moderate', relatedDoshas: ['Pitta', 'Kapha'], description: 'Signs of hormone disruption' },
  // Neurological
  { id: 's31', name: 'Headache', category: 'Neurological', icon: '🤕', severity: 'moderate', relatedDoshas: ['Pitta', 'Vata'], description: 'Pain in the head or skull' },
  { id: 's32', name: 'Migraine', category: 'Neurological', icon: '💥', severity: 'severe', relatedDoshas: ['Pitta'], description: 'Severe throbbing headache, often one-sided' },
  // Cardiovascular
  { id: 's33', name: 'Palpitations', category: 'Cardiovascular', icon: '❤️', severity: 'moderate', relatedDoshas: ['Vata', 'Pitta'], description: 'Irregular or rapid heartbeat' },
  { id: 's34', name: 'High BP Symptoms', category: 'Cardiovascular', icon: '📈', severity: 'severe', relatedDoshas: ['Pitta'], description: 'Dizziness, flushing, headache from high BP' },
  { id: 's35', name: 'Cold Hands/Feet', category: 'Cardiovascular', icon: '🧊', severity: 'mild', relatedDoshas: ['Vata'], description: 'Chronically cold extremities' },
  { id: 's36', name: 'Fever', category: 'Neurological', icon: '🌡️', severity: 'moderate', relatedDoshas: ['Pitta'], description: 'Elevated body temperature above normal' },
];

// ─── Assessment Questions ─────────────────────────────────────────────────────

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1', step: 1,
    question: 'What is your primary concern today?',
    subtitle: 'Select the area that best describes your main health issue',
    type: 'single',
    options: [
      { value: 'digestive', label: 'Digestive Issues', icon: '🫁', description: 'Bloating, acidity, constipation' },
      { value: 'respiratory', label: 'Respiratory', icon: '💨', description: 'Cough, cold, breathing issues' },
      { value: 'mental', label: 'Mental Wellness', icon: '🧠', description: 'Stress, anxiety, brain fog' },
      { value: 'pain', label: 'Pain & Inflammation', icon: '🦴', description: 'Joint pain, headache, muscle ache' },
      { value: 'skin', label: 'Skin Issues', icon: '✨', description: 'Rash, acne, dryness' },
      { value: 'energy', label: 'Energy & Vitality', icon: '⚡', description: 'Fatigue, burnout, low motivation' },
      { value: 'sleep', label: 'Sleep Problems', icon: '🌙', description: 'Insomnia, restless sleep' },
      { value: 'general', label: 'General Wellness', icon: '🌿', description: 'Overall health optimization' },
    ]
  },
  {
    id: 'q2', step: 2,
    question: 'How long have you been experiencing these symptoms?',
    subtitle: 'Duration helps determine whether this is acute or chronic',
    type: 'single',
    options: [
      { value: 'today', label: 'Started Today', icon: '📅', description: 'Less than 24 hours' },
      { value: 'week', label: '1–7 Days', icon: '📆', description: 'This past week' },
      { value: 'month', label: '1–4 Weeks', icon: '🗓️', description: 'This past month' },
      { value: 'months', label: '1–6 Months', icon: '📊', description: 'Several months' },
      { value: 'chronic', label: 'More than 6 Months', icon: '🔄', description: 'Chronic condition' },
    ]
  },
  {
    id: 'q3', step: 3,
    question: 'How would you rate your current energy level?',
    subtitle: 'Slide to indicate your overall vitality today',
    type: 'scale',
    min: 1,
    max: 10,
  },
  {
    id: 'q4', step: 4,
    question: 'What is your body constitution (Prakriti)?',
    subtitle: 'Your dominant Dosha type according to Ayurveda',
    type: 'single',
    options: [
      { value: 'vata', label: 'Vata', icon: '💨', description: 'Thin build, creative, easily anxious' },
      { value: 'pitta', label: 'Pitta', icon: '🔥', description: 'Medium build, focused, prone to anger' },
      { value: 'kapha', label: 'Kapha', icon: '🌊', description: 'Heavy build, calm, slow metabolism' },
      { value: 'vata-pitta', label: 'Vata-Pitta', icon: '⚡', description: 'Mix of air & fire energies' },
      { value: 'pitta-kapha', label: 'Pitta-Kapha', icon: '🌿', description: 'Mix of fire & earth energies' },
      { value: 'vata-kapha', label: 'Vata-Kapha', icon: '🌬️', description: 'Mix of air & water energies' },
      { value: 'tridosha', label: 'Tridoshic', icon: '☯️', description: 'Balanced all three Doshas' },
      { value: 'unknown', label: 'Not Sure', icon: '❓', description: 'Help me determine my Dosha' },
    ]
  },
  {
    id: 'q5', step: 5,
    question: 'Which lifestyle factors apply to you?',
    subtitle: 'Select all that regularly affect your daily life',
    type: 'multi',
    options: [
      { value: 'sedentary', label: 'Sedentary Job', icon: '💻' },
      { value: 'irregular-meals', label: 'Irregular Meal Times', icon: '🍽️' },
      { value: 'late-nights', label: 'Late Night Sleeping', icon: '🌙' },
      { value: 'high-stress', label: 'High Stress Work', icon: '😰' },
      { value: 'processed-food', label: 'Processed Food Diet', icon: '🍔' },
      { value: 'alcohol', label: 'Alcohol/Smoking', icon: '🚭' },
      { value: 'exercise', label: 'Regular Exercise', icon: '🏋️' },
      { value: 'meditation', label: 'Meditation Practice', icon: '🧘' },
      { value: 'outdoor', label: 'Outdoor Activities', icon: '🌳' },
    ]
  },
  {
    id: 'q6', step: 6,
    question: 'How is your sleep quality on average?',
    subtitle: 'Select the option that best describes your sleep',
    type: 'single',
    options: [
      { value: 'excellent', label: 'Excellent (7–9 hrs, refreshing)', icon: '😌', description: 'Wake up energized daily' },
      { value: 'good', label: 'Good (6–7 hrs, mostly restful)', icon: '😊', description: 'Generally fine with minor issues' },
      { value: 'fair', label: 'Fair (5–6 hrs, sometimes disturbed)', icon: '😐', description: 'Occasional issues' },
      { value: 'poor', label: 'Poor (< 5 hrs, disturbed)', icon: '😔', description: 'Frequent sleep issues' },
      { value: 'insomnia', label: 'Chronic Insomnia', icon: '😩', description: 'Severely impacted quality of life' },
    ]
  },
  {
    id: 'q7', step: 7,
    question: 'Describe your diet pattern',
    subtitle: 'What best describes your regular eating habits?',
    type: 'single',
    options: [
      { value: 'sattvic', label: 'Sattvic (Pure vegetarian)', icon: '🥗', description: 'Fresh, balanced, whole foods' },
      { value: 'vegetarian', label: 'Vegetarian', icon: '🥦', description: 'Plant-based with dairy' },
      { value: 'non-veg', label: 'Non-vegetarian', icon: '🍗', description: 'Includes meat, fish, eggs' },
      { value: 'mixed', label: 'Mixed Diet', icon: '🥘', description: 'Variety of all food types' },
      { value: 'vegan', label: 'Vegan', icon: '🌱', description: 'Strictly plant-based' },
    ]
  },
  {
    id: 'q8', step: 8,
    question: 'Any additional symptoms or concerns?',
    subtitle: 'Describe anything else you\'d like our AI to consider',
    type: 'text',
    placeholder: 'e.g., I also feel very cold in winters, my digestion gets worse after stress...',
  },
];

// ─── Dosha Profiles ─────────────────────────────────────────────────────────

export const DOSHA_PROFILES: DoshaProfile[] = [
  {
    dosha: 'Vata',
    percentage: 45,
    color: '#7C3AED',
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Vata governs movement, creativity and nervous system. Imbalanced Vata causes anxiety, dryness and digestive irregularity.',
    primaryTraits: ['Creative', 'Quick-minded', 'Adaptable', 'Enthusiastic', 'Sensitive'],
    imbalanceSymptoms: ['Anxiety', 'Dry skin', 'Constipation', 'Joint pain', 'Insomnia', 'Bloating'],
    recommendations: ['Warm sesame oil massage (Abhyanga)', 'Ashwagandha milk before bed', 'Triphala for digestion', 'Regular meal times', 'Warm cooked foods'],
    herbs: ['Ashwagandha', 'Brahmi', 'Triphala', 'Shatavari', 'Ginger'],
    diet: ['Warm soups', 'Ghee', 'Root vegetables', 'Sweet fruits', 'Nuts & seeds'],
    lifestyle: ['Regular sleep schedule', 'Gentle yoga', 'Warm oil massage', 'Avoid cold foods', 'Meditation'],
  },
  {
    dosha: 'Pitta',
    percentage: 30,
    color: '#DC2626',
    gradient: 'from-red-500 to-orange-500',
    description: 'Pitta governs transformation, metabolism and intellect. Imbalanced Pitta causes inflammation, anger and skin issues.',
    primaryTraits: ['Focused', 'Ambitious', 'Intelligent', 'Organized', 'Passionate'],
    imbalanceSymptoms: ['Acid reflux', 'Skin rashes', 'Anger', 'Inflammation', 'Fever', 'Migraines'],
    recommendations: ['Coconut oil application', 'Shatavari churna', 'Amalaki (Amla)', 'Cooling foods', 'Avoid spicy food'],
    herbs: ['Amalaki', 'Shatavari', 'Brahmi', 'Neem', 'Coriander'],
    diet: ['Coconut water', 'Sweet fruits', 'Leafy greens', 'Cucumber', 'Dairy (cooling)'],
    lifestyle: ['Moonlight walks', 'Swimming/cooling exercise', 'Avoid midday sun', 'Cooling pranayama', 'Art/creativity'],
  },
  {
    dosha: 'Kapha',
    percentage: 25,
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Kapha governs structure, lubrication and immunity. Imbalanced Kapha causes weight gain, lethargy and respiratory issues.',
    primaryTraits: ['Stable', 'Compassionate', 'Patient', 'Loyal', 'Strong'],
    imbalanceSymptoms: ['Weight gain', 'Congestion', 'Lethargy', 'Depression', 'Excessive sleep', 'Oily skin'],
    recommendations: ['Dry brushing (Garshana)', 'Trikatu (3 peppers)', 'Honey with warm water', 'Morning exercise', 'Fasting periodically'],
    herbs: ['Trikatu', 'Guggul', 'Triphala', 'Tulsi', 'Punarnava'],
    diet: ['Light spicy foods', 'Bitter vegetables', 'Legumes', 'Honey', 'Warm ginger tea'],
    lifestyle: ['Morning exercise', 'Dry brushing', 'Avoid daytime naps', 'Stimulating activities', 'Social interaction'],
  },
];

// ─── Ayurvedic Remedies ────────────────────────────────────────────────────

export const AYURVEDIC_REMEDIES: AyurvedicRemedyCard[] = [
  {
    id: 'r1', name: 'Ashwagandha', type: 'herb', forDoshas: ['Vata'],
    description: 'The powerful adaptogen for stress, anxiety and vitality restoration',
    benefits: ['Reduces cortisol', 'Improves sleep quality', 'Boosts immunity', 'Enhances energy'],
    dosage: '300–600mg extract daily', timing: 'Evening with warm milk',
    icon: '🌿', urgency: 'therapeutic', rating: 4.9
  },
  {
    id: 'r2', name: 'Triphala', type: 'herb', forDoshas: ['Vata', 'Pitta', 'Kapha'],
    description: 'The tridoshic powerhouse blend for digestive health and detoxification',
    benefits: ['Cleanses digestive tract', 'Rich in antioxidants', 'Regulates bowels', 'Rejuvenates tissues'],
    dosage: '1 tsp powder', timing: 'Bedtime with warm water',
    icon: '🍯', urgency: 'therapeutic', rating: 4.8
  },
  {
    id: 'r3', name: 'Tulsi Tea', type: 'herb', forDoshas: ['Kapha', 'Vata'],
    description: 'Holy Basil - the Queen of Herbs for respiratory health and immunity',
    benefits: ['Fights respiratory infections', 'Anti-inflammatory', 'Reduces stress', 'Boosts immunity'],
    dosage: '2–3 fresh leaves or 1 tsp dried', timing: 'Morning on empty stomach',
    icon: '🍵', urgency: 'supportive', rating: 4.7
  },
  {
    id: 'r4', name: 'Abhyanga (Oil Massage)', type: 'therapy', forDoshas: ['Vata'],
    description: 'Traditional Ayurvedic warm oil self-massage for grounding and nourishment',
    benefits: ['Calms nervous system', 'Improves circulation', 'Nourishes skin', 'Promotes deep sleep'],
    timing: 'Morning before bath, 15–20 minutes',
    icon: '💆', urgency: 'therapeutic', rating: 4.9
  },
  {
    id: 'r5', name: 'Brahmi', type: 'herb', forDoshas: ['Vata', 'Pitta'],
    description: 'Medhya Rasayana - the supreme brain tonic for memory and mental clarity',
    benefits: ['Enhances memory', 'Reduces anxiety', 'Supports focus', 'Calms mind'],
    dosage: '300mg extract', timing: 'Morning with ghee',
    icon: '🧠', urgency: 'therapeutic', rating: 4.8
  },
  {
    id: 'r6', name: 'Sattvic Diet', type: 'diet', forDoshas: ['Vata', 'Pitta', 'Kapha'],
    description: 'Pure, life-force rich foods that promote clarity, peace and vitality',
    benefits: ['Balances all doshas', 'Calms mind', 'Improves digestion', 'Boosts prana'],
    timing: 'Daily meal practice',
    icon: '🥗', urgency: 'preventive', rating: 4.7
  },
  {
    id: 'r7', name: 'Pranayama', type: 'yoga', forDoshas: ['Vata', 'Pitta', 'Kapha'],
    description: 'Controlled breathing practices to balance prana and calm the mind',
    benefits: ['Oxygenates blood', 'Calms nervous system', 'Increases lung capacity', 'Reduces anxiety'],
    dosage: 'Nadi Shodhana, Bhramari, Kapalbhati', timing: '20 minutes morning',
    icon: '🧘', urgency: 'therapeutic', rating: 4.9
  },
  {
    id: 'r8', name: 'Ginger-Honey Tea', type: 'diet', forDoshas: ['Kapha', 'Vata'],
    description: 'Time-honored digestive remedy that kindles Agni (digestive fire)',
    benefits: ['Improves digestion', 'Reduces nausea', 'Anti-inflammatory', 'Boosts metabolism'],
    dosage: '1 inch ginger + 1 tsp honey', timing: 'Before meals',
    icon: '🫖', urgency: 'supportive', rating: 4.6
  },
  {
    id: 'r9', name: 'Amalaki (Amla)', type: 'herb', forDoshas: ['Pitta'],
    description: 'The divine fruit - richest natural source of Vitamin C and Pitta pacifier',
    benefits: ['Extreme antioxidant action', 'Cools Pitta fire', 'Rejuvenates tissues', 'Eye health'],
    dosage: '1 fresh fruit or 1 tsp powder', timing: 'Morning empty stomach',
    icon: '🍈', urgency: 'preventive', rating: 4.8
  },
  {
    id: 'r10', name: 'Yoga Nidra', type: 'lifestyle', forDoshas: ['Vata', 'Pitta'],
    description: 'Yogic sleep - a profound relaxation practice for deep rest and healing',
    benefits: ['Equivalent to 4 hrs sleep', 'Reduces stress hormones', 'Heals nervous system', 'Improves sleep quality'],
    timing: '30–45 minutes, mid-afternoon',
    icon: '🌙', urgency: 'therapeutic', rating: 4.9
  },
  {
    id: 'r11', name: 'Trikatu', type: 'herb', forDoshas: ['Kapha'],
    description: 'Three spices blend (ginger, black pepper, pippali) to ignite Kapha metabolism',
    benefits: ['Speeds metabolism', 'Burns fat', 'Reduces congestion', 'Improves digestion'],
    dosage: '250mg before meals', timing: 'Before meals with honey',
    icon: '🌶️', urgency: 'therapeutic', rating: 4.6
  },
  {
    id: 'r12', name: 'Dinacharya Routine', type: 'lifestyle', forDoshas: ['Vata', 'Pitta', 'Kapha'],
    description: 'Daily Ayurvedic routine - the single most powerful tool for long-term health',
    benefits: ['Synchronizes body rhythms', 'Prevents disease', 'Builds Ojas (vitality)', 'Establishes balance'],
    timing: 'Follow consistently daily',
    icon: '📅', urgency: 'preventive', rating: 4.9
  },
];

// ─── Analysis Results ─────────────────────────────────────────────────────────

export const MOCK_ANALYSIS_RESULTS: AnalysisResult[] = [
  {
    id: 'ar1',
    condition: 'Vata Imbalance (Vata Vikruti)',
    ayurvedicName: 'Vata Vikruti',
    probability: 87,
    severity: 'medium',
    doshaImbalance: ['Vata'],
    description: 'Your symptoms indicate a significant Vata Dosha imbalance. Vata is composed of Air and Space elements. When aggravated, it causes dryness, irregular patterns, anxiety and nervous system issues.',
    symptoms: ['Anxiety', 'Dry skin', 'Constipation', 'Joint pain', 'Insomnia', 'Bloating', 'Worry'],
    remedies: AYURVEDIC_REMEDIES.filter(r => r.forDoshas.includes('Vata')),
    dietPlan: [
      'Eat warm, oily, sweet, sour and salty foods',
      'Include: ghee, sesame oil, warm soups, root vegetables',
      'Avoid: raw foods, cold drinks, dry snacks, caffeine',
      'Sip warm water throughout the day',
      'Main meal at lunch (12–1 PM)',
      'Light warm dinner before 7 PM',
    ],
    lifestyleChanges: [
      'Establish consistent daily routine (Dinacharya)',
      'Daily warm sesame oil massage before bath',
      'Gentle yoga: forward folds, grounding poses',
      'Avoid excessive travel and multitasking',
      'Adequate sleep (10 PM–6 AM)',
      'Regular digital detox periods',
    ],
    whenToSeeDoctor: 'If symptoms persist beyond 2 weeks or if anxiety becomes panic attacks',
    recoveryTime: '4–8 weeks with consistent protocol',
  },
  {
    id: 'ar2',
    condition: 'Pitta Excess (Pitta Vikruti)',
    ayurvedicName: 'Pitta Vikruti',
    probability: 78,
    severity: 'medium',
    doshaImbalance: ['Pitta'],
    description: 'Your symptoms point to aggravated Pitta Dosha. Pitta is formed of Fire and Water. When excess, it manifests as inflammation, acidity, irritability, skin eruptions and perfectionist tendencies.',
    symptoms: ['Acid reflux', 'Skin rashes', 'Irritability', 'Inflammation', 'Excessive body heat', 'Migraines'],
    remedies: AYURVEDIC_REMEDIES.filter(r => r.forDoshas.includes('Pitta')),
    dietPlan: [
      'Favor cooling, sweet, bitter and astringent foods',
      'Include: coconut water, cucumber, leafy greens, sweet fruits',
      'Avoid: spicy, salty, fermented, fried foods and alcohol',
      'Eat at regular meal times, never skip meals',
      'Room temperature or cool (not cold) water',
      'Avoid eating when angry or stressed',
    ],
    lifestyleChanges: [
      'Avoid overwork and perfectionism',
      'Practice cooling pranayama (Sheetali, Sheetkari)',
      'Moonlight walks in evenings',
      'Swimming or water-based exercise',
      'Creative arts to release Pitta energy',
      'Avoid excessive sun exposure',
    ],
    whenToSeeDoctor: 'If inflammation, fever or skin conditions worsen',
    recoveryTime: '3–6 weeks with dietary changes and cooling therapies',
  },
  {
    id: 'ar3',
    condition: 'Kapha Accumulation (Kapha Vikruti)',
    ayurvedicName: 'Kapha Vikruti',
    probability: 72,
    severity: 'low',
    doshaImbalance: ['Kapha'],
    description: 'Signs suggest Kapha Dosha accumulation. Kapha is Earth and Water elements. When excessive, it leads to weight gain, sluggishness, congestion, depression and resistance to change.',
    symptoms: ['Weight gain', 'Congestion', 'Lethargy', 'Excessive sleep', 'Depression', 'Slow digestion'],
    remedies: AYURVEDIC_REMEDIES.filter(r => r.forDoshas.includes('Kapha')),
    dietPlan: [
      'Favor light, dry, warm, spicy foods',
      'Include: ginger tea, bitter greens, legumes, honey',
      'Avoid: dairy, sweets, fried foods, cold drinks, heavy meals',
      'Practice intermittent fasting (skip breakfast)',
      'Eat your largest meal at lunch',
      'Drink warm water with lemon morning',
    ],
    lifestyleChanges: [
      'Vigorous morning exercise (cardio, weight training)',
      'Dry body brushing (Garshana) before shower',
      'Avoid daytime napping',
      'Stimulating social activities and travel',
      'Cold showers to invigorate circulation',
      'Declutter home and workspace',
    ],
    whenToSeeDoctor: 'If unexplained weight gain exceeds 5kg or if depression is severe',
    recoveryTime: '6–12 weeks with vigorous lifestyle changes',
  },
];

// ─── Health Insights ─────────────────────────────────────────────────────────

export const MOCK_HEALTH_INSIGHTS: HealthInsight[] = [
  { id: 'hi1', category: 'Immunity', title: 'Ojas Vitality Score', description: 'Your life-force energy based on lifestyle & diet patterns', icon: '🛡️', trend: 'improving', score: 72, color: '#2E7D32' },
  { id: 'hi2', category: 'Digestion', title: 'Agni (Digestive Fire)', description: 'Strength of your metabolic digestive capacity', icon: '🔥', trend: 'stable', score: 65, color: '#D4AF37' },
  { id: 'hi3', category: 'Mind', title: 'Sattva Clarity Score', description: 'Mental clarity, focus and emotional balance', icon: '🧠', trend: 'improving', score: 78, color: '#2196F3' },
  { id: 'hi4', category: 'Sleep', title: 'Nidra Quality Index', description: 'Sleep quality and restorative rest assessment', icon: '🌙', trend: 'declining', score: 55, color: '#7C3AED' },
  { id: 'hi5', category: 'Stress', title: 'Stress Resilience', description: 'Ability to handle physical and mental stressors', icon: '⚡', trend: 'stable', score: 60, color: '#DC2626' },
  { id: 'hi6', category: 'Toxins', title: 'Ama Toxin Level', description: 'Accumulated metabolic waste and toxin burden (lower is better)', icon: '🧹', trend: 'improving', score: 35, color: '#059669' },
];

// ─── Health Metrics Chart Data ────────────────────────────────────────────────

export const HEALTH_METRICS_DATA: HealthMetric[] = [
  { date: 'Week 1', energy: 45, digestion: 50, sleep: 55, stress: 70, immunity: 48 },
  { date: 'Week 2', energy: 52, digestion: 58, sleep: 60, stress: 65, immunity: 54 },
  { date: 'Week 3', energy: 60, digestion: 63, sleep: 65, stress: 58, immunity: 61 },
  { date: 'Week 4', energy: 65, digestion: 70, sleep: 68, stress: 50, immunity: 67 },
  { date: 'Week 5', energy: 72, digestion: 75, sleep: 72, stress: 45, immunity: 73 },
  { date: 'Week 6', energy: 78, digestion: 78, sleep: 76, stress: 40, immunity: 79 },
  { date: 'Week 7', energy: 82, digestion: 82, sleep: 80, stress: 35, immunity: 84 },
  { date: 'Week 8', energy: 88, digestion: 85, sleep: 85, stress: 30, immunity: 89 },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const SYMPTOM_CHECKER_FAQS: FAQ[] = [
  { id: 'f1', question: 'Is this AI Symptom Checker a replacement for a doctor?', answer: 'No. This tool provides educational Ayurvedic guidance based on ancient wisdom. It is not a medical diagnosis tool. Always consult a qualified Ayurvedic physician or healthcare professional for proper diagnosis and treatment.', category: 'General' },
  { id: 'f2', question: 'How accurate is the Dosha assessment?', answer: 'Our assessment is based on classical Ayurvedic texts (Charaka Samhita, Ashtanga Hridayam) and covers physical, mental and behavioral patterns. It gives you a strong starting point, but a personalized consultation with an Ayurvedic Vaidya provides a much deeper analysis of your Prakriti.', category: 'Dosha' },
  { id: 'f3', question: 'How long does the assessment take?', answer: 'The full 8-step assessment typically takes 5–8 minutes. Each question is designed to capture meaningful health data. You can pause and resume anytime.', category: 'Assessment' },
  { id: 'f4', question: 'Is my health data private and secure?', answer: 'Absolutely. All information you enter is processed locally and never shared with third parties. We follow strict privacy guidelines to protect your health information.', category: 'Privacy' },
  { id: 'f5', question: 'What do I do if my symptoms are severe?', answer: 'If you are experiencing severe, sudden or life-threatening symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness), please call emergency services immediately. This tool is for non-emergency wellness guidance only.', category: 'Safety' },
  { id: 'f6', question: 'Can I use this for children or during pregnancy?', answer: 'This tool is designed for adults aged 18+. For children, elderly or pregnant/nursing individuals, we strongly recommend consulting a qualified Ayurvedic physician directly for age-appropriate and safe guidance.', category: 'Safety' },
  { id: 'f7', question: 'How often should I reassess my symptoms?', answer: 'We recommend reassessing every 4–6 weeks as you implement lifestyle and dietary changes. Ayurvedic healing is gradual; regular reassessment helps track your progress and adjust recommendations accordingly.', category: 'Assessment' },
  { id: 'f8', question: 'What are the 3 Doshas in Ayurveda?', answer: 'The three Doshas are Vata (air + space), Pitta (fire + water) and Kapha (earth + water). Every person has a unique combination called Prakriti (constitution). When doshas become imbalanced (Vikruti), disease occurs. Ayurveda aims to restore the natural Prakriti balance.', category: 'Dosha' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const SYMPTOM_CHECKER_TESTIMONIALS = [
  { id: 't1', name: 'Priya Sharma', age: 34, location: 'Mumbai', condition: 'Vata Imbalance', result: 'The assessment identified my anxiety and insomnia as Vata issues. After following the protocol for 6 weeks, my sleep improved dramatically!', rating: 5, avatar: '👩' },
  { id: 't2', name: 'Rajesh Menon', age: 45, location: 'Bangalore', condition: 'Pitta Excess', result: 'Had chronic acid reflux for years. The tool pinpointed Pitta as the cause and the cooling diet changes resolved it in 3 weeks!', rating: 5, avatar: '👨' },
  { id: 't3', name: 'Anita Gupta', age: 28, location: 'Delhi', condition: 'Kapha Accumulation', result: 'Struggled with weight and fatigue. Kapha-pacifying routine gave me energy I haven\'t felt in years! Game changer!', rating: 5, avatar: '👩‍🦱' },
  { id: 't4', name: 'Suresh Patel', age: 52, location: 'Ahmedabad', condition: 'Mixed Dosha', result: 'The detailed dosha analysis was eye-opening. Now I understand why certain seasons worsen my symptoms. Excellent tool!', rating: 5, avatar: '👴' },
];
