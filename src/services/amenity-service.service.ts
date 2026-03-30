import type { AmenityService } from '@/types/amenity-service';

import apiClient from './apiClient';

const amenityService = {
  // Lấy tất cả các tiện ích
  getAllAmenityServices: (): Promise<AmenityService[]> => {
    return apiClient.get('/AmenityService');
  },

  // Lấy chi tiết một tiện ích theo ID
  getAmenityServiceById: (id: number): Promise<AmenityService> => {
    return apiClient.get(`/AmenityService/${id}`);
  },

  // Tạo mới tiện ích
  createAmenityService: (formData: FormData): Promise<AmenityService> => {
    return apiClient.post('/AmenityService', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Cập nhật tiện ích
  updateAmenityService: (id: number, formData: FormData): Promise<AmenityService> => {
    return apiClient.put(`/AmenityService/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Xóa tiện ích
  deleteAmenityService: (id: number): Promise<void> => {
    return apiClient.delete(`/AmenityService/${id}`);
  },
};

export default amenityService;
