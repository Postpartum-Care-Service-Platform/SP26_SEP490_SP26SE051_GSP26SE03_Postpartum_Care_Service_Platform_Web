import type { RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '@/types/room-type';

import apiClient from './apiClient';

const roomTypeService = {
  getAdminRoomTypes: (): Promise<RoomType[]> => {
    return apiClient.get('/RoomType/for-admin');
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
    return apiClient.post('/RoomType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportRoomTypes: async (): Promise<void> => {
    const response = await apiClient.get('/RoomType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_phong_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default roomTypeService;


