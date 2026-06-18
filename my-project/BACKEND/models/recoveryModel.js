// BACKEND/models/recoveryModel.js

const MOCK_PATIENT_RECOVERY = {
  id: "rec-1",
  condition: "PCOS & Metabolic Imbalance",
  progress: 72,
  startDate: "2026-04-10",
  expectedCompletion: "2026-08-10",
  weeklyMetrics: [
    { name: "Wk 1", progress: 10, target: 15 },
    { name: "Wk 2", progress: 25, target: 30 },
    { name: "Wk 3", progress: 42, target: 45 },
    { name: "Wk 4", progress: 55, target: 60 },
    { name: "Wk 5", progress: 62, target: 70 },
    { name: "Wk 6", progress: 72, target: 80 }
  ],
  monthlyMetrics: [
    { name: "Apr", progress: 30, target: 40 },
    { name: "May", progress: 60, target: 70 },
    { name: "Jun", progress: 72, target: 80 }
  ]
};

const MOCK_PATIENT_WELLNESS = {
  dietAdherence: 85,
  exerciseProgress: 90,
  sleepQuality: 80,
  waterIntake: 75
};

const MOCK_HEALTH_GOALS = [
  { id: "goal-1", title: "Weight Management", progress: 68, target: "Reduce Kapha weight by 5kg" },
  { id: "goal-2", title: "PCOS Management", progress: 75, target: "Cycle regularity & hormonal balance" },
  { id: "goal-3", title: "Stress Reduction", progress: 80, target: "Increase mindfulness and sleep hours" }
];

const MOCK_RECOVERY_PROFILE = {
  id: "rec-101",
  patientName: "Priyanshi Sharma",
  condition: "Chronic Joint Inflammation (Sandhivata)",
  doctorName: "Dr. Vikram Chauhan",
  treatmentPlan: "30-Day Janu Basti & Vata Pacifying Regimen",
  startDate: "2026-05-15",
  expectedRecoveryDate: "2026-06-15",
  currentStage: "Active Detoxification",
  completionPercentage: 75
};

const MOCK_RECOVERY_PROGRESS_POINTS = [
  { id: "1", week: "Wk 1", progressPercentage: 20, healthScore: 55, energyLevel: 40, sleepQuality: 50, stressLevel: 80 },
  { id: "2", week: "Wk 2", progressPercentage: 45, healthScore: 68, energyLevel: 60, sleepQuality: 65, stressLevel: 60 },
  { id: "3", week: "Wk 3", progressPercentage: 62, healthScore: 75, energyLevel: 75, sleepQuality: 75, stressLevel: 45 },
  { id: "4", week: "Wk 4", progressPercentage: 75, healthScore: 84, energyLevel: 85, sleepQuality: 80, stressLevel: 30 }
];

const MOCK_RECOVERY_SYMPTOMS = [
  { id: "sym-1", symptom: "Knee Joint Stiffness", severity: "Moderate", status: "Improving", recordedDate: "2026-05-15", improvementPercentage: 65 },
  { id: "sym-2", symptom: "Localized Swelling", severity: "Mild", status: "Improving", recordedDate: "2026-05-18", improvementPercentage: 80 },
  { id: "sym-3", symptom: "Radiating Muscle Ache", severity: "Mild", status: "Stable", recordedDate: "2026-05-20", improvementPercentage: 40 }
];

const MOCK_RECOVERY_MILESTONES = [
  { id: "ms-1", title: "Initial Diagnosis", description: "Pulse-diagnosis read as Vata accumulation in joint junctions.", date: "2026-05-15", status: "Completed" },
  { id: "ms-2", title: "Janu Basti Initiation", description: "Starting localized warm oil retaining therapy on knee joints.", date: "2026-05-20", status: "Completed" },
  { id: "ms-3", title: "Agni (Digestive Fire) Rebalance", description: "Achieved stable morning appetite and zero toxin buildup.", date: "2026-06-01", status: "Completed" },
  { id: "ms-4", title: "Mobility Evaluation Check", description: "Re-evaluating knee flexion degrees and pain indices.", date: "2026-06-12", status: "Pending" },
  { id: "ms-5", title: "Rejuvenation (Rasayana) Stage", description: "Starting post-detox cellular nourishing tonics.", date: "2026-06-15", status: "Upcoming" }
];

const MOCK_RECOVERY_MEDICATIONS = [
  { id: "med-1", name: "Rasnasaptak Kwath (Decoction)", dosage: "30 ml", frequency: "Twice daily (before meals)", completed: true, reminderActive: true },
  { id: "med-2", name: "Yogaraj Guggulu tablets", dosage: "2 tablets", frequency: "Twice daily (after meals)", completed: false, reminderActive: true },
  { id: "med-3", name: "Ksheerabala Taila drops", dosage: "2 drops", frequency: "Each nostril (Pratimarsha Nasya)", completed: true, reminderActive: false }
];

const MOCK_RECOVERY_LIFESTYLE = [
  { id: "l-1", name: "Diet Compliance", target: 100, current: 85, unit: "%", compliancePercentage: 85 },
  { id: "l-2", name: "Yoga (Gentle Stretches)", target: 30, current: 25, unit: "mins", compliancePercentage: 83 },
  { id: "l-3", name: "Meditation Session", target: 20, current: 20, unit: "mins", compliancePercentage: 100 },
  { id: "l-4", name: "Water Hydration", target: 2.5, current: 2.0, unit: "L", compliancePercentage: 80 },
  { id: "l-5", name: "Sleep Hours", target: 8, current: 7.5, unit: "hrs", compliancePercentage: 93 }
];

const MOCK_RECOVERY_WELLNESS_SCORE = {
  overall: 78,
  physical: 74,
  mental: 82,
  lifestyle: 80
};

const MOCK_RECOVERY_ACHIEVEMENTS = [
  { id: "ach-1", title: "7 Days Consistency", description: "Completed all organic herb schedules for 7 consecutive days.", icon: "Flame", unlockedDate: "2026-05-22" },
  { id: "ach-2", title: "Treatment Milestone", description: "Completed the active Janu Basti oil retaining phase.", icon: "Shield", unlockedDate: "2026-05-30" },
  { id: "ach-3", title: "30 Days Healing Journey", description: "Completed a full month of conscious dosha balancing.", icon: "Award" },
  { id: "ach-4", title: "Agni Purified", description: "Achieved optimal digestive fire consistency index.", icon: "Sparkles" }
];

const MOCK_RECOVERY_JOURNAL = [
  { id: "j-1", date: "2026-06-11", notes: "Knee stiffness was barely noticeable this morning. Appetite is strong. Felt calm after evening pranayama.", mood: "Great", healthFeedback: "Significant ease in joint mobility" },
  { id: "j-2", date: "2026-06-10", notes: "Slight gas after dinner, but sleep was deep and undisturbed. Did gentle joint rotations.", mood: "Good", healthFeedback: "Stable progression" }
];

module.exports = {
  MOCK_PATIENT_RECOVERY,
  MOCK_PATIENT_WELLNESS,
  MOCK_HEALTH_GOALS,
  MOCK_RECOVERY_PROFILE,
  MOCK_RECOVERY_PROGRESS_POINTS,
  MOCK_RECOVERY_SYMPTOMS,
  MOCK_RECOVERY_MILESTONES,
  MOCK_RECOVERY_MEDICATIONS,
  MOCK_RECOVERY_LIFESTYLE,
  MOCK_RECOVERY_WELLNESS_SCORE,
  MOCK_RECOVERY_ACHIEVEMENTS,
  MOCK_RECOVERY_JOURNAL
};
