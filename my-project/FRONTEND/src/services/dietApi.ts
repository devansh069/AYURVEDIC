import axios from 'axios';
import { UserProfile, DietPlan, Meal, DietHistory, ApiResponse } from '../types';

const client = axios.create({
  baseURL: 'http://localhost:5174/api',
  timeout: 25000
});

const getAuthHeaders = () => {
  const active = localStorage.getItem('activeUser');
  if (active) {
    try {
      const parsed = JSON.parse(active);
      return {
        'x-user-id': parsed.profile.id,
        'x-user-role': parsed.role
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {};
};

// ─── Local Mock Fallbacks ────────────────────────────────────────────────────

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
  doshaType: "Pitta-Kapha",
  goal: "Hormonal Balance",
  dailyCalories: 1800,
  duration: "30 Days",
  meals: [
    { id: "m-1", mealType: "Breakfast", mealName: "Spiced Barley Porridge with Almonds & Cardamom", time: "08:30 AM", calories: 380, ingredients: ["Barley flakes", "Almond milk", "Cardamom"], benefits: ["Cools stomach heat"] },
    { id: "m-2", mealType: "Lunch", mealName: "Mung Dal Khichdi with Steamed Zucchini & Ghee", time: "01:00 PM", calories: 520, ingredients: ["Quinoa", "Mung dal", "Ghee"], benefits: ["Supports digestive health"] },
    { id: "m-3", mealType: "Evening Snack", mealName: "Stewed Apple with Cinnamon & Warm Ginger Water", time: "04:30 PM", calories: 180, ingredients: ["Apples", "Cinnamon"], benefits: ["Fires up sluggish digestion"] },
    { id: "m-4", mealType: "Dinner", mealName: "Butternut Squash Soup & Quinoa Salad", time: "07:30 PM", calories: 420, ingredients: ["Squash", "Quinoa"], benefits: ["Light digestive load"] }
  ],
  nutritionSummary: {
    calories: 1800,
    protein: 65,
    carbs: 220,
    fats: 45,
    waterTarget: 3200
  }
};

const LOCAL_MEALS_DATABASE: Record<string, Record<string, Omit<Meal, 'id' | 'mealType' | 'time'>>> = {
  "Vata": {
    Breakfast: { mealName: "Warming Almond & Spice Oatmeal", calories: 350, ingredients: ["Organic rolled oats", "Almond milk", "Ghee"], benefits: ["Calms Vata winds"] },
    Lunch: { mealName: "Yellow Mung Kitchari", calories: 480, ingredients: ["Yellow mung beans", "Basmati rice", "Ghee"], benefits: ["Removes toxic Ama"] },
    Dinner: { mealName: "Baked Sweet Potato Stew", calories: 380, ingredients: ["Sweet potato", "Asparagus"], benefits: ["Grounding and nourishing"] }
  },
  "Pitta": {
    Breakfast: { mealName: "Cooling Barley Porridge", calories: 320, ingredients: ["Barley flakes", "Whole milk", "Cardamom"], benefits: ["Cools stomach heat"] },
    Lunch: { mealName: "Quinoa Greens Bowl", calories: 450, ingredients: ["Quinoa", "Kale", "Asparagus"], benefits: ["Alkalizing"] },
    Dinner: { mealName: "Mung Dal Soup & Rice", calories: 400, ingredients: ["Split lentils", "Rice"], benefits: ["Nourishing and calming"] }
  },
  "Kapha": {
    Breakfast: { mealName: "Buckwheat Cranberry Flakes", calories: 280, ingredients: ["Buckwheat", "Water", "Cranberries"], benefits: ["Light and dry to clear mucus"] },
    Lunch: { mealName: "Spiced Chickpea Salad", calories: 420, ingredients: ["Chickpeas", "Broccoli", "Turmeric"], benefits: ["Scrapes lymph blockages"] },
    Dinner: { mealName: "Red Lentil Squash Soup", calories: 350, ingredients: ["Red lentils", "Squash", "Garlic"], benefits: ["Clears metabolic channels"] }
  }
};

export const dietApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return { data: MOCK_DIET_USER_PROFILE_LOCAL, isFallback: true };
  },

  getPlans: async (): Promise<ApiResponse<DietPlan[]>> => {
    try {
      const response = await client.get('/patient/diet', { headers: getAuthHeaders() });
      if (response.data && response.data.success) {
        const dbPlan = response.data.data;
        const mappedPlan: DietPlan = {
          id: "plan-active-db",
          planName: `Active ${dbPlan.doshaType}-Pacifying Meal Schedule`,
          doshaType: dbPlan.doshaType,
          goal: "Hormonal Balance",
          dailyCalories: dbPlan.dailyCaloriesTarget,
          duration: "30 Days",
          meals: [
            { id: "m-1", mealType: "Breakfast", mealName: dbPlan.meals.breakfast.name, time: dbPlan.meals.breakfast.time, calories: dbPlan.meals.breakfast.calories, ingredients: [], benefits: [dbPlan.guidelines[0]] },
            { id: "m-2", mealType: "Lunch", mealName: dbPlan.meals.lunch.name, time: dbPlan.meals.lunch.time, calories: dbPlan.meals.lunch.calories, ingredients: [], benefits: [dbPlan.guidelines[1]] },
            { id: "m-3", mealType: "Evening Snack", mealName: dbPlan.meals.snack.name, time: dbPlan.meals.snack.time, calories: dbPlan.meals.snack.calories, ingredients: [], benefits: [] },
            { id: "m-4", mealType: "Dinner", mealName: dbPlan.meals.dinner.name, time: dbPlan.meals.dinner.time, calories: dbPlan.meals.dinner.calories, ingredients: [], benefits: [dbPlan.guidelines[2]] }
          ],
          nutritionSummary: {
            calories: dbPlan.dailyCaloriesTarget,
            protein: dbPlan.proteinTarget,
            carbs: dbPlan.carbsTarget,
            fats: dbPlan.fatTarget,
            waterTarget: dbPlan.waterTarget * 1000
          }
        };
        return { data: [mappedPlan], isFallback: false };
      }
      throw new Error('No diet plan loaded');
    } catch (err: any) {
      return { data: [MOCK_DIET_PLAN_LOCAL], isFallback: true, error: err.message };
    }
  },

  getHistory: async (): Promise<ApiResponse<DietHistory[]>> => {
    return { data: [], isFallback: true };
  },

  generatePlan: async (profile: Omit<UserProfile, 'id'>): Promise<ApiResponse<DietPlan>> => {
    let lookupDosha = profile.doshaType;
    if (lookupDosha.includes('-')) lookupDosha = lookupDosha.split('-')[0];
    if (!LOCAL_MEALS_DATABASE[lookupDosha]) lookupDosha = 'Pitta';

    const baseMeals = LOCAL_MEALS_DATABASE[lookupDosha];
    const calTarget = 1800;

    const generated: DietPlan = {
      id: `plan-gen-${Date.now()}`,
      planName: `Custom Generated ${profile.doshaType} Routine`,
      doshaType: profile.doshaType,
      goal: profile.healthGoals.join(', '),
      dailyCalories: calTarget,
      duration: "30 Days",
      meals: [
        { id: "gm-1", mealType: "Breakfast", mealName: baseMeals.Breakfast.mealName, time: "08:00 AM", calories: baseMeals.Breakfast.calories, ingredients: baseMeals.Breakfast.ingredients, benefits: baseMeals.Breakfast.benefits },
        { id: "gm-2", mealType: "Lunch", mealName: baseMeals.Lunch.mealName, time: "01:00 PM", calories: baseMeals.Lunch.calories, ingredients: baseMeals.Lunch.ingredients, benefits: baseMeals.Lunch.benefits },
        { id: "gm-3", mealType: "Dinner", mealName: baseMeals.Dinner.mealName, time: "07:30 PM", calories: baseMeals.Dinner.calories, ingredients: baseMeals.Dinner.ingredients, benefits: baseMeals.Dinner.benefits }
      ],
      nutritionSummary: {
        calories: calTarget,
        protein: 70,
        carbs: 230,
        fats: 50,
        waterTarget: 3000
      }
    };

    // Save generated plan to backend in real time
    try {
      const dbPlanFormat = {
        doshaType: generated.doshaType,
        dailyCaloriesTarget: generated.dailyCalories,
        proteinTarget: generated.nutritionSummary.protein,
        carbsTarget: generated.nutritionSummary.carbs,
        fatTarget: generated.nutritionSummary.fats,
        waterTarget: generated.nutritionSummary.waterTarget / 1000,
        guidelines: [
          generated.meals[0].benefits?.[0] || 'Follow custom meal timing.',
          generated.meals[1].benefits?.[0] || 'Keep lunch heavy to leverage strong pitta agni.',
          generated.meals[2].benefits?.[0] || 'Keep dinner extremely light.'
        ],
        meals: {
          breakfast: { time: generated.meals[0].time, name: generated.meals[0].mealName, calories: generated.meals[0].calories },
          lunch: { time: generated.meals[1].time, name: generated.meals[1].mealName, calories: generated.meals[1].calories },
          snack: { time: '04:30 PM', name: 'Ayurvedic Herbal Tulsi infusion', calories: 50 },
          dinner: { time: generated.meals[2].time, name: generated.meals[2].mealName, calories: generated.meals[2].calories }
        }
      };

      await client.post('/patient/diet', dbPlanFormat, { headers: getAuthHeaders() });
    } catch (err) {
      console.warn('Failed to save generated plan to backend:', err);
    }

    return { data: generated, isFallback: false };
  }
};

export default dietApi;
