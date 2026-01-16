const notificationTypeTranslations: Record<string, string> = {
  'For_cutomers': 'Cho khách hàng',
  'For_customers': 'Cho khách hàng',
  'for_cutomers': 'Cho khách hàng',
  'for_customers': 'Cho khách hàng',
  'For Customers': 'Cho khách hàng',
  'For customers': 'Cho khách hàng',
  'for customers': 'Cho khách hàng',
  'For_staff': 'Cho nhân viên',
  'For_staffs': 'Cho nhân viên',
  'For Staff': 'Cho nhân viên',
  'For staff': 'Cho nhân viên',
  'for staff': 'Cho nhân viên',
  'System': 'Hệ thống',
  'system': 'Hệ thống',
  'Admin': 'Quản trị viên',
  'admin': 'Quản trị viên',
  'Report': 'Báo cáo',
  'report': 'Báo cáo',
  'Order': 'Đơn hàng',
  'order': 'Đơn hàng',
  'Meeting': 'Cuộc họp',
  'meeting': 'Cuộc họp',
  'Alert': 'Cảnh báo',
  'alert': 'Cảnh báo',
  'Success': 'Thành công',
  'success': 'Thành công',
  'Error': 'Lỗi',
  'error': 'Lỗi',
  'Info': 'Thông tin',
  'info': 'Thông tin',
};

export function translateNotificationTypeName(name: string | null | undefined): string {
  if (!name) {
    return 'Không xác định';
  }

  const trimmedName = name.trim();

  if (notificationTypeTranslations[trimmedName]) {
    return notificationTypeTranslations[trimmedName];
  }

  return trimmedName;
}

