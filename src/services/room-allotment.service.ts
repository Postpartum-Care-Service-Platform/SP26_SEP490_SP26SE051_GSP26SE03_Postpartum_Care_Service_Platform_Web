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
};

export default roomAllotmentService;

