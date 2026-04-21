import type { NotificationType } from '@/types/notification-type';
import apiClient from './apiClient';

const notificationTypeService = {
  getAllNotificationTypes: (): Promise<NotificationType[]> => {
    return apiClient.get('/NotificationType');
  },
  getNotificationTypeById: (id: number): Promise<NotificationType> => {
    return apiClient.get(`/NotificationType/${id}`);
  },
  createNotificationType: (data: any): Promise<NotificationType> => {
    return apiClient.post('/NotificationType', data);
  },
  updateNotificationType: (id: number, data: any): Promise<NotificationType> => {
    return apiClient.put(`/NotificationType/${id}`, data);
  },
  deleteNotificationType: (id: number): Promise<void> => {
    return apiClient.delete(`/NotificationType/${id}`);
  },
  restoreNotificationType: (id: number): Promise<NotificationType> => {
    return apiClient.patch(`/NotificationType/restore/${id}`);
  },

  importNotificationTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/notification-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportNotificationTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/notification-types', { responseType: 'blob' });
  },

  downloadTemplateNotificationTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/notification-types', { responseType: 'blob' });
  },
};

export default notificationTypeService;
