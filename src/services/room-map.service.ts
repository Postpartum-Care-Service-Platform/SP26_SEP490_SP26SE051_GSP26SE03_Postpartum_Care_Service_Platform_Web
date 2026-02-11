import apiClient from './apiClient';

export interface RoomApiDto {
  id: number;
  roomTypeId: number;
  roomTypeName: string;
  name: string; // ví dụ: "101"
  floor: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string; // map id dùng cho Interactive3DMallMap (ví dụ: "1.01")
  name: string; // tên hiển thị
  category: string; // '1', '2', '3', ...
  content: string;
  floorId: number;
  apiId: number; // id thật từ BE
  status: string;
  isActive: boolean;
  rawName: string; // name thật từ BE (ví dụ: "101")
  roomTypeId: number;
  roomTypeName: string;
}

export interface Floor {
  id: number;
  name: string;
  level: number;
  rooms: Room[];
}

const buildMapRoomId = (floor: number, roomName: string) => {
  const suffix = (roomName ?? '').toString().slice(-2);
  const twoDigits = suffix.padStart(2, '0');
  return `${floor}.${twoDigits}`;
};

const categoryFromStatus = (status: string) => {
  const s = (status ?? '').toLowerCase();
  if (s === 'available') return '1';
  if (s === 'occupied') return '2';
  if (s === 'maintain' || s === 'maintenance') return '3';
  return '1';
};

const mapDtoToRoom = (dto: RoomApiDto): Room => {
  const mapId = buildMapRoomId(dto.floor, dto.name);

  return {
    id: mapId,
    name: `Phòng ${dto.name}`,
    category: categoryFromStatus(dto.status),
    content: dto.roomTypeName,
    floorId: dto.floor,
    apiId: dto.id,
    status: dto.status,
    isActive: dto.isActive,
    rawName: dto.name,
    roomTypeId: dto.roomTypeId,
    roomTypeName: dto.roomTypeName,
  };
};

const buildFloorsFromRooms = (rooms: Room[]): Floor[] => {
  const floorsMap = new Map<number, Room[]>();

  for (const room of rooms) {
    const current = floorsMap.get(room.floorId) ?? [];
    current.push(room);
    floorsMap.set(room.floorId, current);
  }

  return Array.from(floorsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([floorNumber, floorRooms]) => ({
      id: floorNumber,
      name: `Tầng ${floorNumber}`,
      level: floorNumber,
      rooms: floorRooms,
    }));
};

export const roomMapService = {
  getFloors: async (): Promise<Floor[]> => {
    const dtos = await apiClient.get('/Room');
    const rooms = (dtos as RoomApiDto[]).map(mapDtoToRoom);
    return buildFloorsFromRooms(rooms);
  },

  getRoomsByFloor: async (floorNumber: number): Promise<Room[]> => {
    const dtos = await apiClient.get(`/Room/floor/${floorNumber}`);
    return (dtos as RoomApiDto[]).map(mapDtoToRoom);
  },

  getMapData: async (): Promise<Floor[]> => {
    return roomMapService.getFloors();
  },
};
