// BACKEND/controllers/dietController.js
const dietModel = require('../models/dietModel');

exports.getDietProfile = (req, res, next) => {
  try {
    res.json(dietModel.getDietUserProfile());
  } catch (err) {
    next(err);
  }
};

exports.getDietPlans = (req, res, next) => {
  try {
    res.json([dietModel.getDietPlan()]);
  } catch (err) {
    next(err);
  }
};

exports.getDietRecommendations = (req, res, next) => {
  try {
    const dosha = req.query.dosha || "Pitta";
    let targetDosha = dosha.includes("-") ? dosha.split("-")[0] : dosha;
    const foods = dietModel.getFoodsToEatAvoid();
    if (!foods[targetDosha]) {
      targetDosha = "Pitta";
    }
    res.json({
      dosha: targetDosha,
      ...foods[targetDosha]
    });
  } catch (err) {
    next(err);
  }
};

exports.getDietMeals = (req, res, next) => {
  try {
    const dosha = req.query.dosha || "Pitta";
    let targetDosha = dosha.includes("-") ? dosha.split("-")[0] : dosha;
    const mealsDb = dietModel.getMealsDatabase();
    if (!mealsDb[targetDosha]) {
      targetDosha = "Pitta";
    }
    res.json(mealsDb[targetDosha]);
  } catch (err) {
    next(err);
  }
};

exports.getDietNutrition = (req, res, next) => {
  try {
    res.json({
      summary: dietModel.getDietPlan().nutritionSummary,
      progress: dietModel.getDietProgress()
    });
  } catch (err) {
    next(err);
  }
};

exports.getDietHistory = (req, res, next) => {
  try {
    res.json(dietModel.getDietHistory());
  } catch (err) {
    next(err);
  }
};

exports.generateDietPlan = (req, res, next) => {
  try {
    const { name, age, gender, weight, height, activityLevel, doshaType, healthGoal, dietPreference, medicalConditions } = req.body;
    
    const currentProfile = dietModel.getDietUserProfile();
    const updatedProfile = {
      id: `profile-${Date.now()}`,
      name: name || currentProfile.name,
      age: Number(age) || currentProfile.age,
      gender: gender || currentProfile.gender,
      weight: Number(weight) || currentProfile.weight,
      height: Number(height) || currentProfile.height,
      activityLevel: activityLevel || currentProfile.activityLevel,
      doshaType: doshaType || currentProfile.doshaType,
      healthGoals: healthGoal ? [healthGoal] : currentProfile.healthGoals,
      medicalConditions: medicalConditions ? [medicalConditions] : currentProfile.medicalConditions,
      dietPreference: dietPreference || currentProfile.dietPreference
    };
    dietModel.setDietUserProfile(updatedProfile);

    let lookupDosha = updatedProfile.doshaType;
    if (lookupDosha.includes("-")) {
      lookupDosha = lookupDosha.split("-")[0];
    }
    const mealsDb = dietModel.getMealsDatabase();
    if (!mealsDb[lookupDosha]) {
      lookupDosha = "Pitta";
    }

    const baseMeals = mealsDb[lookupDosha];
    
    let calTarget = 1800;
    if (healthGoal === "Weight Loss" || healthGoal === "Weight Management") {
      calTarget = 1500;
    } else if (healthGoal === "Muscle Gain") {
      calTarget = 2200;
    }

    let p = 60, c = 210, f = 40;
    if (lookupDosha === "Pitta") {
      p = 65; c = 230; f = 45;
    } else if (lookupDosha === "Kapha") {
      p = 75; c = 180; f = 35;
    } else {
      p = 55; c = 240; f = 50;
    }

    const generatedMeals = [
      { id: `gm-1`, mealType: "Breakfast", mealName: baseMeals.Breakfast.mealName, time: "08:00 AM", calories: baseMeals.Breakfast.calories, ingredients: baseMeals.Breakfast.ingredients, benefits: baseMeals.Breakfast.benefits },
      { id: `gm-2`, mealType: "Mid-Morning Snack", mealName: baseMeals["Mid-Morning Snack"].mealName, time: "11:00 AM", calories: baseMeals["Mid-Morning Snack"].calories, ingredients: baseMeals["Mid-Morning Snack"].ingredients, benefits: baseMeals["Mid-Morning Snack"].benefits },
      { id: `gm-3`, mealType: "Lunch", mealName: baseMeals.Lunch.mealName, time: "01:00 PM", calories: baseMeals.Lunch.calories, ingredients: baseMeals.Lunch.ingredients, benefits: baseMeals.Lunch.benefits },
      { id: `gm-4`, mealType: "Evening Snack", mealName: baseMeals["Evening Snack"].mealName, time: "04:30 PM", calories: baseMeals["Evening Snack"].calories, ingredients: baseMeals["Evening Snack"].ingredients, benefits: baseMeals["Evening Snack"].benefits },
      { id: `gm-5`, mealType: "Dinner", mealName: baseMeals.Dinner.mealName, time: "07:30 PM", calories: baseMeals.Dinner.calories, ingredients: baseMeals.Dinner.ingredients, benefits: baseMeals.Dinner.benefits },
      { id: `gm-6`, mealType: "Bedtime Drink", mealName: baseMeals["Bedtime Drink"].mealName, time: "09:45 PM", calories: baseMeals["Bedtime Drink"].calories, ingredients: baseMeals["Bedtime Drink"].ingredients, benefits: baseMeals["Bedtime Drink"].benefits }
    ];

    const newPlan = {
      id: `plan-active-${Date.now()}`,
      planName: `Customized ${lookupDosha}-Pacifying Nutrition Plan`,
      doshaType: updatedProfile.doshaType,
      goal: healthGoal || "General Well-being",
      dailyCalories: calTarget,
      duration: "30 Days",
      meals: generatedMeals,
      nutritionSummary: {
        calories: calTarget,
        protein: p,
        carbs: c,
        fats: f,
        waterTarget: 2500
      }
    };
    dietModel.setDietPlan(newPlan);

    const history = dietModel.getDietHistory();
    history.unshift({
      id: newPlan.id,
      planName: newPlan.planName,
      dateGenerated: new Date().toISOString().split('T')[0],
      goal: newPlan.goal,
      calories: newPlan.dailyCalories,
      duration: newPlan.duration
    });

    res.status(201).json({ success: true, data: newPlan });
  } catch (err) {
    next(err);
  }
};
