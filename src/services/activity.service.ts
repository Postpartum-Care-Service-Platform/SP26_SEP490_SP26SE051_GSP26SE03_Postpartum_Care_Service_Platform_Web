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
};

export default activityService;


