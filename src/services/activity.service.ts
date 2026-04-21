import type { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types/activity';
import apiClient from './apiClient';

const activityService = {
  getAllActivities: (): Promise<Activity[]> => {
    return apiClient.get('/Activities');
  },
  getActivityById: (id: number): Promise<Activity> => {
    return apiClient.get(`/Activities/${id}`);
  },
  createActivity: (data: CreateActivityRequest | CreateActivityRequest[]): Promise<Activity | Activity[]> => {
    const payload = Array.isArray(data) ? data : [data];
    return apiClient.post('/Activities', payload);
  },
  updateActivity: (id: number, data: UpdateActivityRequest): Promise<Activity> => {
    return apiClient.put(`/Activities/${id}`, data);
  },
  deleteActivity: (id: number): Promise<void> => {
    return apiClient.delete(`/Activities/${id}`);
  },

  // Standardized Master Data Export/Import
  exportActivities: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/activities', {
      responseType: 'blob',
    });
  },

  importActivities: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/activities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateActivities: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/activities', {
      responseType: 'blob',
    });
  },
};

export default activityService;
