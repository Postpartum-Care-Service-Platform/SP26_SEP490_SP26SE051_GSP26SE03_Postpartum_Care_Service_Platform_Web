export interface FamilyProfile {
  id: number;
  memberTypeId: number | null;
  memberTypeName: string | null;
  customerId: string;
  accountId?: string;
  fullName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  isDeleted: boolean;
  isOwner: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Staff-only fields
  certificate?: string | null;
  experience?: number | null;
}

export interface CreateFamilyProfileRequest {
  accountId: string;
  memberTypeId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  avatar?: File | null;
}

