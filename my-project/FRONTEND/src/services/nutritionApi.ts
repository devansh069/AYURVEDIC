// nutritionApi.ts — Pure mock-data service (no backend required)
import { NutritionSummary, ProgressMetric, ApiResponse } from '../types';

export const MOCK_NUTRITION_SUMMARY_LOCAL: NutritionSummary = {
  calories: 1690,
  protein: 65,
  carbs: 230,
  fats: 45,
  waterTarget: 2500
};

export const MOCK_DIET_PROGRESS_LOCAL: ProgressMetric[] = [
  { date: "2026-05-12", weight: 64.0, bmi: 23.5, adherenceRate: 75 },
  { date: "2026-05-26", weight: 63.2, bmi: 23.2, adherenceRate: 85 },
  { date: "2026-06-12", weight: 62.0, bmi: 22.8, adherenceRate: 92 }
];

export interface NutritionDataResponse {
  summary: NutritionSummary;
  progress: ProgressMetric[];
}

export const nutritionApi = {
  getNutrition: async (): Promise<ApiResponse<NutritionDataResponse>> => {
    return {
      data: {
        summary: MOCK_NUTRITION_SUMMARY_LOCAL,
        progress: MOCK_DIET_PROGRESS_LOCAL
      },
      isFallback: true
    };
  }
};

export default nutritionApi;
