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

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/member-types/${id}`),
};

export default memberTypeService;
