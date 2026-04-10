export function formatMessageTime(timestamp: string): string {
  // Loại bỏ 'Z' ở cuối nếu có để tránh JS tự động chuyển đổi múi giờ (nếu server gửi giờ local kèm Z)
  const normalizedTimestamp = timestamp.endsWith('Z') ? timestamp.slice(0, -1) : timestamp;
  const date = new Date(normalizedTimestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatMessageDate(timestamp: string): string {
  const normalizedTimestamp = timestamp.endsWith('Z') ? timestamp.slice(0, -1) : timestamp;
  const date = new Date(normalizedTimestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return 'Hôm nay';
  }

  if (isYesterday) {
    return 'Hôm qua';
  }

  const isSameYear = date.getFullYear() === today.getFullYear();
  if (isSameYear) {
    return date.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' });
  }

  return date.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' });
}


export function shouldShowDateSeparator(
  currentMessage: string,
  previousMessage: string | null
): boolean {
  if (!previousMessage) {
    return true;
  }

  const current = new Date(currentMessage);
  const previous = new Date(previousMessage);

  return current.toDateString() !== previous.toDateString();
}

