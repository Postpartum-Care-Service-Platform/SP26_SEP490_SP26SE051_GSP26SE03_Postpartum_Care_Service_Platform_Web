import apiClient from './apiClient';
import { HealthCondition, HealthConditionCategory } from '@/types/health-record';

const healthConditionService = {
  getAll: (): Promise<HealthCondition[]> => {
    return apiClient.get('/HealthCondition/GetAll');
  },

  create: (data: Partial<HealthCondition>): Promise<HealthCondition> => {
    return apiClient.post('/HealthCondition/Create', data);
  },

  update: (id: number, data: Partial<HealthCondition>): Promise<HealthCondition> => {
    return apiClient.put(`/HealthCondition/Update/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/HealthCondition/Delete/${id}`);
  },

  // Standardized Master Data Export/Import
  export: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/health-conditions', {
      responseType: 'blob',
    });
  },

  import: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/health-conditions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplate: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/health-conditions', {
      responseType: 'blob',
    });
  },

  // Health Condition Category
  getAllCategories: (): Promise<HealthConditionCategory[]> => {
    return apiClient.get('/HealthConditionCategory/GetAll');
  },

  createCategory: (data: Partial<HealthConditionCategory>): Promise<HealthConditionCategory> => {
    return apiClient.post('/HealthConditionCategory/Create', data);
  },

  updateCategory: (id: number, data: Partial<HealthConditionCategory>): Promise<HealthConditionCategory> => {
    return apiClient.put(`/HealthConditionCategory/Update/${id}`, data);
  },

  deleteCategory: (id: number): Promise<void> => {
    return apiClient.delete(`/HealthConditionCategory/Delete/${id}`);
  },

  restoreCategory: (id: number): Promise<void> => {
    return apiClient.post(`/HealthConditionCategory/Restore/${id}`);
  },

  exportCategories: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/health-condition-categories', {
      responseType: 'blob',
    });
  },

  importCategories: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/health-condition-categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateCategories: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/health-condition-categories', {
      responseType: 'blob',
    });
  },
};

export default healthConditionService;
