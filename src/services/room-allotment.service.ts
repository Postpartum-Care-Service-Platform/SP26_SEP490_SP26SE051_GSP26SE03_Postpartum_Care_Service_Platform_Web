import type { Room, UpdateRoomRequest } from '@/types/room-allotment';

import apiClient from './apiClient';

const roomAllotmentService = {
  getAllRooms: (): Promise<Room[]> => {
    return apiClient.get('/Room');
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
};

export default roomAllotmentService;

