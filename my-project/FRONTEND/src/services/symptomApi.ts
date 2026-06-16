import { SymptomRecord } from '../types';


export interface SymptomsApiResponse {
  data: SymptomRecord[];
  isFallback: boolean;
  error?: string;
}


const MOCK_SYMPTOMS_LOCAL: SymptomRecord[] = [
  { id: "sym-1", symptom: "Knee Joint Stiffness", severity: "Moderate", status: "Improving", recordedDate: "2026-05-15", improvementPercentage: 65 },
  { id: "sym-2", symptom: "Localized Swelling", severity: "Mild", status: "Improving", recordedDate: "2026-05-18", improvementPercentage: 80 },
  { id: "sym-3", symptom: "Radiating Muscle Ache", severity: "Mild", status: "Stable", recordedDate: "2026-05-20", improvementPercentage: 40 }
];

export const symptomApi = {
  getSymptoms: async (): Promise<SymptomsApiResponse> => {
      return { data: MOCK_SYMPTOMS_LOCAL, isFallback: true };
  }
};

export default symptomApi;




