export interface Feedback {
  id: number;
  customerId: string;
  customerName: string;
  feedbackTypeId: number;
  feedbackTypeName: string;
  title: string;
  content: string;
  rating: number;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateFeedbackRequest {
  feedbackTypeId: number;
  title: string;
  content: string;
  rating: number;
  images?: string[];
}

export interface UpdateFeedbackRequest {
  feedbackTypeId?: number;
  title?: string;
  content?: string;
  rating?: number;
  images?: string[];
}

