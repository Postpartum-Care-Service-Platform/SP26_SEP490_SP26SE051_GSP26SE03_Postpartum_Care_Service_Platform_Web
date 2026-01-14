export interface FamilyProfile {
  id: number;
  memberTypeId: number;
  memberTypeName: string;
  customerId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  avatarUrl: string | null;
  isDeleted: boolean;
  isOwner: boolean;
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

