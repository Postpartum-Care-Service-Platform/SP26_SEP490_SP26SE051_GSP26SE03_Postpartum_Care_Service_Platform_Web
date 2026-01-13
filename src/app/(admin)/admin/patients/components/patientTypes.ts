import type { FamilyProfile } from '@/types/family-profile';

export type PatientStatus = 'Stable' | 'Under Observation' | 'Recovering' | 'Critical';

export type Patient = {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: 'Male' | 'Female';
  contact: string;
  address: string;
  status: PatientStatus;
};

export type { FamilyProfile };

