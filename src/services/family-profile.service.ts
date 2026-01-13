import apiClient from './apiClient';
import type { CreateFamilyProfileRequest, FamilyProfile } from '@/types/family-profile';
import { buildFamilyProfileFormData } from '@/utils/formData';

const familyProfileService = {
  getMyFamilyProfiles: (): Promise<FamilyProfile[]> => {
    return apiClient.get('/FamilyProfile/GetMyFamilyProfiles');
  },

  getAllFamilyProfiles: (): Promise<FamilyProfile[]> => {
    return apiClient.get('/FamilyProfile/GetAll');
  },

  createFamilyProfile: (payload: CreateFamilyProfileRequest): Promise<FamilyProfile> => {
    const formData = buildFamilyProfileFormData(payload);
    return apiClient.post('/FamilyProfile/Create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default familyProfileService;

