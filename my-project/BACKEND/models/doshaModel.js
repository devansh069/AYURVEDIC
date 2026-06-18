// BACKEND/models/doshaModel.js

const MOCK_DOSHA_QUESTIONS = [
  {
    id: "q-1",
    question: "How would you describe your physical body frame?",
    category: "Body Structure",
    options: [
      "Thin, lean, bony, or slightly asymmetrical",
      "Medium, athletic, well-proportioned, moderate build",
      "Broad, large-framed, heavy, or sturdy build"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-2",
    question: "What is your tendency regarding body weight?",
    category: "Physical Traits",
    options: [
      "Difficulty gaining weight; thin or underweight",
      "Gain or lose weight easily; athletic weight maintenance",
      "Gain weight easily; difficulty losing weight; stout"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-3",
    question: "What are the characteristics of your skin?",
    category: "Physical Traits",
    options: [
      "Dry, rough, cool, thin, prone to cracking or coldness",
      "Warm, reddish, soft, sensitive, prone to acne or freckles",
      "Thick, smooth, cool, soft, oily, pale, or radiant"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-4",
    question: "How would you describe your hair texture and quality?",
    category: "Physical Traits",
    options: [
      "Dry, thin, curly, frizzy, brittle, or dark",
      "Fine, soft, warm, straight, reddish/blonde, early greying",
      "Thick, oily, strong, wavy, dense, dark, or lustrous"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-5",
    question: "How is your digestion and metabolic fire (Agni)?",
    category: "Digestion",
    options: [
      "Irregular, unpredictable, prone to gas, bloating, or constipation",
      "Strong, fast, intense, prone to acidity, heartburn, or loose stools",
      "Slow, sluggish, heavy, digest food slowly but steady"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-6",
    question: "What is your typical appetite pattern?",
    category: "Eating Habits",
    options: [
      "Variable, inconsistent; sometimes hungry, sometimes not",
      "Sharp, intense; cannot skip meals without feeling irritable",
      "Moderate, steady; can easily skip meals or fast"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-7",
    question: "How are your typical bowel movements?",
    category: "Digestion",
    options: [
      "Dry, hard, difficult, or irregular; prone to constipation",
      "Frequent, soft, loose, or warm; multiple times daily",
      "Heavy, thick, slow, regular, and well-formed"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-8",
    question: "What is the nature of your sleep?",
    category: "Sleep",
    options: [
      "Light, easily disturbed, light sleeper; prone to waking up",
      "Moderate, sound; wake up warm; moderate duration (6-7 hrs)",
      "Deep, heavy, long sleeper; difficult to wake up (8+ hrs)"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-9",
    question: "How many hours of sleep do you prefer/need?",
    category: "Sleep",
    options: [
      "Variable, 5-6 hours is often enough, but leaves me tired",
      "Consistent 7-8 hours; feel refreshed and sharp",
      "Prefer 8-10 hours; feel sluggish if sleeping less"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-10",
    question: "How would you describe your speed of speech?",
    category: "Lifestyle",
    options: [
      "Fast, talkative, quick, sometimes skipping words or ideas",
      "Sharp, concise, logical, argumentative, or persuasive",
      "Slow, measured, calm, sweet, or soft-spoken"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-11",
    question: "What is your general walking and activity pace?",
    category: "Lifestyle",
    options: [
      "Fast, hurried, variable, restless walker",
      "Purposeful, medium, determined, active walker",
      "Slow, steady, relaxed, graceful, or unhurried walker"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-12",
    question: "How does your memory and learning process work?",
    category: "Emotions",
    options: [
      "Learn quickly, but forget quickly; short-term focus",
      "Learn moderately, remember clearly; long-term focus",
      "Learn slowly, but never forget; deep retention"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-13",
    question: "What is your typical mood stability pattern?",
    category: "Emotions",
    options: [
      "Unpredictable, highly variable, quick mood shifts",
      "Intense, focused, competitive, easily irritated",
      "Stable, patient, calm, forgiving, slow to anger"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-14",
    question: "How do you respond under high stress?",
    category: "Stress Response",
    options: [
      "Anxious, fearful, worried, restless, or nervous",
      "Angry, irritable, impatient, competitive, or critical",
      "Calm, withdrawn, defensive, stubborn, or quiet"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-15",
    question: "How consistent are your physical energy levels?",
    category: "Energy Levels",
    options: [
      "Variable, quick bursts followed by exhaustion; low stamina",
      "Moderate, steady, competitive stamina; heat exhaustion",
      "High, consistent, robust stamina; slow to start"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-16",
    question: "Which weather climate do you dislike the most?",
    category: "Weather Preference",
    options: [
      "Cold, dry, windy, or autumn climates",
      "Hot, humid, sunny, or summer climates",
      "Cold, damp, rainy, or early spring climates"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-17",
    question: "What are your perspiration patterns?",
    category: "Physical Traits",
    options: [
      "Scant, dry, rarely sweat, little or no odor",
      "Profuse, hot, sweat easily, strong or sour odor",
      "Moderate, steady, sweat slowly, sweet or mild odor"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-18",
    question: "What characteristics define your eyes?",
    category: "Physical Traits",
    options: [
      "Small, dry, blinking, thin eyelashes, active gaze",
      "Medium, sharp, reddish, warm gaze, sensitive to light",
      "Large, wide, thick eyelashes, calm, sweet, or sleepy gaze"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-19",
    question: "What is the typical theme/nature of your dreams?",
    category: "Sleep",
    options: [
      "Active, running, flying, falling, anxious, or fearful",
      "Intense, colorful, fighting, planning, competitive, or fiery",
      "Pleasant, slow, romantic, swimming, water, or cloud-like"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-20",
    question: "If you feel your wrist pulse, how does it feel?",
    category: "Physical Traits",
    options: [
      "Thin, fast, slithering like a snake (Vata pulse)",
      "Moderate, bounding, jumping like a frog (Pitta pulse)",
      "Broad, slow, gliding like a swan (Kapha pulse)"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-21",
    question: "How do you typically execute your tasks?",
    category: "Lifestyle",
    options: [
      "Start quickly, change plans often, leave tasks unfinished",
      "Plan meticulously, work intensely, finish tasks perfectly",
      "Start slowly, work steadily, finish tasks consistently"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-22",
    question: "What are your money spending habits?",
    category: "Lifestyle",
    options: [
      "Spend impulsively, buy variable things; low savings",
      "Spend planned, buy luxury or quality things; moderate savings",
      "Accumulate money, save easily, dislike spending; high savings"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-23",
    question: "How does your tongue look in the morning?",
    category: "Physical Traits",
    options: [
      "Dry, thin, cracked, slight thin greyish coating",
      "Red, warm, sensitive, thin yellow-red coating",
      "Moist, thick, pale, thick white coating (Ama)"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-24",
    question: "What drives your physical activity choices?",
    category: "Energy Levels",
    options: [
      "Restless energy; like walking, dancing, moving; quickly tired",
      "Goal-oriented; like active sports, gym, running; competitive",
      "Dislike excessive movement; prefer walking, resting, or nesting"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  },
  {
    id: "q-25",
    question: "What usually triggers emotional reactions?",
    category: "Emotions",
    options: [
      "Uncertainty, surprise, change of plans (worries/anxiety)",
      "Incompetence, delay, heat, criticism (anger/irritation)",
      "Lack of respect, too much movement (sluggishness/possessive)"
    ],
    scoreMapping: [{ vata: 2, pitta: 0, kapha: 0 }, { vata: 0, pitta: 2, kapha: 0 }, { vata: 0, pitta: 0, kapha: 2 }]
  }
];

let MOCK_DOSHA_RESULTS = [
  {
    id: "res-1",
    patientName: "Priyanshi Sharma",
    assessmentDate: "2026-04-10",
    vataPercentage: 25,
    pittaPercentage: 55,
    kaphaPercentage: 20,
    dominantDosha: "Pitta",
    secondaryDosha: "Vata"
  },
  {
    id: "res-2",
    patientName: "Priyanshi Sharma",
    assessmentDate: "2026-06-12",
    vataPercentage: 35,
    pittaPercentage: 45,
    kaphaPercentage: 20,
    dominantDosha: "Pitta-Vata",
    secondaryDosha: "Kapha"
  }
];

const MOCK_DOSHA_RECOMMENDATIONS = {
  "Vata": {
    diet: [
      "Favor warm, moist, heavy, cooked foods with healthy oils/ghee.",
      "Incorporate sweet, sour, and salty tastes.",
      "Avoid raw, cold, dry, light, and bitter/astringent foods."
    ],
    eat: ["Cooked oats/rice", "Sweet sweet potatoes", "Ghee & organic oils", "Ripe avocados", "Almonds"],
    avoid: ["Raw salads", "Dry crackers", "Cold drinks", "Cabbage/broccoli", "Ice cream"],
    lifestyle: [
      "Maintain regular sleeping, eating, and waking cycles.",
      "Keep body warm and protected from dry, windy weather.",
      "Engage in self-massage (Abhyanga) using warm sesame oil daily."
    ],
    yoga: ["Gentle slow Hatha", "Warrior pose (Virabhadrasana)", "Tree pose (Vrksasana)", "Child's pose (Balasana)"],
    meditation: ["Grounding breath awareness", "Deep body-scan yoga nidra"],
    sleep: ["Sleep before 10:00 PM; aim for 8 hours of warm, uninterrupted rest."],
    wakeUp: "06:00 AM", morningMeal: "08:00 AM", midday: "12:30 PM", eveningMeal: "06:30 PM", sleepTime: "10:00 PM",
    therapies: ["Abhyanga (Warm oil body massage)", "Shirodhara (Warm forehead oil drip)", "Basti (Enema therapy)"],
    panchakarma: ["Snehan (Oleation)", "Svedana (Sweating)"],
    herbalSupport: ["Ashwagandha", "Shatavari", "Dashamula", "Ginger"],
    imbalances: ["Anxiety, insomnia, joint pain, dry skin, gas, and digestive irregularities."],
    preventive: ["Regular warm routines, oiled skin brushing, and avoiding dry raw eating."]
  },
  "Pitta": {
    diet: [
      "Favor cooling, sweet, bitter, and astringent foods.",
      "Incorporate coconut oil, ghee, sweet melons, and leafy green vegetables.",
      "Avoid spicy, sour, salty, hot, and fried foods."
    ],
    eat: ["Sweet apples/pears", "Leafy green greens", "Coconut water", "Basmati rice", "Melons"],
    avoid: ["Chili peppers", "Sour tomatoes", "Yogurt/buttermilk", "Garlic/onions", "Vinegar"],
    lifestyle: [
      "Avoid excessive solar exposure or hot environments.",
      "Keep a moderate, non-competitive activity pace.",
      "Practice compassion, patience, and cool water swimming."
    ],
    yoga: ["Cooling restorative yoga", "Moon salutations (Chandra Namaskar)", "Bridge pose", "Fish pose"],
    meditation: ["Loving-kindness (Metta) meditation", "Cooling Sheetali pranayama"],
    sleep: ["Retire to bed by 10:30 PM to optimize Pitta liver detox cycles; 7-8 hours."],
    wakeUp: "05:30 AM", morningMeal: "07:30 AM", midday: "12:00 PM", eveningMeal: "07:00 PM", sleepTime: "10:30 PM",
    therapies: ["Takradhara (Cooling buttermilk drip)", "Abhyanga with Coconut oil", "Shitala Udvartana"],
    panchakarma: ["Virechana (Therapeutic purgation)", "Raktamokshana (Bloodletting)"],
    herbalSupport: ["Amalaki (Amla)", "Brahmi", "Guduchi", "Shatavari"],
    imbalances: ["Acid reflux, skin rashes, cystic acne, excessive anger, heat intolerance, and inflammation."],
    preventive: ["Cooling diet, Sheetali breath, avoiding hot midday sun, and staying hydrated."]
  },
  "Kapha": {
    diet: [
      "Favor warm, light, dry, pungent, bitter, and astringent foods.",
      "Incorporate warming spices like black pepper, ginger, and garlic.",
      "Avoid heavy, cold, sweet, oily, salty, and dairy-heavy foods."
    ],
    eat: ["Spicy ginger teas", "Light barley, oats & millet", "Bitter greens", "Apples & berries", "Warm clear soups"],
    avoid: ["Wheat & refined pasta", "Cold heavy cheese & curd", "Sweets & cakes", "Ice cold water", "Bananas"],
    lifestyle: [
      "Incorporate active, stimulating physical exercise daily.",
      "Avoid daytime sleeping or heavy sedentary patterns.",
      "Seek new experiences, challenges, and warm, dry environments."
    ],
    yoga: ["Dynamic Vinyasa flow", "Sun salutations (Surya Namaskar)", "Bow pose (Dhanurasana)", "Camel pose (Ustrasana)"],
    meditation: ["Active walking meditation", "Bellows breath (Bhastrika)"],
    sleep: ["Wake up early (before 6 AM); avoid sleeping more than 6-7 hours."],
    wakeUp: "05:00 AM", morningMeal: "07:00 AM", midday: "01:00 PM", eveningMeal: "06:00 PM", sleepTime: "10:00 PM",
    therapies: ["Udvartana (Dry herbal scrub)", "Swedana (Steam sauna)", "Nasya (Nasal cleansing)"],
    panchakarma: ["Vamana (Emesis therapy)", "Nasya (Nasal drops)"],
    herbalSupport: ["Triphala", "Trikatu", "Guggulu", "Tulsi"],
    imbalances: ["Lethargy, weight gain, congestion, fluid retention, depression, and sluggish digestion."],
    preventive: ["Daily vigorous yoga/cardio, avoiding sweet dairy, and dry body brushing."]
  }
};

module.exports = {
  MOCK_DOSHA_QUESTIONS,
  MOCK_DOSHA_RESULTS,
  MOCK_DOSHA_RECOMMENDATIONS
};
