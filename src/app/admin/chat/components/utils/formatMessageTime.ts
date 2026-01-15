export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatMessageDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return 'Today';
  }

  if (isYesterday) {
    return 'Yesterday';
  }

  const isSameYear = date.getFullYear() === today.getFullYear();
  if (isSameYear) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

