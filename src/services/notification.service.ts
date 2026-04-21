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

  deleteNotification: (id: number): Promise<void> => {
    return apiClient.delete(`/Notification/${id}`);
  },

  // Standardized Master Data Export/Import
  exportNotifications: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/notifications', {
      responseType: 'blob',
    });
  },

  importNotifications: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/notifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateNotifications: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/notifications', {
      responseType: 'blob',
    });
  },
};

export default notificationService;
