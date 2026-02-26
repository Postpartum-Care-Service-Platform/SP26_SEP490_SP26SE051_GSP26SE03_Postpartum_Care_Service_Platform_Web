import type { MenuRecord, CreateMenuRecordRequest, UpdateMenuRecordRequest } from '@/types/menu-record';

import apiClient from './apiClient';

const menuRecordService = {
  getAllMenuRecords: (): Promise<MenuRecord[]> => {
    return apiClient.get('/MenuRecord');
  },

  getMenuRecordById: (id: number): Promise<MenuRecord> => {
    return apiClient.get(`/MenuRecord/${id}`);
  },

  createMenuRecord: (data: CreateMenuRecordRequest): Promise<MenuRecord> => {
    return apiClient.post('/MenuRecord', data);
  },

  updateMenuRecord: (id: number, data: UpdateMenuRecordRequest): Promise<MenuRecord> => {
    return apiClient.put(`/MenuRecord/${id}`, data);
  },

  deleteMenuRecord: (id: number): Promise<void> => {
    return apiClient.delete(`/MenuRecord/${id}`);
  },
};

export default menuRecordService;
