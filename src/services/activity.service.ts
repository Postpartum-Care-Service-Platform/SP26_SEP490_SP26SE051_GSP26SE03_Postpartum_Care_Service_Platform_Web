import apiClient from './apiClient';
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types/activity';

const activityService = {
  getAllActivities: (): Promise<Activity[]> => {
    return apiClient.get('/Activities');
  },
  getActivityById: (id: number): Promise<Activity> => {
    return apiClient.get(`/Activities/${id}`);
  },
  createActivity: (data: CreateActivityRequest): Promise<Activity> => {
    return apiClient.post('/Activities', data);
  },
  updateActivity: (id: number, data: UpdateActivityRequest): Promise<Activity> => {
    return apiClient.put(`/Activities/${id}`, data);
  },
  deleteActivity: (id: number): Promise<void> => {
    return apiClient.delete(`/Activities/${id}`);
  },
};

export default activityService;


