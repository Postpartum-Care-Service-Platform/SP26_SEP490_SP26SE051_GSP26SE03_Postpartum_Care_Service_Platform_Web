import type { Food } from './food';

export interface Menu {
  id: number;
  menuTypeId: number;
  menuTypeName: string;
  menuName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  foods: Food[];
}

export interface CreateMenuRequest {
  menuTypeId: number;
  menuName: string;
  description: string;
  isActive?: boolean;
  foodIds?: number[];
}

export interface UpdateMenuRequest {
  menuTypeId?: number;
  menuName?: string;
  description?: string;
  isActive?: boolean;
  foodIds?: number[];
}

