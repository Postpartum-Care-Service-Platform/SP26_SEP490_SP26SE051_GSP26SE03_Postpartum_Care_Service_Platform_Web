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

  // Standardized Master Data Export/Import
  exportRooms: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/rooms', {
      responseType: 'blob',
    });
  },

  importRooms: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplateRooms: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/rooms', {
      responseType: 'blob',
    });
  },
};

export default roomAllotmentService;
