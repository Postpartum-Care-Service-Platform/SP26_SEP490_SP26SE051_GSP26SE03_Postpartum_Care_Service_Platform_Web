import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu';
import apiClient from './apiClient';

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

  // Standardized Master Data Export/Import
  exportMenus: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/menus', {
      responseType: 'blob',
    });
  },

  importMenus: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/menus', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateMenus: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/menus', {
      responseType: 'blob',
    });
  },
};

export default menuService;
