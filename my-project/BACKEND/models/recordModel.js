// BACKEND/models/recordModel.js

const MOCK_PATIENT_RECORDS = [
  {
    id: "rec-doc-1",
    title: "Thyroid & Doshic Profile Blood Test",
    type: "Report",
    date: "2026-05-18",
    doctorName: "Dr. Vikram Chauhan",
    fileSize: "2.4 MB",
    fileUrl: "#"
  },
  {
    id: "rec-doc-2",
    title: "PCOS Hormone Analysis Summary",
    type: "Report",
    date: "2026-04-12",
    doctorName: "Dr. Smita Naram",
    fileSize: "1.8 MB",
    fileUrl: "#"
  },
  {
    id: "rec-doc-3",
    title: "Vata-Reducing Herbal Decoction Guide",
    type: "Prescription",
    date: "2026-05-15",
    doctorName: "Dr. Vikram Chauhan",
    fileSize: "840 KB",
    fileUrl: "#"
  }
];

const MOCK_PATIENT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Upcoming Consultation Alert",
    message: "Your appointment with Dr. Vikram Chauhan is in 3 days. Prepare your updated diet logs.",
    date: "2026-06-12",
    type: "Appointment"
  },
  {
    id: "notif-2",
    title: "Morning Kashayam Reminder",
    message: "Time to consume your Dashamula decoction (empty stomach) for optimal metabolic fire.",
    date: "2026-06-12",
    type: "Reminder"
  },
  {
    id: "notif-3",
    title: "Daily Health Tip",
    message: "Avoid drinking ice-cold water during or immediately after meals as it dampens Agni (digestive fire).",
    date: "2026-06-11",
    type: "Tip"
  }
];

const MOCK_AI_RECOMMENDATIONS = {
  suggestedDiet: [
    "Warm cooked grains (Quinoa, Barley, Brown Rice).",
    "Favor bitter, pungent, and astringent tastes to pacify Kapha.",
    "Avoid raw salads and heavy cold dairy after sunset."
  ],
  recommendedTreatment: "Shirodhara (3 sessions) for stress reduction and hormonal alignment.",
  lifestyleTips: [
    "Practice cooling breath Sheetali pranayama for 10 minutes daily.",
    "Retire to bed by 10:30 PM to optimize Pitta liver detox cycles.",
    "Daily gentle self-Abhyanga foot massage with organic coconut oil."
  ],
  doctorFollowUpReminder: "Schedule standard diagnostic checkup with Dr. Vikram Chauhan in 3 weeks."
};

const MOCK_DOCUMENTS = [
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

const MOCK_PRESCRIPTIONS = [
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

const MOCK_LAB_REPORTS = [
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

const MOCK_TREATMENT_HISTORY = [
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

const MOCK_ACTIVITIES = [
  { id: "act-1", title: "Document Uploaded", type: "Upload", timestamp: "Today, 10:30 AM", details: "Uploaded Thyroid Profile Blood Test PDF." },
  { id: "act-2", title: "Prescription Downloaded", type: "Download", timestamp: "Yesterday, 04:15 PM", details: "Downloaded Vata-Reducing Herbal Decoction Guide." },
  { id: "act-3", title: "Clinic Consultation Visit", type: "Visit", timestamp: "2026-05-20", details: "Consultation with Dr. Vikram Chauhan for Knee pain evaluation." },
  { id: "act-4", title: "Lab Report Added", type: "New Report", timestamp: "2026-05-18", details: "New Thyroid profile laboratory values synced." }
];

const MOCK_INSIGHTS = [
  { id: "in-1", title: "Joint Mobility Progress", description: "Joint range has increased from 90° to 135° after completing Janu Basti series.", category: "Progress" },
  { id: "in-2", title: "Hormonal Balance Trend", description: "LH/FSH ratio is stabilizing towards a 1.5:1 ratio post Virechana.", category: "Trend" },
  { id: "in-3", title: "Vaidya Diet Recommendation", description: "Strictly avoid yogurt, sour buttermilk, and overnight-soaked legumes.", category: "Recommendation" },
  { id: "in-4", title: "Follow-up Suggestion", description: "Schedule a pulse-diagnostic review with Dr. Vikram Chauhan around June 15.", category: "Suggestion" }
];

module.exports = {
  MOCK_PATIENT_RECORDS,
  MOCK_PATIENT_NOTIFICATIONS,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_DOCUMENTS,
  MOCK_PRESCRIPTIONS,
  MOCK_LAB_REPORTS,
  MOCK_TREATMENT_HISTORY,
  MOCK_ACTIVITIES,
  MOCK_INSIGHTS
};
