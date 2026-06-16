import axios from 'axios';
import { MedicalRecord, Activity, HealthInsight, ApiResponse } from '../types';

const BACKEND_URL = '';

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1500
});

// Offline Sandbox Local Fallbacks
const MOCK_DOCUMENTS_LOCAL: MedicalRecord[] = [
  {
    id: "rec-1",
    title: "Thyroid Profile Blood Test",
    category: "Lab Test",
    type: "Report",
    date: "2026-05-18",
    doctorName: "Dr. Vikram Chauhan",
    clinicName: "AyuCare Clinic, New Delhi",
    fileType: "PDF",
    fileSize: "2.4 MB",
    description: "T3, T4, and TSH levels measured to evaluate thyroid metabolic balance.",
    status: "Completed",
    fileUrl: "#"
  },
  {
    id: "rec-2",
    title: "Vata-Reducing Herbal Decoction Guide",
    category: "Prescription",
    type: "Prescription",
    date: "2026-05-15",
    doctorName: "Dr. Vikram Chauhan",
    clinicName: "AyuCare Clinic, New Delhi",
    fileType: "PDF",
    fileSize: "840 KB",
    description: "Complete prescription sheet mapping Rasnasaptak Kwath and Yogaraj Guggulu dosage timings.",
    status: "Completed",
    fileUrl: "#"
  },
  {
    id: "rec-3",
    title: "PCOS Hormone Analysis Summary",
    category: "Report",
    type: "Report",
    date: "2026-04-12",
    doctorName: "Dr. Smita Naram",
    clinicName: "Ayushya Panchakarma Center",
    fileType: "PDF",
    fileSize: "1.8 MB",
    description: "Detailed estrogen, progesterone, and LH/FSH ratios analysis.",
    status: "Completed",
    fileUrl: "#"
  },
  {
    id: "rec-4",
    title: "Knee Joint Flexion X-Ray",
    category: "Report",
    type: "Document",
    date: "2026-05-10",
    doctorName: "Dr. Anjali Mehta",
    clinicName: "Vedic Ortho Wellness",
    fileType: "Image",
    fileSize: "4.2 MB",
    description: "Radiograph of bilateral knee joint gaps to measure cartilage erosion.",
    status: "Completed",
    fileUrl: "#"
  },
  {
    id: "rec-5",
    title: "Panchakarma Treatment Invoice",
    category: "Invoice",
    type: "Document",
    date: "2026-05-30",
    doctorName: "Dr. Smita Naram",
    clinicName: "Ayushya Panchakarma Center",
    fileType: "PDF",
    fileSize: "512 KB",
    description: "Bill invoice for 7-day Abhyanga and Virechana treatment packages.",
    status: "Completed",
    fileUrl: "#"
  }
];

const MOCK_ACTIVITIES_LOCAL: Activity[] = [
  { id: "act-1", title: "Document Uploaded", type: "Upload", timestamp: "Today, 10:30 AM", details: "Uploaded Thyroid Profile Blood Test PDF." },
  { id: "act-2", title: "Prescription Downloaded", type: "Download", timestamp: "Yesterday, 04:15 PM", details: "Downloaded Vata-Reducing Herbal Decoction Guide." },
  { id: "act-3", title: "Clinic Consultation Visit", type: "Visit", timestamp: "2026-05-20", details: "Consultation with Dr. Vikram Chauhan for Knee pain evaluation." },
  { id: "act-4", title: "Lab Report Added", type: "New Report", timestamp: "2026-05-18", details: "New Thyroid profile laboratory values synced." }
];

const MOCK_INSIGHTS_LOCAL: HealthInsight[] = [
  { id: "in-1", title: "Joint Mobility Progress", description: "Joint range has increased from 90° to 135° after completing Janu Basti series.", category: "Progress" },
  { id: "in-2", title: "Hormonal Balance Trend", description: "LH/FSH ratio is stabilizing towards a 1.5:1 ratio post Virechana.", category: "Trend" },
  { id: "in-3", title: "Vaidya Diet Recommendation", description: "Strictly avoid yogurt, sour buttermilk, and overnight-soaked legumes.", category: "Recommendation" },
  { id: "in-4", title: "Follow-up Suggestion", description: "Schedule a pulse-diagnostic review with Dr. Vikram Chauhan around June 15.", category: "Suggestion" }
];

export const medicalRecordApi = {
  getRecords: async (): Promise<ApiResponse<MedicalRecord[]>> => {
      return { data: MOCK_DOCUMENTS_LOCAL, isFallback: true };
  },

  getRecordById: async (id: string): Promise<ApiResponse<MedicalRecord>> => {
      const found = MOCK_DOCUMENTS_LOCAL.find(d => d.id === id);
      if (found) {
        return { data: found, isFallback: true };
      }
      throw new Error('Record not found offline');
  },

  uploadRecord: async (data: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> => {
      const newRecord: MedicalRecord = {
        id: `rec-${Date.now()}`,
        title: data.title || "New Document",
        category: data.category || "Report",
        type: data.category === "Prescription" ? "Prescription" : data.category === "Report" ? "Report" : "Document",
        date: data.date || new Date().toISOString().split('T')[0],
        doctorName: data.doctorName || "Consulting Vaidya",
        clinicName: data.clinicName || "Self Uploaded Clinic Center",
        fileType: data.fileType || "PDF",
        fileSize: data.fileSize || "1.2 MB",
        description: data.description || "Uploaded in sandbox mode.",
        status: "Completed",
        fileUrl: "#"
      };
      MOCK_DOCUMENTS_LOCAL.unshift(newRecord);
      
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        title: "Document Uploaded",
        type: "Upload",
        timestamp: "Just Now",
        details: `Uploaded ${newRecord.title} (${newRecord.fileType}).`
      };
      MOCK_ACTIVITIES_LOCAL.unshift(newAct);

      return { data: newRecord, isFallback: true };
  },

  deleteRecord: async (id: string): Promise<ApiResponse<MedicalRecord>> => {
      const idx = MOCK_DOCUMENTS_LOCAL.findIndex(d => d.id === id);
      if (idx !== -1) {
        const deleted = MOCK_DOCUMENTS_LOCAL.splice(idx, 1)[0];
        const newAct: Activity = {
          id: `act-${Date.now()}`,
          title: "Document Deleted",
          type: "Download",
          timestamp: "Just Now",
          details: `Deleted ${deleted.title}.`
        };
        MOCK_ACTIVITIES_LOCAL.unshift(newAct);
        return { data: deleted, isFallback: true };
      }
      throw new Error('Record not found offline');
  },

  getActivities: async (): Promise<ApiResponse<Activity[]>> => {
      return { data: MOCK_ACTIVITIES_LOCAL, isFallback: true };
  },

  getInsights: async (): Promise<ApiResponse<HealthInsight[]>> => {
      return { data: MOCK_INSIGHTS_LOCAL, isFallback: true };
  }
};

export default medicalRecordApi;



