import type { FamilyProfile } from './family-profile';

export interface Account {
  id: string;
  roleId: number;
  roleName: string;
  email: string;
  phone: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  ownerProfile: FamilyProfile | null;
}

