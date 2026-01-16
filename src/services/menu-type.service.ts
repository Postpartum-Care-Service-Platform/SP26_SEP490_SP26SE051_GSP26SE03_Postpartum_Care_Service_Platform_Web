import apiClient from './apiClient';
import type { MenuType, CreateMenuTypeRequest, UpdateMenuTypeRequest } from '@/types/menu-type';

const menuTypeService = {
  getAllMenuTypes: (): Promise<MenuType[]> => {
    return apiClient.get('/MenuType');
  },

  createMenuType: (data: CreateMenuTypeRequest): Promise<MenuType> => {
    return apiClient.post('/MenuType', data);
  },

  updateMenuType: (id: number, data: UpdateMenuTypeRequest): Promise<MenuType> => {
    return apiClient.put(`/MenuType/${id}`, data);
  },

  deleteMenuType: (id: number): Promise<void> => {
    return apiClient.delete(`/MenuType/${id}`);
  },

  restoreMenuType: (id: number): Promise<MenuType> => {
    return apiClient.post(`/MenuType/restore/${id}`);
  },
};

export default menuTypeService;

