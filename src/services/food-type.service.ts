import type { FoodType, CreateFoodTypeRequest, UpdateFoodTypeRequest } from '@/types/food-type';
import apiClient from './apiClient';

const foodTypeService = {
  getAllFoodTypes: (): Promise<FoodType[]> => {
    return apiClient.get('/FoodType');
  },
  getFoodTypeById: (id: number): Promise<FoodType> => {
    return apiClient.get(`/FoodType/${id}`);
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
    return apiClient.post('/MasterDataExport/import/food-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportFoodTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/food-types', { responseType: 'blob' });
  },

  downloadTemplateFoodTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/food-types', { responseType: 'blob' });
  },
};

export default foodTypeService;
