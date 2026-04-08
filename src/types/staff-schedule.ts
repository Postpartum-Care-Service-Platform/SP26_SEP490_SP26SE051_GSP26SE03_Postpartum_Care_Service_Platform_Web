export interface FamilyScheduleResponse {
  id: number;
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  packageId: number;
  packageName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  dayNo: number;
  activity: string;
  target: 'Mom' | 'Baby' | 'Both' | string;
  status: 'Pending' | 'Completed' | 'Missed' | 'InProgress' | 'Done' | string;
  note: string | null;
  contractId: number | null;
  amenityServiceId?: number | null;
  title?: string;
}

export interface StaffSchedule {
  id: number;
  staffId: string;
  staffName: string;
  staffAvatar: string | null;
  roomId: number | null;
  roomName: string | null;
  managerId: string;
  managerName: string;
  familyScheduleId: number;
  isChecked: boolean;
  checkedAt: string | null;
  familyScheduleResponse: FamilyScheduleResponse;
}

export interface GetStaffScheduleParams {
  staffId?: string;
  from: string;
  to: string;
}

export interface ActivityInSchedule {
  staffScheduleId: number;
  isChecked: boolean;
  checkedAt: string | null;
  managerId: string;
  managerName: string;
  familyScheduleId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  dayNo: number;
  activity: string;
  title: string;
  description: string;
  target: string;
  status: string;
  note: string | null;
  scheduledDate: string;
}

export interface BookingInSchedule {
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  bookingId: number;
  bookingStartDate: string;
  bookingEndDate: string;
  bookingStatus: string;
  packageId: number;
  packageName: string;
  roomId: number | null;
  roomName: string | null;
  activities: ActivityInSchedule[];
}

export interface StaffScheduleAllResponse {
  staffId: string;
  staffEmail: string;
  staffUsername: string;
  staffPhone: string;
  staffAvatar: string | null;
  staffRole: string;
  staffFullName: string;
  staffMemberType: string;
  bookings: BookingInSchedule[];
}
