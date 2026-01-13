export interface FamilyProfile {
  id: number;
  memberTypeId: number;
  customerId: string;
  fullName: string;
  dateOfBirth: string; // yyyy-mm-dd
  gender: string;
  address: string;
  phoneNumber: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyProfileRequest {
  memberTypeId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  avatar?: File | null;
}

