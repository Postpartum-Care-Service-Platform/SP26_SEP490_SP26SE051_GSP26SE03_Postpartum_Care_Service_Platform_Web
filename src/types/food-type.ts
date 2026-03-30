export type FoodType = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export type CreateFoodTypeRequest = {
  name: string;
  isActive: boolean;
};

export type UpdateFoodTypeRequest = {
  name: string;
  isActive: boolean;
};
