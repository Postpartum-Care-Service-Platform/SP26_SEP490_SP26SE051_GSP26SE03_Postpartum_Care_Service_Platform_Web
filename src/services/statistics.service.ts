import apiClient from './apiClient';

// ── Staff statistics types ──────────────────────────────────────────────────
export interface StaffPerformanceItem {
  staffId: string;
  staffName: string;
  totalHours: number;
  serviceCount: number;
  avgRating: number | null;
}

export interface StaffCompletionRateItem {
  staffId: string;
  staffName: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  cancelledTasks: number;
  completionRate: number;
  missedRate: number;
}

export interface StaffCompletionRateResponse {
  staff: StaffCompletionRateItem[];
  startDate: string | null;
  endDate: string | null;
}

export interface BestRatedStaffItem {
  staffId: string;
  staffName: string;
  avatar: string | null;
  avgRating: number | null;
  totalFeedback: number;
  totalRevenue: number;
}

export interface BestRatedStaffResponse {
  staff: BestRatedStaffItem[];
  startDate: string | null;
  endDate: string | null;
}

const statisticsService = {
  /**
   * Lấy số dư chưa thanh toán (Outstanding Balance)
   */
  getOutstandingBalance: (): Promise<any> => {
    return apiClient.get('/Statistics/outstanding-balance');
  },

  /**
   * Lấy thống kê bệnh nhân mới (New Patients)
   */
  getNewPatients: (): Promise<any> => {
    return apiClient.get('/Statistics/new-patients');
  },

  /**
   * Lấy thống kê bệnh nhân đang hoạt động (Active Patients)
   */
  getActivePatients: (): Promise<any> => {
    return apiClient.get('/Statistics/active-patients');
  },

  /**
   * Lấy thống kê lịch hẹn hàng tuần (Weekly Appointments)
   */
  getWeeklyAppointments: (): Promise<any> => {
    return apiClient.get('/Statistics/weekly-appointments');
  },

  /**
   * Lấy thống kê bệnh nhân theo giới tính (Patient by Gender)
   */
  getPatientByGender: (): Promise<any> => {
    return apiClient.get('/Statistics/patient-by-gender');
  },

  /**
   * Lấy tổng quan doanh thu (Revenue Overview)
   */
  getRevenueOverview: (): Promise<any> => {
    return apiClient.get('/Statistics/revenue/overview');
  },

  /**
   * Lấy phân bổ trạng thái hợp đồng (Contracts Status Distribution)
   */
  getContractStatusDistribution: (): Promise<any> => {
    return apiClient.get('/Statistics/contracts/status-distribution');
  },

  /**
   * Lấy doanh thu theo gói dịch vụ (Revenue by Service Package)
   */
  getRevenueByServicePackage: (): Promise<any> => {
    return apiClient.get('/Statistics/revenue/by-service-package');
  },

  /**
   * Lấy tải công việc hàng ngày (Daily Schedule Load)
   */
  getDailyScheduleLoad: (): Promise<any> => {
    return apiClient.get('/Statistics/schedules/daily-load');
  },

  /**
   * Lấy hiệu suất nhân viên (Staff Performance) — toàn bộ staff
   */
  getStaffPerformance: (startDate?: string, endDate?: string): Promise<StaffPerformanceItem[]> => {
    return apiClient.get('/Statistics/staff/performance', { params: { startDate, endDate } });
  },

  /**
   * Lấy tỉ lệ hoàn thành của từng nhân viên
   */
  getStaffCompletionRate: (startDate?: string, endDate?: string): Promise<StaffCompletionRateResponse> => {
    return apiClient.get('/Statistics/staff/completion-rate', { params: { startDate, endDate } });
  },

  /**
   * Lấy nhân viên được đánh giá tốt nhất
   */
  getBestRatedStaff: (startDate?: string, endDate?: string, limit = 50): Promise<BestRatedStaffResponse> => {
    return apiClient.get('/Statistics/staff/best-rated', { params: { startDate, endDate, limit } });
  },

  /**
   * Lấy tỉ lệ hoàn thành hoạt động (Activities Completion Rate)
   */
  getActivityCompletionRate: (): Promise<any> => {
    return apiClient.get('/Statistics/activities/completion-rate');
  },

  /**
   * Lấy tăng trưởng khách hàng (Customers Growth)
   */
  getCustomerGrowth: (): Promise<any> => {
    return apiClient.get('/Statistics/customers/growth');
  },

  /**
   * Lấy tóm tắt cấu trúc gia đình (Family Structure Summary)
   */
  getFamilyStructureSummary: (): Promise<any> => {
    return apiClient.get('/Statistics/family/structure-summary');
  },

  /**
   * Lấy danh sách dịch vụ phổ biến (Popular Services)
   */
  getPopularServices: (): Promise<any> => {
    return apiClient.get('/Statistics/services/popular');
  },

  /**
   * Lấy phân bổ đánh giá phản hồi (Feedback Rating Distribution)
   */
  getFeedbackRatingDistribution: (): Promise<any> => {
    return apiClient.get('/Statistics/feedback/rating-distribution');
  },
};

export default statisticsService;
