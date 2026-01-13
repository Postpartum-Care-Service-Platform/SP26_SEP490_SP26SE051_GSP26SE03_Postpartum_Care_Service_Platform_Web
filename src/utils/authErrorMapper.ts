type Field = 'username' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'otp';

export function mapRegisterErrorToField(message: string | undefined): Field | null {
  const m = (message ?? '').toLowerCase();

  if (!m) return null;

  if (m.includes('tên đăng nhập') || m.includes('username')) return 'username';
  if (m.includes('số điện thoại') || m.includes('phone')) return 'phone';
  if (m.includes('email')) return 'email';
  if (m.includes('mật khẩu') || m.includes('password')) return 'password';
  if (m.includes('xác nhận') || m.includes('confirm')) return 'confirmPassword';

  return null;
}

