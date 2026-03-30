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
    const formData = new FormData();
    formData.append('Name', data.Name);
    formData.append('FoodTypeId', String(data.FoodTypeId));
    formData.append('Description', data.Description);
    if (data.Image) {
      formData.append('Image', data.Image);
    }
    if (data.IsActive !== undefined) {
      formData.append('IsActive', String(data.IsActive));
    }

    return apiClient.post('/Food', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateFood: (id: number, data: UpdateFoodRequest): Promise<Food> => {
    const formData = new FormData();
    formData.append('Id', String(data.Id));
    if (data.Name) formData.append('Name', data.Name);
    if (data.FoodTypeId) formData.append('FoodTypeId', String(data.FoodTypeId));
    if (data.Description) formData.append('Description', data.Description);
    if (data.Image) {
      formData.append('Image', data.Image);
    }
    if (data.IsActive !== undefined) {
      formData.append('IsActive', String(data.IsActive));
    }

    return apiClient.put(`/Food/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteFood: (id: number): Promise<void> => {
    return apiClient.delete(`/Food/${id}`);
  },

  restoreFood: (id: number): Promise<Food> => {
    return apiClient.patch(`/Food/${id}/restore`);
  },
};

export default foodService;

