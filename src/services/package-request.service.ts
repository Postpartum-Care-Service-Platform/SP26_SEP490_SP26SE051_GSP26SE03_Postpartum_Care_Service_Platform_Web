import type { PackageRequest } from '@/types/package-request';
import apiClient from './apiClient';

const packageRequestService = {
  getAll: (): Promise<PackageRequest[]> => {
    return apiClient.get('/PackageRequest/GetAll');
  },
  getById: (id: number): Promise<PackageRequest> => {
    return apiClient.get(`/PackageRequest/GetById/${id}`);
  },
  createDraftPackage: (id: number, data: any): Promise<any> => {
    return apiClient.post(`/PackageRequest/CreateDraftPackage/${id}`, data);
  },
  attachPackage: (id: number, packageId: number): Promise<any> => {
    return apiClient.put(`/PackageRequest/AttachPackage/${id}`, { packageId });
  },
  reject: (id: number, rejectReason: string): Promise<any> => {
    return apiClient.put(`/PackageRequest/Reject/${id}`, { rejectReason });
  },
};

export default packageRequestService;
