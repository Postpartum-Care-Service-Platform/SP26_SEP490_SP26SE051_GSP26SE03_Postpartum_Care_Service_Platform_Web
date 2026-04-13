import type {
  FeedbackType,
  CreateFeedbackTypeRequest,
  UpdateFeedbackTypeRequest,
} from '@/types/feedback-type';

import apiClient from './apiClient';

const feedbackTypeService = {
  getAllFeedbackTypes: (): Promise<FeedbackType[]> => {
    return apiClient.get('/FeedbackType');
  },
  getFeedbackTypeById: (id: number): Promise<FeedbackType> => {
    return apiClient.get(`/FeedbackType/${id}`);
  },
  createFeedbackType: (data: CreateFeedbackTypeRequest): Promise<FeedbackType> => {
    return apiClient.post('/FeedbackType', data);
  },
  updateFeedbackType: (id: number, data: UpdateFeedbackTypeRequest): Promise<FeedbackType> => {
    return apiClient.put(`/FeedbackType/${id}`, data);
  },
  deleteFeedbackType: (id: number): Promise<void> => {
    return apiClient.delete(`/FeedbackType/${id}`);
  },
  restoreFeedbackType: (id: number): Promise<FeedbackType> => {
    return apiClient.patch(`/FeedbackType/restore/${id}`);
  },

  importFeedbackTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/FeedbackType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportFeedbackTypes: async (): Promise<void> => {
    const response = await apiClient.get('/FeedbackType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_phan_hoi_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default feedbackTypeService;


