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
    return apiClient.post('/MemberType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportMemberTypes: async (): Promise<void> => {
    const response = await apiClient.get('/MemberType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_thanh_vien_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default memberTypeService;
