import type { Package, CreatePackageRequest, UpdatePackageRequest } from '@/types/package';

import apiClient from './apiClient';

const packageService = {
  getAllPackages: (): Promise<Package[]> => {
    return apiClient.get('/Packages/center');
  },

  getPackageById: (id: number): Promise<Package> => {
    return apiClient.get(`/Packages/${id}`);
  },

  createPackage: (payload: CreatePackageRequest): Promise<Package> => {
    const formData = new FormData();
    formData.append('PackageName', payload.packageName);
    formData.append('Description', payload.description);
    formData.append('DurationDays', String(payload.durationDays));
    formData.append('BasePrice', String(payload.basePrice));
    if (payload.packageTypeId) {
      formData.append('PackageTypeId', String(payload.packageTypeId));
    }
    if (payload.isActive !== undefined) {
      formData.append('IsActive', String(payload.isActive));
    }
    if (payload.image) {
      formData.append('Image', payload.image);
    }

    return apiClient.post('/Packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updatePackage: (id: number, payload: UpdatePackageRequest): Promise<Package> => {
    const formData = new FormData();
    if (payload.packageName) formData.append('PackageName', payload.packageName);
    if (payload.description) formData.append('Description', payload.description);
    if (payload.durationDays) formData.append('DurationDays', String(payload.durationDays));
    if (payload.basePrice) formData.append('BasePrice', String(payload.basePrice));
    if (payload.packageTypeId) formData.append('PackageTypeId', String(payload.packageTypeId));
    if (payload.isActive !== undefined) formData.append('IsActive', String(payload.isActive));
    if (payload.image) {
      formData.append('Image', payload.image);
    }

    return apiClient.put(`/Packages/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deletePackage: (id: number): Promise<void> => {
    return apiClient.delete(`/Packages/${id}`);
  },
};

export default packageService;
