import { Prescription, ApiResponse } from '../types';



// Offline Sandbox Local Fallbacks
const MOCK_PRESCRIPTIONS_LOCAL: Prescription[] = [
  {
    id: "pr-1",
    doctorName: "Dr. Vikram Chauhan",
    date: "2026-05-15",
    medicines: [
      { name: "Rasnasaptak Kwath (Decoction)", dosage: "30 ml", frequency: "Twice daily (before meals)" },
      { name: "Yogaraj Guggulu tablets", dosage: "2 tablets", frequency: "Twice daily (after meals)" },
      { name: "Ksheerabala Taila drops", dosage: "2 drops", frequency: "Each nostril (Pratimarsha Nasya)" }
    ],
    duration: "30 Days",
    notes: "Consume herbs with warm water only. Avoid wheat, refined sugar, and cold items."
  },
  {
    id: "pr-2",
    doctorName: "Dr. Smita Naram",
    date: "2026-04-12",
    medicines: [
      { name: "Kanchnar Guggulu tablets", dosage: "2 tablets", frequency: "Twice daily (after meals)" },
      { name: "Shatavari Powder", dosage: "3g", frequency: "Once daily (at bedtime with warm milk)" }
    ],
    duration: "60 Days",
    notes: "Focus on cooling pranayama and maintain early sleep schedules (before 10:30 PM)."
  }
];

export const prescriptionApi = {
  getPrescriptions: async (): Promise<ApiResponse<Prescription[]>> => {
      return { data: MOCK_PRESCRIPTIONS_LOCAL, isFallback: true };
  }
};

export default prescriptionApi;




