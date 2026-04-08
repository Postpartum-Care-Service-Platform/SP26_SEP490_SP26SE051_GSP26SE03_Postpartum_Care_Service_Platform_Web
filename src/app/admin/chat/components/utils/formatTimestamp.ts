export function formatRelativeTimestamp(timestamp: string): string {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const isToday = now.toDateString() === messageDate.toDateString();
  const isYesterday = diffInDays === 1 && now.toDateString() !== messageDate.toDateString();

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  }

  if (isToday) {
    return formatTime(timestamp);
  }

  if (isYesterday) {
    return 'hôm qua';
  }

  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const isSameYear = now.getFullYear() === messageDate.getFullYear();
  if (isSameYear) {
    return messageDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
  }

  return messageDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', { hour: 'numeric', minute: '2-digit', hour12: false });
}

