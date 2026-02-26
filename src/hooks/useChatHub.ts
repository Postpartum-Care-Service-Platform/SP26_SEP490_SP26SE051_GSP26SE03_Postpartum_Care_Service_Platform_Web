import { HubConnectionState } from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
    getSignalRService,
    MessageEvent,
    TypingEvent,
    StaffJoinedEvent,
    SupportRequestEvent,
    MessagesReadEvent,
    SupportRequestCreatedEvent,
    SupportRequestAcceptedEvent,
    SupportResolvedEvent,
    ErrorEvent,
} from '@/services/signalr.service';

interface UseChatHubOptions {
    token: string | null;
    autoConnect?: boolean;
    onConnected?: () => void;
    onDisconnected?: () => void;
    onReconnecting?: () => void;
    onReconnected?: () => void;
}

export const useChatHub = (options: UseChatHubOptions) => {
    const { token, autoConnect = true, onConnected, onDisconnected, onReconnecting: _onReconnecting, onReconnected: _onReconnected } = options;

    const [connectionState, setConnectionState] = useState<HubConnectionState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signalRRef = useRef(getSignalRService());

    /**
     * Kết nối đến SignalR Hub
     */
    const connect = useCallback(async () => {
        if (!token) {
            setError('No authentication token provided');
            console.warn('SignalR: Cannot connect without token');
            return;
        }

        if (token.length < 20) {
            setError('Invalid token format');
            console.warn('SignalR: Token seems invalid');
            return;
        }

        try {
            setError(null);
            await signalRRef.current.connect(token);
            setIsConnected(true);
            setConnectionState(signalRRef.current.connectionState);
            onConnected?.();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect to chat server';
            setError(errorMessage);
            setIsConnected(false);
            console.error('SignalR connection error:', err);
        }
    }, [token, onConnected]);

    /**
     * Ngắt kết nối
     */
    const disconnect = useCallback(async () => {
        try {
            await signalRRef.current.disconnect();
            setIsConnected(false);
            setConnectionState(null);
            onDisconnected?.();
        } catch (err) {
            console.error('SignalR disconnect error:', err);
        }
    }, [onDisconnected]);

    /**
     * Join conversation
     */
    const joinConversation = useCallback(async (conversationId: number) => {
        try {
            await signalRRef.current.joinConversation(conversationId);
        } catch (err) {
            console.error('Error joining conversation:', err);
            throw err;
        }
    }, []);

    /**
     * Leave conversation
     */
    const leaveConversation = useCallback(async (conversationId: number) => {
        try {
            await signalRRef.current.leaveConversation(conversationId);
        } catch (err) {
            console.error('Error leaving conversation:', err);
        }
    }, []);

    /**
     * Gửi tin nhắn
     */
    const sendMessage = useCallback(async (conversationId: number, content: string) => {
        try {
            await signalRRef.current.sendMessage(conversationId, content);
        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    }, []);

    /**
     * Notify typing (with throttle)
     */
    const notifyTyping = useCallback(async (conversationId: number, isTyping: boolean) => {
        try {
            await signalRRef.current.notifyTyping(conversationId, isTyping);
        } catch (err) {
            console.error('Error notifying typing:', err);
        }
    }, []);

    /**
     * Mark as read
     */
    const markAsRead = useCallback(async (conversationId: number) => {
        try {
            await signalRRef.current.markAsRead(conversationId);
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    }, []);

    /**
     * Request support (Customer)
     */
    const requestSupport = useCallback(async (conversationId: number, reason?: string) => {
        try {
            await signalRRef.current.requestSupport(conversationId, reason);
        } catch (err) {
            console.error('Error requesting support:', err);
            throw err;
        }
    }, []);

    /**
     * Accept support request (Staff)
     */
    const acceptSupportRequest = useCallback(async (requestId: number) => {
        try {
            await signalRRef.current.acceptSupportRequest(requestId);
        } catch (err) {
            console.error('Error accepting support request:', err);
            throw err;
        }
    }, []);

    /**
     * Resolve support (Staff)
     */
    const resolveSupport = useCallback(async (requestId: number) => {
        try {
            await signalRRef.current.resolveSupport(requestId);
        } catch (err) {
            console.error('Error resolving support:', err);
            throw err;
        }
    }, []);

    // ==================== Event Listeners ====================

    /**
     * Subscribe to receive message event
     */
    const onReceiveMessage = useCallback((callback: (message: MessageEvent) => void) => {
        signalRRef.current.onReceiveMessage(callback);
        return () => signalRRef.current.off('ReceiveMessage', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to typing event
     */
    const onUserTyping = useCallback((callback: (event: TypingEvent) => void) => {
        signalRRef.current.onUserTyping(callback);
        return () => signalRRef.current.off('UserTyping', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to messages read event
     */
    const onMessagesRead = useCallback((callback: (event: MessagesReadEvent) => void) => {
        signalRRef.current.onMessagesRead(callback);
        return () => signalRRef.current.off('MessagesRead', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to staff joined event
     */
    const onStaffJoined = useCallback((callback: (event: StaffJoinedEvent) => void) => {
        signalRRef.current.onStaffJoined(callback);
        return () => signalRRef.current.off('StaffJoined', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to support request created event (Customer)
     */
    const onSupportRequestCreated = useCallback((callback: (event: SupportRequestCreatedEvent) => void) => {
        signalRRef.current.onSupportRequestCreated(callback);
        return () => signalRRef.current.off('SupportRequestCreated', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to new support request event (Staff)
     */
    const onNewSupportRequest = useCallback((callback: (event: SupportRequestEvent) => void) => {
        signalRRef.current.onNewSupportRequest(callback);
        return () => signalRRef.current.off('NewSupportRequest', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to support request accepted event (Staff)
     */
    const onSupportRequestAccepted = useCallback((callback: (event: SupportRequestAcceptedEvent) => void) => {
        signalRRef.current.onSupportRequestAccepted(callback);
        return () => signalRRef.current.off('SupportRequestAccepted', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to support resolved event
     */
    const onSupportResolved = useCallback((callback: (event: SupportResolvedEvent) => void) => {
        signalRRef.current.onSupportResolved(callback);
        return () => signalRRef.current.off('SupportResolved', callback as (...args: unknown[]) => void);
    }, []);

    /**
     * Subscribe to error event
     */
    const onError = useCallback((callback: (error: ErrorEvent) => void) => {
        signalRRef.current.onError(callback);
        return () => signalRRef.current.off('Error', callback as (...args: unknown[]) => void);
    }, []);

    // ==================== Effects ====================

    /**
     * Auto connect on mount
     */
    useEffect(() => {
        if (autoConnect && token && token.length > 20) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            void connect();
        }
    }, [autoConnect, token, connect]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        const service = signalRRef.current;
        return () => {
            service.removeAllListeners();
        };
    }, []);

    /**
     * Update connection state periodically
     */
    useEffect(() => {
        const service = signalRRef.current;
        const interval = setInterval(() => {
            const state = service.connectionState;
            setConnectionState(state);
            setIsConnected(service.isConnected);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        // Connection state
        isConnected,
        connectionState,
        error,

        // Connection methods
        connect,
        disconnect,

        // Conversation methods
        joinConversation,
        leaveConversation,

        // Message methods
        sendMessage,
        notifyTyping,
        markAsRead,

        // Support methods
        requestSupport,
        acceptSupportRequest,
        resolveSupport,

        // Event listeners
        onReceiveMessage,
        onUserTyping,
        onMessagesRead,
        onStaffJoined,
        onSupportRequestCreated,
        onNewSupportRequest,
        onSupportRequestAccepted,
        onSupportResolved,
        onError,
    };
};

export default useChatHub;
