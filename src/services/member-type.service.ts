import apiClient from './apiClient';

export interface MemberType {
  id: number;
  name: string;
  isActive: boolean;
  roleId: number;
  roleName: string | null;
}

export interface CreateMemberTypeRequest {
  name: string;
  isActive?: boolean;
  roleId?: number;
}

export interface UpdateMemberTypeRequest {
  name: string;
  roleId?: number;
}

const memberTypeService = {
  getAll: (): Promise<MemberType[]> =>
    apiClient.get('/member-types'),

  getById: (id: number): Promise<MemberType> =>
    apiClient.get(`/member-types/${id}`),

  create: (data: CreateMemberTypeRequest): Promise<MemberType> =>
    apiClient.post('/member-types', data),

  update: (id: number, data: UpdateMemberTypeRequest): Promise<MemberType> =>
    apiClient.put(`/member-types/${id}`, data),

  deleteMemberType: (id: number): Promise<void> => {
    return apiClient.delete(`/MemberType/${id}`);
  },

  importMemberTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/member-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportMemberTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/member-types', { responseType: 'blob' });
  },

  downloadTemplateMemberTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/member-types', { responseType: 'blob' });
  },
};

export default memberTypeService;
