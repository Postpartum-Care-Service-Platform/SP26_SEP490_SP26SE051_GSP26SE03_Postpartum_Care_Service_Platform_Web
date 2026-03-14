const notificationTypeTranslations: Record<string, string> = {
  'For_all': 'Tất cả',
  'for_all': 'Tất cả',
  'For all': 'Tất cả',
  'For All': 'Tất cả',
  'For_cutomers': 'Cho khách hàng',
  'For_customers': 'Cho khách hàng',
  'for_cutomers': 'Cho khách hàng',
  'for_customers': 'Cho khách hàng',
  'For Customers': 'Cho khách hàng',
  'For customers': 'Cho khách hàng',
  'for customers': 'Cho khách hàng',

  'For_staff': 'Cho nhân viên',
  'For_staffs': 'Cho nhân viên',
  'for_staff': 'Cho nhân viên',
  'for_staffs': 'Cho nhân viên',
  'For Staff': 'Cho nhân viên',
  'For staff': 'Cho nhân viên',
  'for staff': 'Cho nhân viên',

  'For_managers': 'Cho quản lý',
  'for_managers': 'Cho quản lý',
  'For managers': 'Cho quản lý',
  'For Managers': 'Cho quản lý',
  'for managers': 'Cho quản lý',

  'For_admins': 'Cho quản trị viên',
  'For_admin': 'Cho quản trị viên',
  'for_admins': 'Cho quản trị viên',
  'for_admin': 'Cho quản trị viên',
  'For Admins': 'Cho quản trị viên',
  'For Admin': 'Cho quản trị viên',
  'For admins': 'Cho quản trị viên',
  'For admin': 'Cho quản trị viên',
  'for admins': 'Cho quản trị viên',
  'for admin': 'Cho quản trị viên',

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

