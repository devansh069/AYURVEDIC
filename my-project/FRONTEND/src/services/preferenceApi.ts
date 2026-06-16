

export interface PreferencesModel {
  dietPreference: string;
  exercisePreference: string;
  wellnessGoals: string[];
  preferredDoctorType: string;
  communicationPreference: string;
}

export const MOCK_PREFERENCES: PreferencesModel = {
  dietPreference: 'Vegetarian',
  exercisePreference: 'Yoga & Walking',
  wellnessGoals: ['Weight Management', 'PCOS Recovery', 'Stress Reduction'],
  preferredDoctorType: 'Panchakarma Specialist',
  communicationPreference: 'WhatsApp',
};

export const preferenceApi = {
  async getPreferences(): Promise<{ data: PreferencesModel; isFallback: boolean }> {
      return { data: MOCK_PREFERENCES, isFallback: true };
  },

  async updatePreferences(prefs: Partial<PreferencesModel>): Promise<{ data: PreferencesModel; isFallback: boolean }> {
      return { data: { ...MOCK_PREFERENCES, ...prefs }, isFallback: true };
  }
};

export default preferenceApi;



