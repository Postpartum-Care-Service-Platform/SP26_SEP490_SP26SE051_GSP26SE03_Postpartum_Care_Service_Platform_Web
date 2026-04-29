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
  getOutstandingBalance: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/outstanding-balance', { params });
  },

  /**
   * Lấy thống kê bệnh nhân mới (New Patients)
   */
  getNewCustomers: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/new-customers', { params });
  },

  /**
   * Lấy thống kê bệnh nhân đang hoạt động (Active Patients)
   */
  getActiveCustomers: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/active-customers', { params });
  },

  /**
   * Lấy thống kê lịch hẹn hàng tuần (Weekly Appointments)
   */
  getWeeklyAppointments: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/weekly-appointments', { params });
  },

  /**
   * Lấy thống kê bệnh nhân theo giới tính (Patient by Gender)
   */
  getCustomerByGender: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/customer-by-gender', { params });
  },

  /**
   * Lấy tổng quan doanh thu (Revenue Overview)
   */
  getRevenueOverview: (params?: { period?: string; startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/revenue/overview', { params });
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
  getRevenueByServicePackage: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/revenue/by-service-package', { params });
  },

  /**
   * Lấy tải công việc hàng ngày (Daily Schedule Load)
   */
  getDailyScheduleLoad: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/schedules/daily-load', { params });
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
  getActivityCompletionRate: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/activities/completion-rate', { params });
  },

  /**
   * Lấy tăng trưởng khách hàng (Customers Growth)
   */
  getCustomerGrowth: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/customers/growth', { params });
  },

  /**
   * Lấy tóm tắt cấu trúc gia đình (Family Structure Summary)
   */
  getFamilyStructureSummary: (): Promise<any> => {
    return apiClient.get('/Statistics/family/structure-summary');
  },

  /**
   * Lấy danh sách nhân viên được đánh giá tốt nhất
   */
  getBestRatedStaff: (params?: { startDate?: string; endDate?: string; limit?: number }): Promise<any> => {
    return apiClient.get('/Statistics/staff/best-rated', { params });
  },

  /**
   * Lấy danh sách dịch vụ phổ biến (Popular Services)
   */
  getPopularServices: (params?: { startDate?: string; endDate?: string; limit?: number }): Promise<any> => {
    return apiClient.get('/Statistics/services/popular', { params });
  },

  /**
   * Lấy phân bổ đánh giá phản hồi (Feedback Rating Distribution)
   */
  getFeedbackRatingDistribution: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/feedback/rating-distribution', { params });
  },

  /**
   * Lấy danh sách cuộc hẹn theo ngày
   */
  getAppointmentsByDate: (date: string): Promise<any> => {
    return apiClient.get('/Statistics/appointments', {
      params: { date }
    });
  },

  /**
   * Lấy tăng trưởng doanh thu (Monthly Revenue Growth)
   */
  getRevenueGrowth: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/revenue/growth', { params });
  },

  /**
   * Lấy dòng tiền (Income vs Expense)
   */
  getCashflow: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/cashflow', { params });
  },

  /**
   * Lấy heatmap lịch hẹn (Appointment Heatmap)
   */
  getAppointmentHeatmap: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/appointments/heatmap', { params });
  },

  /**
   * Lấy xu hướng hoàn thành dịch vụ (Service Fulfillment Trends)
   */
  getServiceFulfillmentTrends: (params?: { year?: number }): Promise<any> => {
    return apiClient.get('/Statistics/service-fulfillment-trends', { params });
  },
  
  /**
   * Lấy tóm tắt chỉ số lịch làm việc
   */
  getWorkScheduleSummary: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/work-schedule/summary', { params });
  },

  /**
   * Lấy phân bổ trạng thái lịch làm việc (cho biểu đồ Pie)
   */
  getWorkScheduleStatusBreakdown: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/work-schedule/status-breakdown', { params });
  },

  /**
   * Lấy danh sách hoạt động lịch làm việc gần đây
   */
  getRecentWorkActivities: (params?: { limit?: number }): Promise<any> => {
    return apiClient.get('/Statistics/work-schedule/activities', { params });
  },
};

export default statisticsService;
