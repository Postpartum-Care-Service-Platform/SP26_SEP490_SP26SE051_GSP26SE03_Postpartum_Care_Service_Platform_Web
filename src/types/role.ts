export interface Role {
  id: number;
  roleName: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleRequest {
  roleName: string;
  description: string;
}

export interface UpdateRoleRequest {
  roleName: string;
  description: string;
}

