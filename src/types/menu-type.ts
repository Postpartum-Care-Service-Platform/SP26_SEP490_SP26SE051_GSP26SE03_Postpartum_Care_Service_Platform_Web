export interface MenuType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuTypeRequest {
  name: string;
  isActive?: boolean;
}

export interface UpdateMenuTypeRequest {
  name?: string;
  isActive?: boolean;
}

