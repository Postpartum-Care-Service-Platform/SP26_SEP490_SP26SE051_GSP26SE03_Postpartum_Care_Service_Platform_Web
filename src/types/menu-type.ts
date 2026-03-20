export interface MenuType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuTypeRequest {
  menuTypeName: string;
  isActive?: boolean;
}

export interface UpdateMenuTypeRequest {
  menuTypeName?: string;
  isActive?: boolean;
}

