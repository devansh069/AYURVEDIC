// dietApi.ts — Pure mock-data service (no backend required)
import { UserProfile, DietPlan, Meal, DietHistory, ApiResponse } from '../types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_DIET_USER_PROFILE_LOCAL: UserProfile = {
  id: "profile-1",
  name: "Priyanshi Sharma",
  age: 24,
  gender: "Female",
  weight: 62,
  height: 165,
  activityLevel: "Moderate",
  doshaType: "Pitta-Vata",
  healthGoals: ["Hormonal Balance", "Metabolic Reset"],
  medicalConditions: ["PCOS"],
  dietPreference: "Vegetarian"
};

export const MOCK_DIET_PLAN_LOCAL: DietPlan = {
  id: "plan-active-1",
  planName: "Active Pitta-Pacifying Meal Schedule",
  doshaType: "Pitta",
  goal: "Hormonal Balance",
  dailyCalories: 1690,
  duration: "30 Days",
  meals: [
    { id: "m-1", mealType: "Breakfast", mealName: "Cooling Barley Flakes & Cardamom Porridge", time: "08:00 AM", calories: 320, ingredients: ["Barley flakes", "Whole milk", "Cardamom", "Raisins"], benefits: ["Cools stomach heat", "Restores metabolic balance"] },
    { id: "m-2", mealType: "Mid-Morning Snack", mealName: "Fresh Cucumber & Mint Juice", time: "11:00 AM", calories: 90, ingredients: ["Cucumber", "Fresh mint", "Lime juice"], benefits: ["Highly hydrating", "Neutralizes excess bile acids"] },
    { id: "m-3", mealType: "Lunch", mealName: "Bitter Greens & Steamed Quinoa Bowl", time: "01:00 PM", calories: 450, ingredients: ["Quinoa", "Kale", "Asparagus", "Fennel seeds"], benefits: ["Cooling and alkalizing", "Supports reproductive health"] },
    { id: "m-4", mealType: "Evening Snack", mealName: "Sweet Watermelon Skewers", time: "04:30 PM", calories: 120, ingredients: ["Fresh sweet watermelon", "Mint"], benefits: ["Reduces heat pressure", "Flushes metabolic tracts"] },
    { id: "m-5", mealType: "Dinner", mealName: "Yellow Lentil Soup & Basmati Rice", time: "07:30 PM", calories: 400, ingredients: ["Yellow split lentils", "Basmati rice", "Coriander", "Ghee"], benefits: ["Light digestive load", "Nourishes tissues without heating"] },
    { id: "m-6", mealType: "Bedtime Drink", mealName: "Cooling Cardamom Fennel Milk", time: "09:45 PM", calories: 110, ingredients: ["Cardamom", "Fennel seed", "Warm milk"], benefits: ["Pacifies Pitta fire", "Soothes central nervous system"] }
  ],
  nutritionSummary: {
    calories: 1690,
    protein: 65,
    carbs: 230,
    fats: 45,
    waterTarget: 2500
  }
};

export const MOCK_DIET_HISTORY_LOCAL: DietHistory[] = [
  { id: "plan-hist-1", planName: "Metabolic Fire Reset (Vata)", dateGenerated: "2026-05-12", goal: "Metabolic Reset", calories: 1850, duration: "14 Days" },
  { id: "plan-hist-2", planName: "Pitta Balance Plan", dateGenerated: "2026-05-26", goal: "Hormonal Balance", calories: 1690, duration: "30 Days" }
];

const LOCAL_MEALS_DATABASE: Record<string, Record<string, Omit<Meal, 'id' | 'mealType' | 'time'>>> = {
  "Vata": {
    Breakfast: { mealName: "Warming Almond & Spice Oatmeal", calories: 350, ingredients: ["Organic rolled oats", "Almond milk", "Slivered almonds", "Cinnamon", "Ghee"], benefits: ["Calms Vata winds", "Provides warm energy"] },
    "Mid-Morning Snack": { mealName: "Stewed Sweet Apples", calories: 150, ingredients: ["Fresh apples", "Cloves", "Cardamom"], benefits: ["Stirs light digestion", "Soothes stomach"] },
    Lunch: { mealName: "Yellow Mung Kitchari", calories: 480, ingredients: ["Yellow mung beans", "Basmati rice", "Ghee & cumin"], benefits: ["Highly digestible", "Removes toxic Ama"] },
    "Evening Snack": { mealName: "Warm Sesame Almond Milk", calories: 180, ingredients: ["Almonds", "Sesame powder", "Milk"], benefits: ["Lubricates joint spaces"] },
    Dinner: { mealName: "Baked Sweet Potato Stew", calories: 380, ingredients: ["Sweet potato", "Asparagus", "Olive oil"], benefits: ["Grounding and nourishing"] },
    "Bedtime Drink": { mealName: "Nutmeg Sleepy Milk", calories: 120, ingredients: ["Warm milk", "Nutmeg powder", "Honey"], benefits: ["Promotes deep sleep"] }
  },
  "Pitta": {
    Breakfast: { mealName: "Cooling Barley Porridge", calories: 320, ingredients: ["Barley flakes", "Whole milk", "Cardamom"], benefits: ["Cools stomach heat", "Soothes liver"] },
    "Mid-Morning Snack": { mealName: "Cucumber Mint Drink", calories: 90, ingredients: ["Cucumber", "Fresh mint", "Lime juice"], benefits: ["Cooling and refreshing"] },
    Lunch: { mealName: "Quinoa Greens Bowl", calories: 450, ingredients: ["Quinoa", "Kale", "Asparagus", "Zucchini"], benefits: ["Cooling and alkalizing"] },
    "Evening Snack": { mealName: "Fresh Melon Medley", calories: 120, ingredients: ["Watermelon", "Cantaloupe"], benefits: ["Flushes kidney tracts"] },
    Dinner: { mealName: "Mung Dal Soup & Rice", calories: 400, ingredients: ["Split lentils", "Rice", "Fennel seeds"], benefits: ["Nourishing and calming"] },
    "Bedtime Drink": { mealName: "Fennel Milk Infusion", calories: 110, ingredients: ["Cardamom", "Fennel seeds", "Warm milk"], benefits: ["Pacifies Pitta heat"] }
  },
  "Kapha": {
    Breakfast: { mealName: "Buckwheat Cranberry Flakes", calories: 280, ingredients: ["Buckwheat", "Water", "Cranberries", "Ginger"], benefits: ["Light and dry to clear mucus"] },
    "Mid-Morning Snack": { mealName: "Ginger Tulsi Tea", calories: 40, ingredients: ["Ginger", "Tulsi", "Honey"], benefits: ["Liquifies congestion"] },
    Lunch: { mealName: "Spiced Chickpea Salad", calories: 420, ingredients: ["Chickpeas", "Broccoli", "Mustard seeds", "Turmeric"], benefits: ["Scrapes lymph blockages"] },
    "Evening Snack": { mealName: "Roasted Pumpkin Seeds", calories: 140, ingredients: ["Pumpkin seeds", "Sunflower seeds", "Black pepper"], benefits: ["Warm and dry snack"] },
    Dinner: { mealName: "Red Lentil Squash Soup", calories: 350, ingredients: ["Red lentils", "Squash", "Garlic", "Ginger"], benefits: ["Clears metabolic channels"] },
    "Bedtime Drink": { mealName: "Turmeric Spiced Water", calories: 30, ingredients: ["Turmeric", "Cardamom", "Ginger root"], benefits: ["Boosts immunity"] }
  }
};

// ─── API (mock-only, no network calls) ──────────────────────────────────────

export const dietApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return { data: MOCK_DIET_USER_PROFILE_LOCAL, isFallback: true };
  },

  getPlans: async (): Promise<ApiResponse<DietPlan[]>> => {
    return { data: [MOCK_DIET_PLAN_LOCAL], isFallback: true };
  },

  getHistory: async (): Promise<ApiResponse<DietHistory[]>> => {
    return { data: [...MOCK_DIET_HISTORY_LOCAL], isFallback: true };
  },

  generatePlan: async (profile: Omit<UserProfile, 'id'>): Promise<ApiResponse<DietPlan>> => {
    let lookupDosha = profile.doshaType;
    if (lookupDosha.includes('-')) lookupDosha = lookupDosha.split('-')[0];
    if (!LOCAL_MEALS_DATABASE[lookupDosha]) lookupDosha = 'Pitta';

    const baseMeals = LOCAL_MEALS_DATABASE[lookupDosha];
    let calTarget = 1800;
    if (profile.healthGoals.includes("Weight Loss") || profile.healthGoals.includes("Weight Management")) {
      calTarget = 1500;
    } else if (profile.healthGoals.includes("Muscle Gain")) {
      calTarget = 2200;
    }

    let p = 60, c = 210, f = 40;
    if (lookupDosha === 'Pitta') { p = 65; c = 230; f = 45; }
    else if (lookupDosha === 'Kapha') { p = 75; c = 180; f = 35; }
    else { p = 55; c = 240; f = 50; }

    const generatedMeals: Meal[] = [
      { id: `gm-1`, mealType: "Breakfast", mealName: baseMeals.Breakfast.mealName, time: "08:00 AM", calories: baseMeals.Breakfast.calories, ingredients: baseMeals.Breakfast.ingredients, benefits: baseMeals.Breakfast.benefits },
      { id: `gm-2`, mealType: "Mid-Morning Snack", mealName: baseMeals["Mid-Morning Snack"].mealName, time: "11:00 AM", calories: baseMeals["Mid-Morning Snack"].calories, ingredients: baseMeals["Mid-Morning Snack"].ingredients, benefits: baseMeals["Mid-Morning Snack"].benefits },
      { id: `gm-3`, mealType: "Lunch", mealName: baseMeals.Lunch.mealName, time: "01:00 PM", calories: baseMeals.Lunch.calories, ingredients: baseMeals.Lunch.ingredients, benefits: baseMeals.Lunch.benefits },
      { id: `gm-4`, mealType: "Evening Snack", mealName: baseMeals["Evening Snack"].mealName, time: "04:30 PM", calories: baseMeals["Evening Snack"].calories, ingredients: baseMeals["Evening Snack"].ingredients, benefits: baseMeals["Evening Snack"].benefits },
      { id: `gm-5`, mealType: "Dinner", mealName: baseMeals.Dinner.mealName, time: "07:30 PM", calories: baseMeals.Dinner.calories, ingredients: baseMeals.Dinner.ingredients, benefits: baseMeals.Dinner.benefits },
      { id: `gm-6`, mealType: "Bedtime Drink", mealName: baseMeals["Bedtime Drink"].mealName, time: "09:45 PM", calories: baseMeals["Bedtime Drink"].calories, ingredients: baseMeals["Bedtime Drink"].ingredients, benefits: baseMeals["Bedtime Drink"].benefits }
    ];

    const clientGeneratedPlan: DietPlan = {
      id: `plan-active-${Date.now()}`,
      planName: `Customized ${lookupDosha}-Pacifying Nutrition Plan`,
      doshaType: profile.doshaType,
      goal: profile.healthGoals[0] || "General Health",
      dailyCalories: calTarget,
      duration: "30 Days",
      meals: generatedMeals,
      nutritionSummary: { calories: calTarget, protein: p, carbs: c, fats: f, waterTarget: 2500 }
    };

    MOCK_DIET_HISTORY_LOCAL.unshift({
      id: clientGeneratedPlan.id,
      planName: clientGeneratedPlan.planName,
      dateGenerated: new Date().toISOString().split('T')[0],
      goal: clientGeneratedPlan.goal,
      calories: clientGeneratedPlan.dailyCalories,
      duration: clientGeneratedPlan.duration
    });

    return { data: clientGeneratedPlan, isFallback: true };
  }
};

export default dietApi;
