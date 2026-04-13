import type { PackageType, CreatePackageTypeRequest, UpdatePackageTypeRequest } from '@/types/package-type';

import apiClient from './apiClient';

const packageTypeService = {
  getAllPackageTypes: (): Promise<PackageType[]> => {
    return apiClient.get('/PackageType');
  },

  createPackageType: (data: CreatePackageTypeRequest): Promise<PackageType> => {
    return apiClient.post('/PackageType', data);
  },

  updatePackageType: (id: number, data: UpdatePackageTypeRequest): Promise<PackageType> => {
    return apiClient.put(`/PackageType/${id}`, data);
  },

  deletePackageType: (id: number): Promise<void> => {
    return apiClient.delete(`/PackageType/${id}`);
  },

  restorePackageType: (id: number): Promise<PackageType> => {
    return apiClient.patch(`/PackageType/restore/${id}`);
  },

  importPackageTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/PackageType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportPackageTypes: async (): Promise<void> => {
    const response = await apiClient.get('/PackageType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_goi_dich_vu_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default packageTypeService;
