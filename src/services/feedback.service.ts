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
};

export default feedbackService;

