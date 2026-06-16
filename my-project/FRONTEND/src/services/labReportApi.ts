import { LabReport, TreatmentHistory, ApiResponse } from '../types';



// Offline Sandbox Local Fallbacks
const MOCK_LAB_REPORTS_LOCAL: LabReport[] = [
  {
    id: "lr-1",
    testName: "Thyroid Profile Blood Test",
    date: "2026-05-18",
    result: "TSH: 2.8 uIU/mL (Normal), T3: 1.2 ng/mL, T4: 8.5 ug/dL",
    status: "Normal",
    doctorName: "Dr. Vikram Chauhan"
  },
  {
    id: "lr-2",
    testName: "Hormone Level LHS/FSH Ratio",
    date: "2026-04-12",
    result: "LH: 12.4 mIU/mL, FSH: 4.8 mIU/mL (Ratio 2.6:1 - Elevated)",
    status: "Abnormal",
    doctorName: "Dr. Smita Naram"
  },
  {
    id: "lr-3",
    testName: "Serum Uric Acid levels",
    date: "2026-05-14",
    result: "Uric Acid: 8.2 mg/dL (High)",
    status: "Critical",
    doctorName: "Dr. Anjali Mehta"
  }
];

const MOCK_TREATMENT_HISTORY_LOCAL: TreatmentHistory[] = [
  {
    id: "th-1",
    treatmentName: "Janu Basti (Knee Oil Therapy)",
    doctorName: "Dr. Vikram Chauhan",
    clinicName: "AyuCare Clinic, New Delhi",
    startDate: "2026-05-20",
    endDate: "2026-05-27",
    status: "Completed"
  },
  {
    id: "th-2",
    treatmentName: "Virechana (Therapeutic Purgation)",
    doctorName: "Dr. Smita Naram",
    clinicName: "Ayushya Panchakarma Center",
    startDate: "2026-04-15",
    endDate: "2026-04-20",
    status: "Completed"
  },
  {
    id: "th-3",
    treatmentName: "Pratimarsha Nasya (Nasal Therapy)",
    doctorName: "Dr. Vikram Chauhan",
    clinicName: "AyuCare Clinic, New Delhi",
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    status: "Ongoing"
  }
];

export const labReportApi = {
  getLabReports: async (): Promise<ApiResponse<LabReport[]>> => {
      return { data: MOCK_LAB_REPORTS_LOCAL, isFallback: true };
  },

  getTreatmentHistory: async (): Promise<ApiResponse<TreatmentHistory[]>> => {
      return { data: MOCK_TREATMENT_HISTORY_LOCAL, isFallback: true };
  }
};

export default labReportApi;




