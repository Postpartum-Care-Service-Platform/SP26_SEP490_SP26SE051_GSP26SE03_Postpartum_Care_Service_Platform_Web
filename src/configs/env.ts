const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined. Vui lòng cấu hình biến môi trường cho URL backend.');
}

// Debug nhanh trong local để biết Next đang đọc env nào (chỉ hiện ở dev).
if (process.env.NODE_ENV !== 'production') {
  console.log('[env] NEXT_PUBLIC_API_URL =', NEXT_PUBLIC_API_URL);
}

export const env = {
  // Bắt buộc phải cấu hình URL backend qua biến môi trường,
  // không fallback localhost nữa để tránh trỏ nhầm môi trường.
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 30000),
} as const;
