export interface HealthCondition {
  id: number;
  name: string;
  category: string;
  appliesTo: string;
}

export interface HealthRecord {
  id: number;
  familyProfileId: number;
  familyProfileName: string;
  weight: number;
  height: number;
  temperature: number;
  generalCondition: string;
  note: string;
  recordDate: string;
  gestationalAgeWeeks?: number;
  birthWeightGrams?: number;
  conditions: HealthCondition[];
}
