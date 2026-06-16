import { Treatment, TreatmentCategory } from '../types';
import { MOCK_TREATMENTS, MOCK_TREATMENT_CATEGORIES } from './apiService';


export interface TreatmentResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}


export const treatmentApi = {
  getTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
      return { data: MOCK_TREATMENTS, isFallback: true };
  },

  getTreatmentById: async (id: string): Promise<TreatmentResponse<Treatment | undefined>> => {
      const found = MOCK_TREATMENTS.find(t => t.id === id || t.slug === id);
      return { data: found, isFallback: true };
  },

  getTreatmentCategories: async (): Promise<TreatmentResponse<TreatmentCategory[]>> => {
      return { data: MOCK_TREATMENT_CATEGORIES, isFallback: true };
  },

  getPopularTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
      const popular = MOCK_TREATMENTS.filter(t => t.rating >= 4.9);
      return { data: popular, isFallback: true };
  },

  getRecommendedTreatments: async (): Promise<TreatmentResponse<Treatment[]>> => {
      const recommended = MOCK_TREATMENTS.slice(4, 9);
      return { data: recommended, isFallback: true };
  }
};

export default treatmentApi;




