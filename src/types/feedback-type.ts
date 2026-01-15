export interface FeedbackType {
  id: number;
  name: string;
  description?: string;
  isDeleted?: boolean;
}

export interface CreateFeedbackTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateFeedbackTypeRequest {
  name: string;
  description?: string;
}


