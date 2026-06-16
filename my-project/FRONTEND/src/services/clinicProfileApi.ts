import { Clinic, ClinicReview, GalleryImage, Service } from '../types';
import { MOCK_CLINICS } from './apiService';


export interface ClinicApiResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}


export const clinicProfileApi = {
  getClinicById: async (id: string): Promise<ClinicApiResponse<Clinic | undefined>> => {
      const found = MOCK_CLINICS.find(c => c.id === id);
      return { data: found, isFallback: true };
  },

  getClinicReviews: async (id: string): Promise<ClinicApiResponse<ClinicReview[]>> => {
      const mockReviews = [
        {
          id: `rev-${id}-1`,
          clinicId: id,
          patientName: "Amit Verma",
          rating: 5,
          comment: "Excellent experience! The therapists are highly skilled. I underwent a Panchakarma cycle and feel entirely revitalized.",
          date: "2026-06-01",
          recoveryResult: "Underwent 7-day Panchakarma; resolved chronic bloating and low back stiffness."
        },
        {
          id: `rev-${id}-2`,
          clinicId: id,
          patientName: "Sunita Deshmukh",
          rating: 4,
          comment: "Very clean and hygienic rooms. The doctor spent 30 minutes reading my pulse and analyzing my dosha. The custom oils are very therapeutic.",
          date: "2026-05-24",
          recoveryResult: "Completed Shirodhara therapy; migraine frequency reduced from twice weekly to zero."
        }
      ];
      return { data: mockReviews, isFallback: true };
  },

  getClinicGallery: async (id: string): Promise<ClinicApiResponse<GalleryImage[]>> => {
      const found = MOCK_CLINICS.find(c => c.id === id);
      return { data: found?.gallery || [], isFallback: true };
  },

  getClinicServices: async (id: string): Promise<ClinicApiResponse<Service[]>> => {
      const clinic = MOCK_CLINICS.find(c => c.id === id);
      const allServicesDetails = [
        { id: 's-panch', name: 'Panchakarma', description: 'Classical fivefold detoxification and rejuvenation therapies.', icon: 'Activity' },
        { id: 's-abhy', name: 'Abhyanga', description: 'Warm herbal oil body massage to soothe Vata and lubricate tissues.', icon: 'Sparkles' },
        { id: 's-shir', name: 'Shirodhara', description: 'Pouring warm medicated liquid on the forehead to calm nervous pathways.', icon: 'Compass' },
        { id: 's-nasya', name: 'Nasya', description: 'Nasal drops of herbal oils to clear sinuses and tension headaches.', icon: 'Wind' },
        { id: 's-vaman', name: 'Vamana', description: 'Therapeutic vomiting targeting aggravated Kapha lung congestion.', icon: 'ShieldAlert' },
        { id: 's-virec', name: 'Virechana', description: 'Medicated purgation flushing metabolic heat from liver and blood.', icon: 'Droplets' },
        { id: 's-basti', name: 'Basti', description: 'Medicated enema balancing Vata in joints, bones, and colon.', icon: 'Home' },
        { id: 's-weight', name: 'Weight Management', description: 'Powder massages and custom nutrition resetting fat metabolism.', icon: 'Scale' },
        { id: 's-pcos', name: 'PCOS Care', description: 'Hormonal and reproductive systems stabilization with organic herbs.', icon: 'Heart' },
        { id: 's-diab', name: 'Diabetes Care', description: 'Pancreatic support herbs and doshic diets managing blood sugar.', icon: 'Activity' },
        { id: 's-stress', name: 'Stress Management', description: 'Autonomic nervous resets combining massages and adaptogens.', icon: 'Brain' }
      ];
      const services = clinic 
        ? allServicesDetails.filter(s => clinic.services.some(cs => cs.toLowerCase() === s.name.toLowerCase()))
        : allServicesDetails.slice(0, 3);
      return { data: services, isFallback: true };
  }
};

export default clinicProfileApi;




