import type { MenuType, CreateMenuTypeRequest, UpdateMenuTypeRequest } from '@/types/menu-type';
import apiClient from './apiClient';

const menuTypeService = {
  getAllMenuTypes: (): Promise<MenuType[]> => {
    return apiClient.get('/MenuType');
  },
  getMenuTypeById: (id: number): Promise<MenuType> => {
    return apiClient.get(`/MenuType/${id}`);
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
    return apiClient.patch(`/MenuType/restore/${id}`);
  },

  importMenuTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/menu-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportMenuTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/menu-types', { responseType: 'blob' });
  },

  downloadTemplateMenuTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/menu-types', { responseType: 'blob' });
  },
};

export default menuTypeService;
