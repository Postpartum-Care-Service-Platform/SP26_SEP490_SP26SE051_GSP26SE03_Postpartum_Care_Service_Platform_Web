export interface HealthCondition {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  appliesTo: string;
  createdAt: string;
  updatedAt: string;
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
export interface HealthConditionCategory {
  id: number;
  name: string;
  description: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
