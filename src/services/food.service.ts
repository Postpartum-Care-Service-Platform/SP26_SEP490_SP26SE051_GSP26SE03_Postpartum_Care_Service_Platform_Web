import type { Food, CreateFoodRequest, UpdateFoodRequest } from '@/types/food';

import apiClient from './apiClient';

const foodService = {
  getAllFoods: (): Promise<Food[]> => {
    return apiClient.get('/Food');
  },

  getFoodById: (id: number): Promise<Food> => {
    return apiClient.get(`/Food/${id}`);
  },

  createFood: (data: CreateFoodRequest): Promise<Food> => {
    return apiClient.post('/Food', data);
  },

  updateFood: (id: number, data: UpdateFoodRequest): Promise<Food> => {
    return apiClient.put(`/Food/${id}`, data);
  },

  deleteFood: (id: number): Promise<void> => {
    return apiClient.delete(`/Food/${id}`);
  },

  restoreFood: (id: number): Promise<Food> => {
    return apiClient.patch(`/Food/${id}/restore`);
  },
};

export default foodService;

