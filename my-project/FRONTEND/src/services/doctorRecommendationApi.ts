import { Doctor } from '../types';
import { MOCK_DOCTORS } from './apiService';


export interface DoctorRecommendationResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}


export const doctorRecommendationApi = {
  getRecommendedDoctors: async (treatmentId: string): Promise<DoctorRecommendationResponse<Doctor[]>> => {
      
      // Filter MOCK_DOCTORS using local rule matching
      const idStr = treatmentId.toLowerCase();
      
      const matched = MOCK_DOCTORS.filter(doc => {
        const spec = doc.specialization.toLowerCase();
        const exp = doc.specialExpertise.map(e => e.toLowerCase());
        
        // Match general categories
        const matchesPanchakarma = idStr.includes("panch") || idStr.includes("vamana") || idStr.includes("virechana") || idStr.includes("basti") || idStr.includes("nasya") || idStr.includes("rakta");
        const matchesDetox = idStr.includes("detox") || idStr.includes("abhyanga") || idStr.includes("udvartana");
        const matchesHerbal = idStr.includes("herb");
        const matchesYoga = idStr.includes("yoga") || idStr.includes("stress");
        
        const docMatchesPanchakarma = spec.includes("panchakarma") || spec.includes("detox");
        const docMatchesHerbal = spec.includes("herbal") || spec.includes("pharma") || spec.includes("medicine");
        const docMatchesYoga = spec.includes("yoga") || spec.includes("lifestyle") || spec.includes("mind") || spec.includes("general");
        
        if (matchesPanchakarma && docMatchesPanchakarma) return true;
        if (matchesDetox && docMatchesPanchakarma) return true;
        if (matchesHerbal && docMatchesHerbal) return true;
        if (matchesYoga && docMatchesYoga) return true;
        
        return spec.includes("general") || spec.includes("kayachikitsa") || exp.some(e => e.includes(idStr));
      });

      const fallback = matched.length > 0 ? matched.slice(0, 6) : MOCK_DOCTORS.slice(0, 6);
      return { data: fallback, isFallback: true };
  }
};

export default doctorRecommendationApi;




