import type { PackageType, CreatePackageTypeRequest, UpdatePackageTypeRequest } from '@/types/package-type';
import apiClient from './apiClient';

const packageTypeService = {
  getAllPackageTypes: (): Promise<PackageType[]> => {
    return apiClient.get('/PackageType');
  },
  getAdminPackageTypes: (): Promise<PackageType[]> => {
    return apiClient.get('/PackageType/for-admin');
  },
  getPackageTypeById: (id: number): Promise<PackageType> => {
    return apiClient.get(`/PackageType/${id}`);
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
    return apiClient.post('/MasterDataExport/import/package-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportPackageTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/package-types', { responseType: 'blob' });
  },

  downloadTemplatePackageTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/package-types', { responseType: 'blob' });
  },
};

export default packageTypeService;
