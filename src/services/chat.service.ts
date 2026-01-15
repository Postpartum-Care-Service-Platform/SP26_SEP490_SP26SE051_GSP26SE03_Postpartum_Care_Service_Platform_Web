import apiClient from './apiClient';

// Request types
export interface CreateConversationRequest {
    name?: string;
}

export interface SendMessageRequest {
    content: string;
}

export interface RequestSupportRequest {
    reason?: string;
}

// Response types
export interface MessageResponse {
    id: number;
    content: string;
    senderType: 'Customer' | 'Staff' | 'AI';
    senderId?: string;
    senderName?: string;
    createdAt: string;
    isRead: boolean;
}

export interface ConversationResponse {
    id: number;
    name?: string;
    createdAt: string;
    messages: MessageResponse[];
}

export interface ChatResponse {
    userMessage: MessageResponse;
    aiMessage: MessageResponse;
    // BE có thể trả về PascalCase hoặc camelCase
    aiStructuredData?: AiStructuredResponse;
    AiStructuredData?: AiStructuredResponse;
}

// Structured response từ AI
export interface AiStructuredResponse {
    type: string;
    text: string;
    data?: unknown;
}

// Các loại response từ AI
export const AiResponseTypes = {
    Text: 'text',
    PackagesTable: 'packages_table',
    PackageDetails: 'package_details',
    ActivitiesList: 'activities_list',
    AppointmentsList: 'appointments_list',
    AppointmentCreated: 'appointment_created',
    AppointmentCancelled: 'appointment_cancelled',
    AppointmentUpdated: 'appointment_updated',
    SupportRequested: 'support_requested',
    PackagesComparison: 'packages_comparison',
    Error: 'error',
    NeedMoreInfo: 'need_more_info',
} as const;

// Package data structure (match với BE response)
export interface PackageData {
    id: number;
    name: string;
    description: string;
    duration_days: number;
    price: number;
    is_active: boolean;
}

export interface SupportRequestResponse {
    id: number;
    conversationId: number;
    customerId: string;
    customerName: string;
    reason?: string;
    status: string;
    createdAt: string;
}

// Chat Service - baseUrl đã có /api nên chỉ cần /Chat/...
const chatService = {
    // Lấy danh sách conversations
    getConversations: (): Promise<ConversationResponse[]> => {
        return apiClient.get('/Chat/conversations');
    },

    // Lấy chi tiết conversation với messages
    getConversation: (id: number): Promise<ConversationResponse> => {
        return apiClient.get(`/Chat/conversations/${id}`);
    },

    // Tạo conversation mới
    createConversation: (data?: CreateConversationRequest): Promise<ConversationResponse> => {
        return apiClient.post('/Chat/conversations', data || {});
    },

    // Gửi tin nhắn và nhận phản hồi AI
    sendMessage: (conversationId: number, content: string): Promise<ChatResponse> => {
        return apiClient.post(`/Chat/conversations/${conversationId}/messages`, { content });
    },

    // Đánh dấu messages đã đọc
    markAsRead: (conversationId: number): Promise<void> => {
        return apiClient.put(`/Chat/conversations/${conversationId}/messages/read`);
    },

    // Yêu cầu hỗ trợ từ nhân viên
    requestSupport: (conversationId: number, reason?: string): Promise<SupportRequestResponse> => {
        return apiClient.post(`/Chat/conversations/${conversationId}/request-support`, { reason });
    },

    // Staff: Lấy danh sách yêu cầu hỗ trợ đang chờ
    getPendingSupportRequests: (): Promise<SupportRequestResponse[]> => {
        return apiClient.get('/Chat/support-requests');
    },

    // Staff: Lấy yêu cầu hỗ trợ của mình
    getMySupportRequests: (): Promise<SupportRequestResponse[]> => {
        return apiClient.get('/Chat/support-requests/my');
    },

    // Staff: Nhận yêu cầu hỗ trợ
    acceptSupportRequest: (requestId: number): Promise<SupportRequestResponse> => {
        return apiClient.put(`/Chat/support-requests/${requestId}/accept`);
    },

    // Staff: Đánh dấu đã giải quyết
    resolveSupportRequest: (requestId: number): Promise<SupportRequestResponse> => {
        return apiClient.put(`/Chat/support-requests/${requestId}/resolve`);
    },

    // Staff: Gửi tin nhắn vào conversation
    sendStaffMessage: (conversationId: number, content: string): Promise<MessageResponse> => {
        return apiClient.post(`/Chat/conversations/${conversationId}/staff-message`, { content });
    },
};

export default chatService;
