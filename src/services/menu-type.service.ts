import type { MenuType, CreateMenuTypeRequest, UpdateMenuTypeRequest } from '@/types/menu-type';

import apiClient from './apiClient';

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
    return apiClient.patch(`/MenuType/restore/${id}`);
  },

  importMenuTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MenuType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportMenuTypes: async (): Promise<void> => {
    const response = await apiClient.get('/MenuType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_thuc_don_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default menuTypeService;

