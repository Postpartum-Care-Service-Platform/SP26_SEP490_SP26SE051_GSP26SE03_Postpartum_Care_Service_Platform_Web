import type { CreateFamilyProfileRequest } from '@/types/family-profile';

export function buildFamilyProfileFormData(
  payload: CreateFamilyProfileRequest
): FormData {
  const formData = new FormData();
  formData.append('MemberTypeId', String(payload.memberTypeId));
  formData.append('FullName', payload.fullName);
  formData.append('DateOfBirth', payload.dateOfBirth);
  formData.append('Gender', payload.gender);
  formData.append('Address', payload.address);
  formData.append('PhoneNumber', payload.phoneNumber);

  if (payload.avatar) {
    formData.append('Avatar', payload.avatar);
  }

  return formData;
}

