import type { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '@/types/notification';

import apiClient from './apiClient';

const notificationService = {
  getAllNotifications: (): Promise<Notification[]> => {
    return apiClient.get('/Notification');
  },

  getNotificationById: (id: number): Promise<Notification> => {
    return apiClient.get(`/Notification/${id}`);
  },

  getMyNotifications: (): Promise<Notification[]> => {
    return apiClient.get('/Notification/me');
  },

  createNotification: (data: CreateNotificationRequest): Promise<Notification> => {
    return apiClient.post('/Notification', data);
  },

  updateNotification: (id: number, data: UpdateNotificationRequest): Promise<Notification> => {
    return apiClient.put(`/Notification/${id}`, data);
  },

  markAsRead: (id: number): Promise<Notification> => {
    return apiClient.put(`/Notification/mark-as-read/${id}`);
  },
};

export default notificationService;

