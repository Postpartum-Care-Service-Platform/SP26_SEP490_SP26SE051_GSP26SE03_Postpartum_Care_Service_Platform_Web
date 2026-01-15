export interface RoomType {
  id: number;
  name: string;
  basePrice: number;
  description: string | null;
  capacity: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomTypeRequest {
  name: string;
  basePrice: number;
  description: string;
  capacity: number;
}

export interface UpdateRoomTypeRequest {
  name: string;
  basePrice: number;
  description: string;
  capacity: number;
}


