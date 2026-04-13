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

  importAmenityServices: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/AmenityService/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportAmenityServices: async (): Promise<void> => {
    const response = await apiClient.get('/AmenityService/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_Dich_vu_Tien_ich_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default amenityService;
