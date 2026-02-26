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
};

export default roomTypeService;


