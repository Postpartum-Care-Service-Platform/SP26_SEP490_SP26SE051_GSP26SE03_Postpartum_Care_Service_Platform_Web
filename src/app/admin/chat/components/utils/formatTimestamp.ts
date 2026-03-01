export function formatRelativeTimestamp(timestamp: string): string {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const isToday = now.toDateString() === messageDate.toDateString();
  const isYesterday = diffInDays === 1 && now.toDateString() !== messageDate.toDateString();

  if (diffInMinutes < 1) {
    return 'just now';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  }

  if (isToday) {
    return formatTime(timestamp);
  }

  if (isYesterday) {
    return 'yesterday';
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const isSameYear = now.getFullYear() === messageDate.getFullYear();
  if (isSameYear) {
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

