import apiClient from './apiClient';
import type {
  FeedbackType,
  CreateFeedbackTypeRequest,
  UpdateFeedbackTypeRequest,
} from '@/types/feedback-type';

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
};

export default feedbackTypeService;


