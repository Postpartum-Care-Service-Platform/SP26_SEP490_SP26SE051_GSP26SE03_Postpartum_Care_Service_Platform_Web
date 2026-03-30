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
};

export default foodTypeService;
