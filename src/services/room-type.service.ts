import type { RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '@/types/room-type';
import apiClient from './apiClient';

const roomTypeService = {
  getAllRoomTypes: (): Promise<RoomType[]> => {
    return apiClient.get('/RoomType');
  },
  getAdminRoomTypes: (): Promise<RoomType[]> => {
    return apiClient.get('/RoomType/for-admin');
  },
  getRoomTypeById: (id: number): Promise<RoomType> => {
    return apiClient.get(`/RoomType/${id}`);
  },
  createRoomType: (data: CreateRoomTypeRequest): Promise<RoomType> => {
    return apiClient.post('/RoomType', data);
  },
  updateRoomType: (id: number, data: UpdateRoomTypeRequest): Promise<RoomType> => {
    return apiClient.put(`/RoomType/${id}`, data);
  },
  deleteRoomType: (id: number): Promise<void> => {
    return apiClient.delete(`/RoomType/${id}`);
  },
  restoreRoomType: (id: number): Promise<RoomType> => {
    return apiClient.patch(`/RoomType/restore/${id}`);
  },

  importRoomTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/room-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportRoomTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/room-types', { responseType: 'blob' });
  },

  downloadTemplateRoomTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/room-types', { responseType: 'blob' });
  },
};

export default roomTypeService;
