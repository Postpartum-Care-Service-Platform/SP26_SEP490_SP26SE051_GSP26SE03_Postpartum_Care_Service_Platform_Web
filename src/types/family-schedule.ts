export interface StaffScheduleSummary {
  id: number;
  staffId: string;
  staffName: string;
  staffAvatar: string | null;
  isChecked: boolean;
  checkedAt: string | null;
}

export interface FamilyScheduleItem {
  id: number;
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  packageId: number;
  packageName: string;
  roomId: number;
  roomName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  dayNo: number;
  activity: string;
  target: 'Mom' | 'Baby' | string;
  status: 'Done' | 'Missed' | 'Pending' | string;
  note: string | null;
  title: string;
  description: string;
  amenityTicketId: number | null;
  amenityServiceId: number | null;
  staffSchedules: StaffScheduleSummary[];
}

export interface FamilyScheduleDateRangeParams {
  dateFrom: string;
  dateTo: string;
  customerId: string;
}
