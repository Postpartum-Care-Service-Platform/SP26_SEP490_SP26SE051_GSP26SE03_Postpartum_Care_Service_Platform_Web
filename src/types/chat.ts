export type ChatMode = 'ai' | 'agent';

export type ChatUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ChatSender = 'me' | 'other' | 'system';

export type ChatMessageStatus = 'sending' | 'sent' | 'failed';

export type ChatMessage = {
  id: string;
  chatId: string;
  sender: ChatSender;
  author?: ChatUser;
  text: string;
  createdAt: string; // ISO
  status?: ChatMessageStatus;
};

