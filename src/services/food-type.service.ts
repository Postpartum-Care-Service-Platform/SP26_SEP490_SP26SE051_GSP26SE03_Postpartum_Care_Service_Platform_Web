import type { FoodType, CreateFoodTypeRequest, UpdateFoodTypeRequest } from '@/types/food-type';

import apiClient from './apiClient';

const foodTypeService = {
  getAllFoodTypes: (): Promise<FoodType[]> => {
    return apiClient.get('/FoodType');
  },

  createFoodType: (data: CreateFoodTypeRequest): Promise<FoodType> => {
    return apiClient.post('/FoodType', data);
  },

  updateFoodType: (id: number, data: UpdateFoodTypeRequest): Promise<FoodType> => {
    return apiClient.put(`/FoodType/${id}`, data);
  },

  deleteFoodType: (id: number): Promise<void> => {
    return apiClient.delete(`/FoodType/${id}`);
  },

  restoreFoodType: (id: number): Promise<FoodType> => {
    return apiClient.patch(`/FoodType/restore/${id}`);
  },

  importFoodTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/FoodType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportFoodTypes: async (): Promise<void> => {
    const response = await apiClient.get('/FoodType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_thuc_pham_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default foodTypeService;
