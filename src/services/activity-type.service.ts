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
    return apiClient.post('/ActivityType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportActivityTypes: async (): Promise<void> => {
    const response = await apiClient.get('/ActivityType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_hoat_dong_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default activityTypeService;
