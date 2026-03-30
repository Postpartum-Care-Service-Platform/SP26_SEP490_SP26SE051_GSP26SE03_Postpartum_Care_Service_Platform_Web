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
};

export default activityTypeService;
