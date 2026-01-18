import apiClient from './apiClient';
import type { Package, PackageResponse } from '@/types/package';

// Hàm transform dữ liệu từ API response sang frontend format
const transformPackage = (response: PackageResponse): Package => {
  return {
    id: String(response.id),
    name: response.packageName,
    description: response.description || undefined,
    price: response.basePrice,
    duration: response.durationDays,
    isActive: response.isActive,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    // imageUrl và features có thể được thêm sau nếu backend hỗ trợ
    imageUrl: undefined,
    features: undefined,
  };
};

const packageService = {
  // Lấy tất cả các gói dịch vụ
  getAllPackages: async (): Promise<Package[]> => {
    const response: PackageResponse[] = await apiClient.get('/Packages');
    // Transform mỗi package từ API response sang frontend format
    return response.map(transformPackage);
  },

  // Lấy chi tiết một gói dịch vụ theo ID
  getPackageById: async (id: string): Promise<Package> => {
    const response: PackageResponse = await apiClient.get(`/Packages/${id}`);
    // Transform package từ API response sang frontend format
    return transformPackage(response);
  },
};

export default packageService;
