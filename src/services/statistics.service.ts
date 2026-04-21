import apiClient from './apiClient';

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
   * Lấy hiệu suất nhân viên (Staff Performance)
   */
  getStaffPerformance: (params?: { startDate?: string; endDate?: string }): Promise<any> => {
    return apiClient.get('/Statistics/staff/performance', { params });
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
};

export default statisticsService;
