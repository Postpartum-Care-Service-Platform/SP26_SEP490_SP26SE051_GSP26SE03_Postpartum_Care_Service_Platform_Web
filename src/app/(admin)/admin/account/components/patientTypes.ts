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
  // 'true' if email verified, 'false' otherwise
  status: 'true' | 'false';
  // Account ID to fetch profiles
  accountId: string;
};

export type { FamilyProfile };

