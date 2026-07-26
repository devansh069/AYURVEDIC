// FRONTEND/src/services/diseaseApi.ts
// Client-side API Service for Mongoose/MongoDB Disease backend.
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BACKEND_URL = 'http://localhost:5174/api';

// TypeScript Interfaces
export interface RecoveryTimeline {
  step: string;
  description: string;
  duration?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ModernData {
  wikiExtract?: string | null;
  wikiImage?: string | null;
  fdaApprovedDrugs?: string[];
  lastSynced?: string;
}

export interface Disease {
  _id?: string;
  id?: string; // fallback legacy alias
  name?: string; // fallback legacy alias
  diseaseName: string;
  slug: string;
  scientificName?: string;
  alternativeNames?: string[];
  category: string;
  subCategory?: string;
  overview?: string;
  description?: string;
  shortDescription?: string; // fallback legacy alias
  causes: string[];
  symptoms: string[];
  earlySymptoms?: string[];
  advancedSymptoms?: string[];
  riskFactors?: string[];
  complications?: string[];
  prevention?: string[];
  homeRemedies?: string[];
  ayurvedicTreatment?: string;
  treatments?: string[]; // fallback legacy alias
  modernTreatment?: string;
  recommendedHerbs: string[];
  recommendedMedicines?: string[];
  recommendedFoods?: string[];
  dietRecommendations?: string[]; // fallback legacy alias
  foodsToAvoid: string[];
  recommendedYoga?: string[];
  recommendedExercises?: string[];
  dailyRoutine?: string;
  sleepRecommendation?: string;
  stressManagement?: string;
  doshaAffected?: string[];
  bodyPartsAffected?: string[];
  ageGroup?: string;
  gender?: string;
  pregnancySafe?: boolean;
  contagious?: boolean;
  severity: 'Low' | 'Moderate' | 'High';
  recoveryTime?: string;
  consultDoctorWhen?: string;
  emergencyWarning?: string;
  successRate?: number;
  faq?: FAQ[]; // fallback legacy alias
  FAQs?: FAQ[];
  references?: string[];
  doctorSpecialization?: string;
  relatedDiseases?: string[];
  featuredImage?: string;
  image?: string; // fallback legacy alias
  galleryImages?: string[];
  videoLinks?: string[];
  rating?: number;
  totalViews?: number;
  totalBookmarks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiseaseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DiseaseResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000
});

// Adapter mapper to convert MongoDB response to legacy UI expectations
export const mapMongoToLegacyDisease = (d: any): Disease => {
  if (!d) return d;
  return {
    ...d,
    id: d._id || d.id,
    name: d.diseaseName || d.name || '',
    image: d.featuredImage || d.image || '',
    shortDescription: d.overview || d.shortDescription || '',
    treatments: Array.isArray(d.treatments) ? d.treatments : (d.ayurvedicTreatment ? [d.ayurvedicTreatment] : []),
    dietRecommendations: d.recommendedFoods || d.dietRecommendations || [],
    faq: d.FAQs || d.faq || []
  };
};

export const diseaseApi = {
  getDiseaseCategories: async (): Promise<DiseaseResponse<DiseaseCategory[]>> => {
    try {
      const res = await client.get('/disease-categories');
      return { data: res.data, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  getDiseases: async (params?: Record<string, any>): Promise<DiseaseResponse<Disease[]>> => {
    try {
      const res = await client.get('/diseases', { params });
      const items = res.data.success ? res.data.data : res.data;
      const mapped = (Array.isArray(items) ? items : []).map(mapMongoToLegacyDisease);
      return { 
        data: mapped, 
        isFallback: !!res.data.isFallback,
        pagination: res.data.pagination
      };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  getDiseaseBySlug: async (slug: string): Promise<DiseaseResponse<Disease | undefined>> => {
    try {
      const res = await client.get(`/diseases/${slug}`);
      return { data: mapMongoToLegacyDisease(res.data), isFallback: false };
    } catch (err: any) {
      return { data: undefined, isFallback: true, error: err.message };
    }
  },

  getPopularDiseases: async (): Promise<DiseaseResponse<Disease[]>> => {
    try {
      const res = await client.get('/diseases/popular');
      const mapped = (Array.isArray(res.data) ? res.data : []).map(mapMongoToLegacyDisease);
      return { data: mapped, isFallback: false };
    } catch (err: any) {
      return { data: [], isFallback: true, error: err.message };
    }
  },

  searchDiseases: async (q: string): Promise<Disease[]> => {
    try {
      const res = await client.get('/diseases/search', { params: { q } });
      return (Array.isArray(res.data) ? res.data : []).map(mapMongoToLegacyDisease);
    } catch (err) {
      return [];
    }
  },

  createDisease: async (disease: Omit<Disease, '_id' | 'id'>): Promise<Disease> => {
    const res = await client.post('/diseases', disease);
    return mapMongoToLegacyDisease(res.data.data);
  },

  updateDisease: async (id: string, disease: Partial<Disease>): Promise<Disease> => {
    const res = await client.put(`/diseases/${id}`, disease);
    return mapMongoToLegacyDisease(res.data.data);
  },

  deleteDisease: async (id: string): Promise<any> => {
    const res = await client.delete(`/diseases/${id}`);
    return res.data;
  }
};

// ─── React Query Hooks ───

export const useDiseaseCategories = () => {
  return useQuery({
    queryKey: ['diseaseCategories'],
    queryFn: () => diseaseApi.getDiseaseCategories()
  });
};

export const useDiseases = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['diseases', filters],
    queryFn: () => diseaseApi.getDiseases(filters),
    placeholderData: (previousData) => previousData
  });
};

export const useDiseaseDetail = (slug: string) => {
  return useQuery({
    queryKey: ['diseaseDetail', slug],
    queryFn: () => diseaseApi.getDiseaseBySlug(slug),
    enabled: !!slug
  });
};

export const usePopularDiseases = () => {
  return useQuery({
    queryKey: ['popularDiseases'],
    queryFn: () => diseaseApi.getPopularDiseases()
  });
};

export const useCreateDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newDisease: Omit<Disease, '_id' | 'id'>) => diseaseApi.createDisease(newDisease),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
    }
  });
};

export const useUpdateDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Disease> }) => diseaseApi.updateDisease(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
      queryClient.invalidateQueries({ queryKey: ['diseaseDetail', data.slug] });
    }
  });
};

export const useDeleteDisease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => diseaseApi.deleteDisease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
    }
  });
};

export default diseaseApi;
