export interface ActivityType {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateActivityTypeRequest {
  name?: string;
  description?: string;
}
