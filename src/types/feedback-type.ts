export interface FeedbackType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateFeedbackTypeRequest {
  name: string;
}

export interface UpdateFeedbackTypeRequest {
  name: string;
}
