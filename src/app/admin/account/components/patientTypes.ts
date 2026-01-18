import type { FamilyProfile } from '@/types/family-profile';

export type Patient = {
  id: string;
  name: string;
  avatar?: string;
  username: string;
  email: string;
  dateOfBirth: string | null;
  age: number;
  gender: 'Male' | 'Female' | 'N/A';
  contact: string;
  address: string;
  role?: string;
  roleId?: number;
  // 'true' if email verified, 'false' otherwise
  status: PatientStatus;
  // Account ID to fetch profiles
  accountId: string;
};

export type PatientStatus = 'Stable' | 'Under Observation' | 'Recovering' | 'Critical';

export type { FamilyProfile };

