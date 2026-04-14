import type { Feedback, CreateFeedbackRequest, UpdateFeedbackRequest } from '@/types/feedback';

import apiClient from './apiClient';

const feedbackService = {
  getAllFeedbacks: (): Promise<Feedback[]> => {
    return apiClient.get('/Feedback');
  },
  getFeedbackById: (id: number): Promise<Feedback> => {
    return apiClient.get(`/Feedback/${id}`);
  },
  createFeedback: (data: CreateFeedbackRequest): Promise<Feedback> => {
    return apiClient.post('/Feedback', data);
  },
  updateFeedback: (id: number, data: UpdateFeedbackRequest): Promise<Feedback> => {
    return apiClient.put(`/Feedback/${id}`, data);
  },
  deleteFeedback: (id: number): Promise<void> => {
    return apiClient.delete(`/Feedback/${id}`);
  },
  restoreFeedback: (id: number): Promise<Feedback> => {
    return apiClient.patch(`/Feedback/${id}/restore`);
  },
  getFeedbacksByUserId: (userId: string): Promise<Feedback[]> => {
    return apiClient.get(`/Feedback/user/${userId}`);
  },

  importFeedbacks: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/Feedback/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportFeedbacks: async (): Promise<void> => {
    const response = await apiClient.get('/Feedback/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_phan_hoi_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default feedbackService;

