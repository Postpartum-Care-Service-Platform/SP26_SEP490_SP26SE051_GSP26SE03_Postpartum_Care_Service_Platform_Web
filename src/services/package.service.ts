import apiClient from './apiClient';
import type { Package } from '@/types/package';

const packageService = {
  // Lấy tất cả các gói dịch vụ
  getAllPackages: (): Promise<Package[]> => {
    return apiClient.get('/Packages');
  },

  // Lấy chi tiết một gói dịch vụ theo ID
  getPackageById: (id: string): Promise<Package> => {
    return apiClient.get(`/Packages/${id}`);
  },
};

export default packageService;
