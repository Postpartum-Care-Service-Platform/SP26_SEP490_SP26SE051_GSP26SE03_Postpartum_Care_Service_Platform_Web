import apiClient from './apiClient';

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
   * Lấy hiệu suất nhân viên (Staff Performance)
   */
  getStaffPerformance: (): Promise<any> => {
    return apiClient.get('/Statistics/staff/performance');
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
  /**
   * Lấy danh sách cuộc hẹn theo ngày
   */
  getAppointmentsByDate: (date: string): Promise<any> => {
    return apiClient.get('/Statistics/appointments', {
      params: { date }
    });
  },
};

export default statisticsService;
