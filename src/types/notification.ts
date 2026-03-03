export interface Notification {
  id: number;
  amenityTicketId: number | null;
  staffId: string | null;
  staffName: string | null;
  receiverId: string | null;
  receiverName: string | null;
  notificationTypeId: number | null;
  notificationTypeName: string | null;
  title: string | null;
  content: string | null;
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

