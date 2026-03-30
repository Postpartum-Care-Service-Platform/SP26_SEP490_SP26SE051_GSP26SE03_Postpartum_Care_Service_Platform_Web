export interface Food {
  id: number;
  name: string;
  foodTypeId: number;
  foodType?: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodRequest {
  Name: string;
  FoodTypeId: number;
  Description: string;
  Image?: File | null;
  IsActive?: boolean;
}

export interface UpdateFoodRequest {
  Id: number;
  Name?: string;
  FoodTypeId?: number;
  Description?: string;
  Image?: File | null;
  IsActive?: boolean;
}

