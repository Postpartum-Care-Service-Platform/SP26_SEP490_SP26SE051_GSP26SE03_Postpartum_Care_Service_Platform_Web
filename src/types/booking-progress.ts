export interface BookingProgressActivity {
  familyScheduleId: number;
  dayNo: number;
  activityName: string;
  title: string;
  description: string;
  workDate: string;
  startTime: string;
  endTime: string;
  target: 'Mom' | 'Baby' | 'Both' | string;
  status: 'Done' | 'Missed' | 'Pending' | 'Scheduled' | 'InProgress' | string;
  note: string | null;
  staffName: string | null;
  staffAvatar: string | null;
  isChecked: boolean;
  checkedAt: string | null;
}

export interface BookingProgress {
  bookingId: number;
  customerName: string;
  customerPhone: string;
  customerAvatar: string | null;
  packageName: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  bookingStatus: 'InProgress' | 'Completed' | 'Pending' | string;
  contractStatus: 'Signed' | 'Unsigned' | string;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  missedActivities: number;
  cancelledActivities: number;
  progressPercent: number;
  activities: BookingProgressActivity[];
}
