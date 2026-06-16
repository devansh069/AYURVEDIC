// treatmentDetailsApi.ts — Pure mock-data service (no backend required)
import { Treatment, TreatmentFAQ, RecoveryMilestone, PersonalizedPlan } from '../types';
import { MOCK_TREATMENTS } from './apiService';

export interface TreatmentDetailsResponse<T> {
  data: T;
  isFallback: boolean;
  error?: string;
}

export const treatmentDetailsApi = {
  getTreatmentById: async (id: string): Promise<TreatmentDetailsResponse<Treatment | undefined>> => {
    const found = MOCK_TREATMENTS.find(t => t.id === id || t.slug === id);
    return { data: found, isFallback: true };
  },

  getTreatmentFaqs: async (id: string): Promise<TreatmentDetailsResponse<TreatmentFAQ[]>> => {
    const found = MOCK_TREATMENTS.find(t => t.id === id || t.slug === id);
    return { data: found ? found.faq : [], isFallback: true };
  },

  getTreatmentRecoveryTimeline: async (id: string): Promise<TreatmentDetailsResponse<RecoveryMilestone[]>> => {
    const found = MOCK_TREATMENTS.find(t => t.id === id || t.slug === id);
    const timelineName = found ? found.name : 'Treatment';
    const fallbackTimeline: RecoveryMilestone[] = [
      { step: "Week 1", description: `Primary response initiation. Digestive adjustments and body adapting to the therapeutic inputs of ${timelineName}.` },
      { step: "Week 2", description: `Active channel purification. Cleansing of toxins (Ama) starts, which might cause mild healing fatigue.` },
      { step: "Week 4", description: `Dosha stabilization and system rebalancing. Notable improvement in digestive fire (Agni) and general energy.` },
      { step: "Month 2", description: `Deep tissue (Dhatu) rejuvenation and cell repair. Targeted chronic symptoms begin to fade.` },
      { step: "Month 3", description: "Establishment of dynamic health balance, complete vitality, and ongoing maintenance through seasonal diet guidelines." }
    ];
    return { data: fallbackTimeline, isFallback: true };
  },

  getPersonalizedPlan: async (
    id: string,
    age: number,
    goal: string,
    dosha: string
  ): Promise<TreatmentDetailsResponse<PersonalizedPlan>> => {
    const found = MOCK_TREATMENTS.find(t => t.id === id || t.slug === id);
    const treatmentName = found ? found.name : 'Ayurvedic Treatment';

    let diet: string[] = [];
    let lifestyle: string[] = [];
    let timeline = "";
    const lowerDosha = dosha.toLowerCase();

    if (lowerDosha === "vata") {
      diet = [
        "Warm, freshly cooked grounding foods (basmati rice, warm soups, oats).",
        "Incorporate healthy fats like raw Ghee, sesame oil, and almond oil.",
        "Sweet, sour, and salty tastes; avoid dry, cold, or carbonated items."
      ];
      lifestyle = [
        "Perform a 10-minute self-Abhyanga massage with warm sesame oil before bathing.",
        "Practice 15 minutes of calming Nadi Shodhana (breath balancing) pranayama.",
        "Strict sleep hygiene: retire by 10:00 PM and protect your joints from cold drafts."
      ];
      timeline = "6 Weeks. Focus is on nourishing bodily tissues and grounding nervous energy.";
    } else if (lowerDosha === "pitta") {
      diet = [
        "Cooling, soothing, and moderately heavy foods (sweet fruits, leafy greens, coconut).",
        "Favor sweet, bitter, and astringent tastes; strictly avoid spicy, fried, or fermented foods.",
        "Drink refreshing herbal teas like peppermint, coriander seeds, or rose infusions."
      ];
      lifestyle = [
        "Massage the soles of your feet and scalp with organic coconut oil before bed.",
        "Practice sheetali (cooling breath) pranayama and light, non-competitive yoga.",
        "Avoid direct mid-day sun exposure and balance intense work cycles with leisure."
      ];
      timeline = "8 Weeks. Focus is on cooling metabolic fire, purifying the blood, and soothing skin/liver channels.";
    } else {
      diet = [
        "Warm, dry, light, and spicy foods (barley, quinoa, steamed vegetables).",
        "Favor spicy, bitter, and astringent tastes; restrict heavy dairy, sugars, and salt.",
        "Sip warm ginger-cinnamon tea throughout the day to boost sluggish metabolism."
      ];
      lifestyle = [
        "Perform dry skin brushing (Garshana) each morning to stimulate lymphatic circulation.",
        "Engage in 30-45 minutes of active, vigorous physical yoga or brisk walking.",
        "Avoid daytime sleeping, keep warm, and maintain a highly active daily routine."
      ];
      timeline = "12 Weeks. Focus is on reducing tissue congestion, eliminating excess phlegm/fat, and accelerating internal heat.";
    }

    const plan: PersonalizedPlan = {
      patientAge: age,
      healthGoal: goal,
      doshaType: dosha.charAt(0).toUpperCase() + dosha.slice(1),
      suggestedTherapy: `${treatmentName} specialized protocol`,
      suggestedDiet: diet,
      suggestedLifestyle: lifestyle,
      expectedTimeline: timeline
    };

    return { data: plan, isFallback: true };
  }
};

export default treatmentDetailsApi;
