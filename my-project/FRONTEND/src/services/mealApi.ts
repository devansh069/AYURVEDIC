// mealApi.ts — Pure mock-data service (no backend required)
import { Meal, FoodRecommendation, ApiResponse } from '../types';

export const FOODS_TO_EAT_AVOID_LOCAL: Record<string, Omit<FoodRecommendation, 'dosha'>> = {
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

const MEALS_DATABASE_LOCAL: Record<string, Record<string, Omit<Meal, 'id' | 'mealType' | 'time'>>> = {
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

export const mealApi = {
  getRecommendations: async (dosha?: string): Promise<ApiResponse<FoodRecommendation>> => {
    let targetDosha = dosha || 'Pitta';
    if (targetDosha.includes('-')) targetDosha = targetDosha.split('-')[0];
    if (!FOODS_TO_EAT_AVOID_LOCAL[targetDosha]) targetDosha = 'Pitta';
    const localRec = FOODS_TO_EAT_AVOID_LOCAL[targetDosha];
    return { data: { dosha: targetDosha, eat: localRec.eat, avoid: localRec.avoid }, isFallback: true };
  },

  getMealsDatabase: async (dosha?: string): Promise<ApiResponse<Record<string, Omit<Meal, 'id' | 'mealType' | 'time'>>>> => {
    let targetDosha = dosha || 'Pitta';
    if (targetDosha.includes('-')) targetDosha = targetDosha.split('-')[0];
    if (!MEALS_DATABASE_LOCAL[targetDosha]) targetDosha = 'Pitta';
    return { data: MEALS_DATABASE_LOCAL[targetDosha], isFallback: true };
  }
};

export default mealApi;
