export type ChatMode = 'ai' | 'agent';

export type ChatUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ChatSender = 'me' | 'other' | 'system';

export type ChatMessageStatus = 'sending' | 'sent' | 'failed';

// Structured data từ AI
export type ChatStructuredData = {
  type: string;
  text: string;
  data?: unknown;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  sender: ChatSender;
  author?: ChatUser;
  text: string;
  createdAt: string; // ISO
  status?: ChatMessageStatus;
  structuredData?: ChatStructuredData; // Dữ liệu có cấu trúc từ AI
};

