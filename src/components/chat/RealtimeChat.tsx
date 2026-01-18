'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';
import { MessageEvent } from '@/services/signalr.service';

interface RealtimeChatProps {
    conversationId: number;
    onClose?: () => void;
}

/**
 * Component chat realtime sử dụng SignalR
 * Tích hợp với AuthContext để lấy token tự động
 */
export default function RealtimeChat({ conversationId, onClose }: RealtimeChatProps) {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<MessageEvent[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [isStaffAvailable, setIsStaffAvailable] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        isConnected,
        error,
        joinConversation,
        leaveConversation,
        sendMessage,
        notifyTyping,
        markAsRead,
        requestSupport,
        onReceiveMessage,
        onUserTyping,
        onStaffJoined,
        onSupportRequestCreated,
        onError,
    } = useChatHub({
        token: token || '',
        autoConnect: true,
        onConnected: () => {
            console.log('✅ Đã kết nối chat realtime');
        },
        onDisconnected: () => {
            console.log('❌ Mất kết nối chat');
        },
    });

    // Join conversation khi mount
    useEffect(() => {
        if (isConnected && conversationId) {
            joinConversation(conversationId);
            markAsRead(conversationId);
        }

        return () => {
            if (isConnected && conversationId) {
                leaveConversation(conversationId);
            }
        };
    }, [isConnected, conversationId, joinConversation, leaveConversation, markAsRead]);

    // Lắng nghe tin nhắn mới
    useEffect(() => {
        const unsubscribe = onReceiveMessage((message) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => {
                    // Tránh duplicate
                    if (prev.some((m) => m.id === message.id)) {
                        return prev;
                    }
                    return [...prev, message];
                });

                // Auto scroll to bottom
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        });

        return unsubscribe;
    }, [conversationId, onReceiveMessage]);

    // Lắng nghe typing indicator
    useEffect(() => {
        const unsubscribe = onUserTyping((event) => {
            if (event.conversationId === conversationId && event.userId !== user?.id) {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev);
                    if (event.isTyping) {
                        newSet.add(event.userName);
                    } else {
                        newSet.delete(event.userName);
                    }
                    return newSet;
                });

                // Auto clear typing after 3s
                setTimeout(() => {
                    setTypingUsers((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(event.userName);
                        return newSet;
                    });
                }, 3000);
            }
        });

        return unsubscribe;
    }, [conversationId, user?.id, onUserTyping]);

    // Lắng nghe staff joined
    useEffect(() => {
        const unsubscribe = onStaffJoined((event) => {
            if (event.conversationId === conversationId) {
                setIsStaffAvailable(true);
                // Add system message
                const systemMessage: MessageEvent = {
                    id: Date.now(),
                    content: event.message,
                    senderType: 'AI',
                    senderName: 'Hệ thống',
                    createdAt: event.timestamp,
                    isRead: true,
                    conversationId: conversationId,
                };
                setMessages((prev) => [...prev, systemMessage]);
            }
        });

        return unsubscribe;
    }, [conversationId, onStaffJoined]);

    // Lắng nghe support request created
    useEffect(() => {
        const unsubscribe = onSupportRequestCreated((event) => {
            if (event.conversationId === conversationId) {
                // Add system message
                const systemMessage: MessageEvent = {
                    id: Date.now(),
                    content: event.message,
                    senderType: 'AI',
                    senderName: 'Hệ thống',
                    createdAt: event.timestamp,
                    isRead: true,
                    conversationId: conversationId,
                };
                setMessages((prev) => [...prev, systemMessage]);
            }
        });

        return unsubscribe;
    }, [conversationId, onSupportRequestCreated]);

    // Lắng nghe errors
    useEffect(() => {
        const unsubscribe = onError((error) => {
            console.error('SignalR error:', error);
            alert(`Lỗi: ${error.message}`);
        });

        return unsubscribe;
    }, [onError]);

    // Handle send message
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !isConnected) return;

        try {
            await sendMessage(conversationId, inputMessage);
            setInputMessage('');

            // Stop typing indicator
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            await notifyTyping(conversationId, false);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
        }
    };

    // Handle typing
    const handleTyping = (value: string) => {
        setInputMessage(value);

        if (!isConnected) return;

        // Notify typing
        notifyTyping(conversationId, true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing after 2s
        typingTimeoutRef.current = setTimeout(() => {
            notifyTyping(conversationId, false);
        }, 2000);
    };

    // Handle request support
    const handleRequestSupport = async () => {
        if (!isConnected) return;

        const reason = prompt('Lý do yêu cầu hỗ trợ (tùy chọn):');

        try {
            await requestSupport(conversationId, reason || undefined);
        } catch (err) {
            console.error('Error requesting support:', err);
            alert('Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.');
        }
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <div>
                    <h2 className="text-lg font-semibold">Chat hỗ trợ</h2>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
                        <span>{isConnected ? 'Đang kết nối' : 'Mất kết nối'}</span>
                        {isStaffAvailable && (
                            <>
                                <span>•</span>
                                <span>Nhân viên đang hỗ trợ</span>
                            </>
                        )}
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Đóng chat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
                    <strong>Lỗi:</strong> {error}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-center">
                            Chưa có tin nhắn nào<br />
                            <span className="text-sm">Gửi tin nhắn để bắt đầu trò chuyện</span>
                        </p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.senderType === 'Customer' && message.senderId === user?.id;
                        const isSystemMessage = message.senderType === 'AI';

                        if (isSystemMessage) {
                            return (
                                <div key={message.id} className="flex justify-center">
                                    <div className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-full">
                                        {message.content}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage
                                            ? 'bg-blue-500 text-white'
                                            : message.senderType === 'Staff'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    <div className="text-xs opacity-75 mb-1">
                                        {message.senderName} • {new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span>{Array.from(typingUsers).join(', ')} đang nhập...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-lg">
                {!isStaffAvailable && (
                    <div className="mb-3">
                        <button
                            onClick={handleRequestSupport}
                            disabled={!isConnected}
                            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                            🙋 Yêu cầu hỗ trợ từ nhân viên
                        </button>
                    </div>
                )}

                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        disabled={!isConnected}
                        rows={1}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                        style={{ minHeight: '42px', maxHeight: '120px' }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!isConnected || !inputMessage.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Gửi
                    </button>
                </div>

                <div className="mt-2 text-xs text-gray-500 text-center">
                    Nhấn Enter để gửi, Shift+Enter để xuống dòng
                </div>
            </div>
        </div>
    );
}
