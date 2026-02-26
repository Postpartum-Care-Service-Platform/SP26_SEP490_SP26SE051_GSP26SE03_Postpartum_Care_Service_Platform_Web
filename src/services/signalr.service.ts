import * as signalR from '@microsoft/signalr';

export interface MessageEvent {
    id: number;
    content: string;
    senderType: 'Customer' | 'Staff' | 'AI';
    senderId?: string;
    senderName?: string;
    createdAt: string;
    isRead: boolean;
    conversationId: number;
}

export interface TypingEvent {
    userId: string;
    userName: string;
    conversationId: number;
    isTyping: boolean;
    timestamp: string;
}

export interface StaffJoinedEvent {
    staffId: string;
    staffName: string;
    conversationId: number;
    requestId: number;
    message: string;
    timestamp: string;
}

export interface SupportRequestEvent {
    requestId: number;
    conversationId: number;
    customer?: {
        id: string;
        name: string;
        email: string;
    };
    reason?: string;
    timestamp: string;
}

export interface MessagesReadEvent {
    conversationId: number;
    readBy: string;
    readByName: string;
    timestamp: string;
}

export interface SupportRequestCreatedEvent {
    requestId: number;
    conversationId: number;
    message: string;
    timestamp: string;
}

export interface SupportRequestAcceptedEvent {
    requestId: number;
    conversationId: number;
    customer?: {
        id: string;
        name: string;
        email: string;
    };
    message: string;
    timestamp: string;
}

export interface SupportResolvedEvent {
    requestId: number;
    conversationId: number;
    staffId: string;
    staffName: string;
    message: string;
    timestamp: string;
}

export interface UserJoinedEvent {
    userId: string;
    userName: string;
    conversationId: number;
    timestamp: string;
}

export interface UserLeftEvent {
    userId: string;
    userName: string;
    conversationId: number;
    timestamp: string;
}

export interface ErrorEvent {
    message: string;
}

export class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    /**
     * Tạo và khởi tạo connection đến SignalR Hub
     */
    async connect(token: string, hubUrl: string = '/hubs/chat'): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR already connected');
            return;
        }

        // Xây dựng full URL
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5122/api').replace('/api', '');
        const fullUrl = `${baseUrl}${hubUrl}`;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(fullUrl, {
                accessTokenFactory: () => token,
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    // Exponential backoff: 0s, 2s, 10s, 30s, 60s
                    if (retryContext.previousRetryCount === 0) return 0;
                    if (retryContext.previousRetryCount === 1) return 2000;
                    if (retryContext.previousRetryCount === 2) return 10000;
                    if (retryContext.previousRetryCount === 3) return 30000;
                    return 60000;
                },
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Setup reconnection handlers
        this.connection.onreconnecting((error) => {
            console.warn('SignalR reconnecting...', error);
            this.reconnectAttempts++;
        });

        this.connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected:', connectionId);
            this.reconnectAttempts = 0;
        });

        this.connection.onclose((error) => {
            console.error('SignalR connection closed:', error);
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => this.connect(token, hubUrl), 5000);
            }
        });

        try {
            await this.connection.start();
            console.log('SignalR connected successfully');
        } catch (error) {
            console.error('Error connecting to SignalR:', error);
            throw error;
        }
    }

    /**
     * Ngắt kết nối
     */
    async disconnect(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR disconnected');
            } catch (error) {
                console.error('Error disconnecting SignalR:', error);
            }
        }
    }

    /**
     * Kiểm tra trạng thái kết nối
     */
    get connectionState(): signalR.HubConnectionState | null {
        return this.connection?.state ?? null;
    }

    get isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }

    /**
     * Join vào conversation
     */
    async joinConversation(conversationId: number): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('JoinConversation', conversationId);
    }

    /**
     * Leave conversation
     */
    async leaveConversation(conversationId: number): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('LeaveConversation', conversationId);
    }

    /**
     * Gửi tin nhắn
     */
    async sendMessage(conversationId: number, content: string): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('SendMessage', conversationId, content);
    }

    /**
     * Notify typing
     */
    async notifyTyping(conversationId: number, isTyping: boolean): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('NotifyTyping', conversationId, isTyping);
    }

    /**
     * Mark as read
     */
    async markAsRead(conversationId: number): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('MarkAsRead', conversationId);
    }

    /**
     * Request support (Customer)
     */
    async requestSupport(conversationId: number, reason?: string): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('RequestSupport', conversationId, reason);
    }

    /**
     * Accept support request (Staff)
     */
    async acceptSupportRequest(requestId: number): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('AcceptSupportRequest', requestId);
    }

    /**
     * Resolve support (Staff)
     */
    async resolveSupport(requestId: number): Promise<void> {
        if (!this.connection) throw new Error('SignalR not connected');
        await this.connection.invoke('ResolveSupport', requestId);
    }

    // ==================== Event Listeners ====================

    /**
     * Lắng nghe tin nhắn mới
     */
    onReceiveMessage(callback: (message: MessageEvent) => void): void {
        this.connection?.on('ReceiveMessage', callback);
    }

    /**
     * Lắng nghe typing indicator
     */
    onUserTyping(callback: (event: TypingEvent) => void): void {
        this.connection?.on('UserTyping', callback);
    }

    /**
     * Lắng nghe messages read
     */
    onMessagesRead(callback: (event: MessagesReadEvent) => void): void {
        this.connection?.on('MessagesRead', callback);
    }

    /**
     * Lắng nghe staff joined
     */
    onStaffJoined(callback: (event: StaffJoinedEvent) => void): void {
        this.connection?.on('StaffJoined', callback);
    }

    /**
     * Lắng nghe support request created (Customer)
     */
    onSupportRequestCreated(callback: (event: SupportRequestCreatedEvent) => void): void {
        this.connection?.on('SupportRequestCreated', callback);
    }

    /**
     * Lắng nghe new support request (Staff)
     */
    onNewSupportRequest(callback: (event: SupportRequestEvent) => void): void {
        this.connection?.on('NewSupportRequest', callback);
    }

    /**
     * Lắng nghe support request accepted (Staff)
     */
    onSupportRequestAccepted(callback: (event: SupportRequestAcceptedEvent) => void): void {
        this.connection?.on('SupportRequestAccepted', callback);
    }

    /**
     * Lắng nghe support resolved
     */
    onSupportResolved(callback: (event: SupportResolvedEvent) => void): void {
        this.connection?.on('SupportResolved', callback);
    }

    /**
     * Lắng nghe user joined
     */
    onUserJoined(callback: (event: UserJoinedEvent) => void): void {
        this.connection?.on('UserJoined', callback);
    }

    /**
     * Lắng nghe user left
     */
    onUserLeft(callback: (event: UserLeftEvent) => void): void {
        this.connection?.on('UserLeft', callback);
    }

    /**
     * Lắng nghe errors
     */
    onError(callback: (error: ErrorEvent) => void): void {
        this.connection?.on('Error', callback);
    }

    /**
     * Remove event listener
     */
    off(eventName: string, callback?: (...args: unknown[]) => void): void {
        if (callback) {
            this.connection?.off(eventName, callback);
        } else {
            this.connection?.off(eventName);
        }
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners(): void {
        const events = [
            'ReceiveMessage',
            'UserTyping',
            'MessagesRead',
            'StaffJoined',
            'SupportRequestCreated',
            'NewSupportRequest',
            'SupportRequestAccepted',
            'SupportResolved',
            'UserJoined',
            'UserLeft',
            'Error',
        ];

        events.forEach((event) => this.connection?.off(event));
    }
}

// Singleton instance
let signalRInstance: SignalRService | null = null;

export const getSignalRService = (): SignalRService => {
    if (!signalRInstance) {
        signalRInstance = new SignalRService();
    }
    return signalRInstance;
};

export default SignalRService;
