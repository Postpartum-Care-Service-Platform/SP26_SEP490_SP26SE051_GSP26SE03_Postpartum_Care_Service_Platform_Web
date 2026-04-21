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
    return apiClient.post('/MasterDataExport/import/feedback-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportFeedbackTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/feedback-types', { responseType: 'blob' });
  },

  downloadTemplateFeedbackTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/feedback-types', { responseType: 'blob' });
  },
};

export default feedbackTypeService;
