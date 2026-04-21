import type { ActivityType, CreateActivityTypeRequest, UpdateActivityTypeRequest } from '@/types/activity-type';
 
import apiClient from './apiClient';

const activityTypeService = {
  getAllActivityTypes: (): Promise<ActivityType[]> => {
    return apiClient.get('/ActivityType');
  },
  getActivityTypeById: (id: number): Promise<ActivityType> => {
    return apiClient.get(`/ActivityType/${id}`);
  },
  createActivityType: (data: CreateActivityTypeRequest): Promise<ActivityType> => {
    return apiClient.post('/ActivityType', data);
  },
  updateActivityType: (id: number, data: UpdateActivityTypeRequest): Promise<ActivityType> => {
    return apiClient.put(`/ActivityType/${id}`, data);
  },
  deleteActivityType: (id: number): Promise<void> => {
    return apiClient.delete(`/ActivityType/${id}`);
  },
  restoreActivityType: (id: number): Promise<ActivityType> => {
    return apiClient.patch(`/ActivityType/restore/${id}`);
  },

  importActivityTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/activity-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportActivityTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/activity-types', { responseType: 'blob' });
  },

  downloadTemplateActivityTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/activity-types', { responseType: 'blob' });
  },
};

export default activityTypeService;
