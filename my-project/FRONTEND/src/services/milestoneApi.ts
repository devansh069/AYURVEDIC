import { MilestoneRecord } from '../types';


export interface MilestonesApiResponse {
  data: MilestoneRecord[];
  isFallback: boolean;
  error?: string;
}


const MOCK_MILESTONES_LOCAL: MilestoneRecord[] = [
  { id: "ms-1", title: "Initial Diagnosis", description: "Pulse-diagnosis read as Vata accumulation in joint junctions.", date: "2026-05-15", status: "Completed" },
  { id: "ms-2", title: "Janu Basti Initiation", description: "Starting localized warm oil retaining therapy on knee joints.", date: "2026-05-20", status: "Completed" },
  { id: "ms-3", title: "Agni (Digestive Fire) Rebalance", description: "Achieved stable morning appetite and zero toxin buildup.", date: "2026-06-01", status: "Completed" },
  { id: "ms-4", title: "Mobility Evaluation Check", description: "Re-evaluating knee flexion degrees and pain indices.", date: "2026-06-12", status: "Pending" },
  { id: "ms-5", title: "Rejuvenation (Rasayana) Stage", description: "Starting post-detox cellular nourishing tonics.", date: "2026-06-15", status: "Upcoming" }
];

export const milestoneApi = {
  getMilestones: async (): Promise<MilestonesApiResponse> => {
      return { data: MOCK_MILESTONES_LOCAL, isFallback: true };
  }
};

export default milestoneApi;




