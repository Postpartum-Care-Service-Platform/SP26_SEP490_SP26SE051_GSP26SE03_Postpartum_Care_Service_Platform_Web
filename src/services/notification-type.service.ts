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

  importNotificationTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/NotificationType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportNotificationTypes: async (): Promise<void> => {
    const response = await apiClient.get('/NotificationType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_thong_bao_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default notificationTypeService;

