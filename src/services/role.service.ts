import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role';

import apiClient from './apiClient';

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

  exportRoles: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/roles', {
      responseType: 'blob',
    });
  },

  importRoles: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/roles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateRoles: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/roles', {
      responseType: 'blob',
    });
  },
};

export default roleService;

