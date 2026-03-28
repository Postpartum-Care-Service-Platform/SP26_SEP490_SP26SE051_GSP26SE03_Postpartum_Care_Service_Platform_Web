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
