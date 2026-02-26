import type { NotificationType, CreateNotificationTypeRequest, UpdateNotificationTypeRequest } from '@/types/notification-type';

import apiClient from './apiClient';

const notificationTypeService = {
  getAllNotificationTypes: (): Promise<NotificationType[]> => {
    return apiClient.get('/NotificationType');
  },

  getNotificationTypeById: (id: number): Promise<NotificationType> => {
    return apiClient.get(`/NotificationType/${id}`);
  },

  createNotificationType: (data: CreateNotificationTypeRequest): Promise<NotificationType> => {
    return apiClient.post('/NotificationType', data);
  },

  updateNotificationType: (id: number, data: UpdateNotificationTypeRequest): Promise<NotificationType> => {
    return apiClient.put(`/NotificationType/${id}`, data);
  },

  deleteNotificationType: (id: number): Promise<void> => {
    return apiClient.delete(`/NotificationType/${id}`);
  },

  restoreNotificationType: (id: number): Promise<NotificationType> => {
    return apiClient.patch(`/NotificationType/restore/${id}`);
  },
};

export default notificationTypeService;

