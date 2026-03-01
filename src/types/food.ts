export interface Food {
  id: number;
  name: string;
  type: string;
  foodType?: string; // API có thể trả về foodType thay vì type
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodRequest {
  name: string;
  type: string;
  description: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface UpdateFoodRequest {
  name?: string;
  type?: string;
  description?: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

