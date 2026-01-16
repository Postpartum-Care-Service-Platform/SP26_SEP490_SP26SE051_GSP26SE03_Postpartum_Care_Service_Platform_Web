export interface Notification {
  id: number;
  amenityTicketId: number | null;
  staffId: string | null;
  staffName: string | null;
  receiverId: string | null;
  receiverName: string | null;
  notificationTypeId: number;
  notificationTypeName: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: 'Unread' | 'Read';
}

export interface CreateNotificationRequest {
  amenityTicketId?: number | null;
  staffId?: string | null;
  receiverId?: string | null;
  notificationTypeId: number;
  title: string;
  content: string;
}

export interface UpdateNotificationRequest {
  amenityTicketId?: number | null;
  staffId?: string | null;
  receiverId?: string | null;
  notificationTypeId?: number;
  title?: string;
  content?: string;
  status?: 'Unread' | 'Read';
}

