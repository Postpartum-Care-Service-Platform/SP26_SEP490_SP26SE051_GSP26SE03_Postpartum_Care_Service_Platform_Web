import apiClient from './apiClient';
import type { Role } from '@/types/role';

const roleService = {
  getAllRoles: (): Promise<Role[]> => {
    return apiClient.get('/Roles');
  },
};

export default roleService;

    