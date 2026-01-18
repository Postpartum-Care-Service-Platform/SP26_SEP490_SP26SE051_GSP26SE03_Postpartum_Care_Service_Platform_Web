import apiClient from './apiClient';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '@/types/package';

const packageService = {
  getAllPackages: (): Promise<Package[]> => {
    return apiClient.get('/Packages');
  },

  getPackageById: (id: number): Promise<Package> => {
    return apiClient.get(`/Packages/${id}`);
  },

  createPackage: (payload: CreatePackageRequest): Promise<Package> => {
    return apiClient.post('/Packages', payload);
  },

  updatePackage: (id: number, payload: UpdatePackageRequest): Promise<Package> => {
    return apiClient.put(`/Packages/${id}`, payload);
  },

  deletePackage: (id: number): Promise<void> => {
    return apiClient.delete(`/Packages/${id}`);
  },
};

export default packageService;
