export interface NotificationType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationTypeRequest {
  name: string;
  isActive?: boolean;
}

export interface UpdateNotificationTypeRequest {
  name?: string;
  isActive?: boolean;
}

