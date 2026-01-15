import apiClient from './apiClient';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role';

const roleService = {
  getAllRoles: (): Promise<Role[]> => {
    return apiClient.get('/Roles');
  },
  createRole: (data: CreateRoleRequest): Promise<Role> => {
    return apiClient.post('/Roles', data);
  },
  updateRole: (id: number, data: UpdateRoleRequest): Promise<Role> => {
    return apiClient.put(`/Roles/${id}`, data);
  },
  deleteRole: (id: number): Promise<void> => {
    return apiClient.delete(`/Roles/${id}`);
  },
};

export default roleService;

