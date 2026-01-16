import apiClient from './apiClient';
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu';

const menuService = {
  getAllMenus: (): Promise<Menu[]> => {
    return apiClient.get('/Menu');
  },

  getMenuById: (id: number): Promise<Menu> => {
    return apiClient.get(`/Menu/${id}`);
  },

  createMenu: (data: CreateMenuRequest): Promise<Menu> => {
    return apiClient.post('/Menu', data);
  },

  updateMenu: (id: number, data: UpdateMenuRequest): Promise<Menu> => {
    return apiClient.put(`/Menu/${id}`, data);
  },

  deleteMenu: (id: number): Promise<void> => {
    return apiClient.delete(`/Menu/${id}`);
  },

  restoreMenu: (id: number): Promise<Menu> => {
    return apiClient.patch(`/Menu/${id}/restore`);
  },
};

export default menuService;

