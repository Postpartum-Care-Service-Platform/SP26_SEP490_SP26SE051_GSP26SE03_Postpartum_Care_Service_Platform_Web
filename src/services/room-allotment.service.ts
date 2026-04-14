import type { CreateRoomRequest, Room, UpdateRoomRequest } from '@/types/room-allotment';

import apiClient from './apiClient';

const roomAllotmentService = {
  getAllRooms: (): Promise<Room[]> => {
    return apiClient.get('/Room');
  },
  createRoom: (data: CreateRoomRequest): Promise<Room> => {
    return apiClient.post('/Room', data);
  },
  updateRoom: (id: number, data: UpdateRoomRequest): Promise<Room> => {
    return apiClient.put(`/Room/${id}`, data);
  },
  deleteRoom: (id: number): Promise<void> => {
    return apiClient.delete(`/Room/${id}`);
  },
  maintainRoom: (id: number): Promise<Room> => {
    return apiClient.patch(`/Room/maintain/${id}`);
  },
  activateRoom: (id: number): Promise<Room> => {
    return apiClient.patch(`/Room/activate/${id}`);
  },

  importRooms: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/Room/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportRooms: async (): Promise<void> => {
    const response = await apiClient.get('/Room/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_phong_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default roomAllotmentService;

