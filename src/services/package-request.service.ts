import type { PackageRequest } from '@/types/package-request';
import apiClient from './apiClient';

const packageRequestService = {
  getAll: (): Promise<PackageRequest[]> => {
    return apiClient.get('/PackageRequest/GetAll');
  },
  createDraftPackage: (id: number, data: any): Promise<any> => {
    return apiClient.post(`/PackageRequest/CreateDraftPackage/${id}`, data);
  },
};

export default packageRequestService;
