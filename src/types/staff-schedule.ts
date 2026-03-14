export interface FamilyScheduleResponse {
  id: number;
  customerId: string;
  customerName: string;
  packageId: number;
  packageName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  dayNo: number;
  activity: string;
  target: 'Mom' | 'Baby' | 'Both';
  status: 'Pending' | 'Completed' | 'Missed' | 'InProgress';
  note: string | null;
  contractId: number;
}

export interface StaffSchedule {
  id: number;
  staffId: string;
  staffName: string;
  managerId: string;
  managerName: string;
  familyScheduleId: number;
  isChecked: boolean;
  checkedAt: string | null;
  familyScheduleResponse: FamilyScheduleResponse;
}

export interface GetStaffScheduleParams {
  staffId: string;
  from: string;
  to: string;
}
