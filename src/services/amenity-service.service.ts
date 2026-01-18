import apiClient from './apiClient';
import type { AmenityService } from '@/types/amenity-service';

const amenityService = {
  // Lấy tất cả các tiện ích
  getAllAmenityServices: (): Promise<AmenityService[]> => {
    return apiClient.get('/AmenityService');
  },

  // Lấy chi tiết một tiện ích theo ID
  getAmenityServiceById: (id: number): Promise<AmenityService> => {
    return apiClient.get(`/AmenityService/${id}`);
  },
};

export default amenityService;
