// BACKEND/models/dietModel.js

let MOCK_DIET_USER_PROFILE = {
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

const FOODS_TO_EAT_AVOID = {
  "Vata": {
    eat: ["Cooked oatmeal & rice", "Warm vegetable soups", "Ghee & olive oil", "Sweet potatoes", "Almonds & walnuts", "Fresh sweet grapes & mangoes"],
    avoid: ["Raw salads & dry crackers", "Cold carbonated beverages", "Cabbage, cauliflower & raw broccoli", "Excessive dry beans", "White potatoes"]
  },
  "Pitta": {
    eat: ["Sweet juicy apples & pears", "Asparagus & leafy greens", "Fresh coconut water", "Basmati rice", "Organic Ghee", "Mung dal stews"],
    avoid: ["Hot chili peppers & cayenne", "Sour tomatoes & vinegar", "Pickles & fermented foods", "Salty chips", "Yogurt after sunset", "Garlic & raw onions"]
  },
  "Kapha": {
    eat: ["Spiced warm ginger tea", "Light barley, oats & millet", "Bitter leafy greens & squash", "Pungent spices (black pepper, turmeric)", "Roasted chickpeas", "Honey (in moderation)"],
    avoid: ["Refined wheat & pasta", "Cold heavy cheese & curd", "Fried sweet foods & ice cream", "Iced beverages", "Very sweet ripe bananas", "Salted butter"]
  }
};

const MEALS_DATABASE = {
  "Vata": {
    Breakfast: { mealName: "Warming Almond & Spice Oatmeal", calories: 350, ingredients: ["Organic rolled oats", "Almond milk", "Slivered almonds", "Cinnamon & cardamom", "Ghee"], benefits: ["Calms erratic Vata winds", "Nourishes nervous tissues", "Provides sustained warm energy"] },
    "Mid-Morning Snack": { mealName: "Stewed Sweet Apples", calories: 150, ingredients: ["Fresh sweet apples", "Cloves", "Cardamom", "Warm water"], benefits: ["Stirs light digestive Agni", "Easy to assimilate", "Soothes colon channels"] },
    Lunch: { mealName: "Nourishing Mung Dal & Rice Kitchari", calories: 480, ingredients: ["Split yellow mung beans", "Basmati rice", "Carrots", "Zucchini", "Ghee & cumin spice blend"], benefits: ["Highly digestible", "Removes toxic Ama buildup", "Grounds full body channels"] },
    "Evening Snack": { mealName: "Warm Spiced Sesame Drink", calories: 180, ingredients: ["Sesame seed powder", "Warm milk", "Maple syrup", "Ginger powder"], benefits: ["Lubricates joint spaces", "Nourishes bone tissue (Asthi Dhatu)"] },
    Dinner: { mealName: "Baked Sweet Potato & Asparagus Stew", calories: 380, ingredients: ["Sweet potato", "Asparagus", "Olive oil", "Ginger", "Himalayan rock salt"], benefits: ["Heavy grounding properties", "Calms mind channels before sleep"] },
    "Bedtime Drink": { mealName: "Nutmeg Cardamom Milk", calories: 120, ingredients: ["Cow milk or Almond milk", "Nutmeg powder", "Cardamom powder"], benefits: ["Promotes natural deep sleep (Anidra relief)", "Soothes Vata dryness"] }
  },
  "Pitta": {
    Breakfast: { mealName: "Cooling Barley Flakes & Cardamom Porridge", calories: 320, ingredients: ["Barley flakes", "Whole milk", "Coconut sugar", "Cardamom", "Raisins"], benefits: ["Cools stomach heat (Amlapitta)", "Restores liver channels"] },
    "Mid-Morning Snack": { mealName: "Fresh Cucumber & Mint Juice", calories: 90, ingredients: ["Cucumber", "Fresh mint leaves", "Lime juice", "Water"], benefits: ["Highly hydrating", "Neutralizes excess bile acids"] },
    Lunch: { mealName: "Bitter Greens & Steamed Quinoa bowl", calories: 450, ingredients: ["Quinoa", "Kale", "Asparagus", "Zucchini", "Coconut oil", "Fennel seeds"], benefits: ["Cooling and alkalizing", "Supports hormone balancing"] },
    "Evening Snack": { mealName: "Sweet Watermelon Skewers", calories: 120, ingredients: ["Fresh sweet watermelon", "Mint garnish"], benefits: ["Reduces vascular pressure", "Flushes kidney tract channels"] },
    Dinner: { mealName: "Yellow Lentil soup & Basmati Rice", calories: 400, ingredients: ["Yellow split lentils", "Basmati rice", "Coriander", "Fennel powder", "Ghee"], benefits: ["Soothing digestive loading", "Nourishes cells without heating"] },
    "Bedtime Drink": { mealName: "Cooling Cardamom Fennel Milk", calories: 110, ingredients: ["Cardamom powder", "Fennel seed powder", "Warm milk"], benefits: ["Pacifies Pitta fire in stomach channels", "Encourages quiet rest"] }
  },
  "Kapha": {
    Breakfast: { mealName: "Warm Buckwheat & Cranberry Porridge", calories: 280, ingredients: ["Buckwheat flour", "Water", "Dried cranberries", "Ginger & cloves"], benefits: ["Light and drying to clear mucus", "Stimulates slow morning Agni"] },
    "Mid-Morning Snack": { mealName: "Warm Ginger & Basil Decoction", calories: 40, ingredients: ["Ginger root slice", "Tulsi basil leaves", "Hot water", "Raw honey"], benefits: ["Liquifies respiratory congestion", "Boosts metabolic activity"] },
    Lunch: { mealName: "Spiced Roasted Chickpeas & Steamed Broccoli", calories: 420, ingredients: ["Chickpeas", "Broccoli", "Mustard seeds", "Turmeric", "Black pepper", "Lemon juice"], benefits: ["Scrapes lymphatic tissue deposits", "High fiber clears bowel channels"] },
    "Evening Snack": { mealName: "Spiced Pumpkin Seed Mix", calories: 140, ingredients: ["Pumpkin seeds", "Sunflower seeds", "Black pepper", "Cayenne pinch"], benefits: ["Warm and drying properties", "Low fat snack alternatives"] },
    Dinner: { mealName: "Light Red Lentil & Squash Soup", calories: 350, ingredients: ["Red lentils", "Butternut squash", "Ginger", "Cumin", "Garlic"], benefits: ["Clears metabolic blocks (Srotas)", "Prevents night fat deposition"] },
    "Bedtime Drink": { mealName: "Golden Turmeric Cardamom Water", calories: 30, ingredients: ["Turmeric powder", "Cardamom powder", "Hot water"], benefits: ["Strong anti-inflammatory", "Boosts natural immunity"] }
  }
};

let MOCK_DIET_PLAN = {
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

let MOCK_DIET_HISTORY = [
  {
    id: "plan-hist-1",
    planName: "Metabolic Fire Reset (Vata)",
    dateGenerated: "2026-05-12",
    goal: "Metabolic Reset",
    calories: 1850,
    duration: "14 Days"
  },
  {
    id: "plan-hist-2",
    planName: "Pitta Balance Plan",
    dateGenerated: "2026-05-26",
    goal: "Hormonal Balance",
    calories: 1690,
    duration: "30 Days"
  }
];

let MOCK_DIET_PROGRESS = [
  { date: "2026-05-12", weight: 64.0, bmi: 23.5, adherenceRate: 75 },
  { date: "2026-05-26", weight: 63.2, bmi: 23.2, adherenceRate: 85 },
  { date: "2026-06-12", weight: 62.0, bmi: 22.8, adherenceRate: 92 }
];

module.exports = {
  getDietUserProfile: () => MOCK_DIET_USER_PROFILE,
  setDietUserProfile: (profile) => { MOCK_DIET_USER_PROFILE = profile; },
  getFoodsToEatAvoid: () => FOODS_TO_EAT_AVOID,
  getMealsDatabase: () => MEALS_DATABASE,
  getDietPlan: () => MOCK_DIET_PLAN,
  setDietPlan: (plan) => { MOCK_DIET_PLAN = plan; },
  getDietHistory: () => MOCK_DIET_HISTORY,
  getDietProgress: () => MOCK_DIET_PROGRESS
};
