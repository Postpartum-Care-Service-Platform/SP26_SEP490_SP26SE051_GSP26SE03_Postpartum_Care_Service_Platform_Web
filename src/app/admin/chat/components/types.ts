export type ChatEntry = {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
    name: string;
  }>;
};

export type ChatConversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string | null;
  isOnline: boolean;
  messages: Message[];
};
