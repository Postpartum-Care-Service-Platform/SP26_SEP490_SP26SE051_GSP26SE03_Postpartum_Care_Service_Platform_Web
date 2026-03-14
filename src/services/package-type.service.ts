import type { PackageType, CreatePackageTypeRequest, UpdatePackageTypeRequest } from '@/types/package-type';

import apiClient from './apiClient';

const packageTypeService = {
  getAllPackageTypes: (): Promise<PackageType[]> => {
    return apiClient.get('/PackageType');
  },

  createPackageType: (data: CreatePackageTypeRequest): Promise<PackageType> => {
    return apiClient.post('/PackageType', data);
  },

  updatePackageType: (id: number, data: UpdatePackageTypeRequest): Promise<PackageType> => {
    return apiClient.put(`/PackageType/${id}`, data);
  },

  deletePackageType: (id: number): Promise<void> => {
    return apiClient.delete(`/PackageType/${id}`);
  },

  restorePackageType: (id: number): Promise<PackageType> => {
    return apiClient.patch(`/PackageType/restore/${id}`);
  },
};

export default packageTypeService;
