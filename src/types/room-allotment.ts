export type RoomCondition = 'Stable' | 'Under Observation' | 'Critical' | 'Recovering' | 'Discharged' | 'Observation';

export type RoomStatus = 'Reserved' | 'Occupied' | 'Cleaning Scheduled' | 'Needs Repair' | 'Available' | 'Maintenance';

export interface RoomAllotment {
  id: number;
  roomId: string;
  patientName: string;
  patientAvatar: string | null;
  admissionDate: string;
  contact: string;
  condition: RoomCondition;
  doctorAssigned: string;
  status: RoomStatus;
}

export interface Room {
  id: number;
  roomTypeId: number;
  roomTypeName: string;
  name: string;
  floor: number;
  status: RoomStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoomRequest {
  roomTypeId: number;
  name: string;
  floor: number;
  status: RoomStatus;
  isActive: boolean;
}

