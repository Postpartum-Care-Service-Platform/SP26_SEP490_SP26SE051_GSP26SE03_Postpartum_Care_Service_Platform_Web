'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';
import chatService from '@/services/chat.service';
import type {
  ConversationResponse,
  SupportRequestResponse,
} from '@/services/chat.service';

import styles from './chat.module.css';
import { ChatConversation } from './components/ChatConversation';
import { ChatHeader } from './components/ChatHeader';
import { ChatList } from './components/ChatList';
import { ChatSidebar } from './components/ChatSidebar';
import { ContactsList } from './components/ContactsList';
import { MediaView } from './components/MediaView';
import { RecentChatsSidebar } from './components/RecentChatsSidebar';
import { SupportRequestsList } from './components/SupportRequestsList';

import type {
  ChatConversation as ChatConversationType,
  ChatEntry,
} from './components/types';

export default function AdminChatPage() {
  const { token, user } = useAuth();
  const [activeView, setActiveView] = useState('chat');
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // State cho conversations và messages
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<ChatConversationType | null>(null);
  const [activeSupportRequestId, setActiveSupportRequestId] =
    useState<number | null>(null);
  const [supportRequests, setSupportRequests] = useState<SupportRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // SignalR for realtime chat
  const {
    isConnected,
    joinConversation,
    sendMessage: sendSignalRMessage,
    acceptSupportRequest,
    resolveSupport,
    onReceiveMessage,
    onNewSupportRequest,
    onSupportRequestAccepted,
  } = useChatHub({
    token: token || '',
    autoConnect: !!token && !!user,
  });

  // Load conversations khi mount
  useEffect(() => {
    if (token && user) {
      loadConversations();
      loadSupportRequests();
    }
  }, [token, user]);

  // Load danh sách conversations (admin xem tất cả)
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getAllConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load support requests
  const loadSupportRequests = async () => {
    try {
      const data = await chatService.getPendingSupportRequests();
      setSupportRequests(data);
    } catch (error) {
      console.error('Failed to load support requests:', error);
    }
  };

  // Load chi tiết conversation
  const loadConversationDetail = async (
    conversationId: number,
    checkSupportRequest = true
  ) => {
    try {
      setLoading(true);
      const data = await chatService.getConversation(conversationId);

      // Convert API response sang format UI (ChatConversationType)
      const conversation: ChatConversationType = {
        id: String(data.id),
        participantId: 'customer',
        participantName: data.name || 'Customer',
        participantAvatar: null,
        isOnline: true,
        messages: data.messages.map((msg) => ({
          id: String(msg.id),
          senderId: msg.senderId ?? '', // null/undefined → empty string
          senderName: msg.senderName || 'Unknown',
          senderAvatar: null,
          content: msg.content,
          timestamp: msg.createdAt,
          isRead: msg.isRead,
        })),
      };

      setActiveConversation(conversation);

      // Check xem conversation này có active support request không (nếu cần)
      if (checkSupportRequest) {
        // Lấy my support requests để check
        try {
          const myRequests = await chatService.getMySupportRequests();
          const activeRequest = myRequests.find(
            (r) => r.conversationId === conversationId && r.status !== 'Resolved'
          );
          if (activeRequest) {
            setActiveSupportRequestId(activeRequest.id);
          } else {
            setActiveSupportRequestId(null);
          }
        } catch (error) {
          console.error('Failed to check support request:', error);
          setActiveSupportRequestId(null);
        }
      }

      // Join SignalR conversation
      if (isConnected) {
        await joinConversation(data.id);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert conversations sang ChatEntry format
  const { pinnedChats, allChats } = useMemo(() => {
    const chatEntries: ChatEntry[] = conversations.map((conv) => {
      const lastMessage = conv.messages[conv.messages.length - 1];
      return {
        id: String(conv.id),
        name: conv.name || 'Conversation',
        avatar: '',
        lastMessage: lastMessage?.content || 'No messages',
        timestamp: lastMessage
          ? new Date(lastMessage.createdAt).toISOString()
          : new Date().toISOString(),
        unreadCount: conv.messages.filter((m) => !m.isRead).length,
        isPinned: false,
        isOnline: true,
      };
    });

    const pinned = chatEntries.filter((chat) => chat.isPinned);
    const all = chatEntries.filter((chat) => !chat.isPinned);
    return { pinnedChats: pinned, allChats: all };
  }, [conversations]);

  // SignalR: Lắng nghe tin nhắn mới
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = onReceiveMessage((message) => {
      if (String(message.conversationId) === activeConversationId) {
        setActiveConversation((prev: ChatConversationType | null) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: String(message.id),
                senderId: message.senderId || 'unknown',
                senderName: message.senderName || 'Unknown',
                senderAvatar: null,
                content: message.content,
                timestamp: message.createdAt,
                isRead: false,
              },
            ],
          };
        });
      }
    });

    return unsubscribe;
  }, [activeConversationId, onReceiveMessage]);

  // SignalR: Lắng nghe support request mới
  useEffect(() => {
    const unsubscribe = onNewSupportRequest((event) => {
      console.log('New support request:', event);
      loadSupportRequests();
    });

    return unsubscribe;
  }, [onNewSupportRequest]);

  // SignalR: Lắng nghe support request accepted
  useEffect(() => {
    const unsubscribe = onSupportRequestAccepted((event) => {
      console.log('Support request accepted:', event);
      loadSupportRequests();
    });

    return unsubscribe;
  }, [onSupportRequestAccepted]);

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // TODO: Implement search
  };

  const handleNewChat = () => {
    console.log('New chat');
    // TODO: Implement new chat
  };

  const handleChatClick = (entry: ChatEntry) => {
    setActiveChatId(entry.id);
    setActiveConversationId(entry.id);
    loadConversationDetail(Number(entry.id), true); // Check support request
  };

  const handleSendMessage = async (message: string) => {
    if (!activeConversationId) return;

    try {
      if (isConnected) {
        // Gửi qua SignalR (realtime)
        await sendSignalRMessage(Number(activeConversationId), message);
      } else {
        // Fallback: Gửi qua REST API
        await chatService.sendStaffMessage(Number(activeConversationId), message);
        // Reload conversation
        await loadConversationDetail(Number(activeConversationId));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  const handleInfoClick = () => {
    console.log('Info clicked');
    // TODO: Show conversation info
  };

  const handleRecentChatSelect = (chat: ChatEntry) => {
    handleChatClick(chat);
  };

  // Handle accept support request
  const handleAcceptSupport = async (requestId: number) => {
    try {
      if (isConnected) {
        await acceptSupportRequest(requestId);
      } else {
        await chatService.acceptSupportRequest(requestId);
      }

      // Reload support requests
      await loadSupportRequests();

      // Load conversation và lưu support request ID
      const request = supportRequests.find((r) => r.id === requestId);
      if (request) {
        setActiveChatId(String(request.conversationId));
        setActiveConversationId(String(request.conversationId));
        setActiveSupportRequestId(requestId);
        await loadConversationDetail(request.conversationId, false); // Không cần check vì đã biết request ID
      }
    } catch (error) {
      console.error('Failed to accept support request:', error);
      alert('Không thể nhận yêu cầu hỗ trợ.');
    }
  };

  // Handle resolve support
  const handleResolveSupport = async () => {
    if (!activeSupportRequestId) return;

    const confirmResolve = confirm(
      'Bạn có chắc muốn hoàn thành tư vấn? Conversation sẽ chuyển về AI.'
    );
    if (!confirmResolve) return;

    try {
      if (isConnected) {
        await resolveSupport(activeSupportRequestId);
      } else {
        await chatService.resolveSupportRequest(activeSupportRequestId);
      }

      // Clear active support request
      setActiveSupportRequestId(null);

      // Reload support requests
      await loadSupportRequests();

      alert('Đã hoàn thành tư vấn. Conversation đã chuyển về AI.');
    } catch (error) {
      console.error('Failed to resolve support:', error);
      alert('Không thể hoàn thành tư vấn.');
    }
  };

  return (
    <div className={styles.container}>
      <ChatHeader />
      <div className={styles.bottomSection}>
        <ChatSidebar activeView={activeView} onViewChange={setActiveView} />
        <div className={styles.mainContent}>
          {activeView === 'chat' && (
            <div className={styles.chatListContainer}>
              {loading && <div className={styles.loading}>Đang tải...</div>}
              <ChatList
                pinnedChats={pinnedChats}
                allChats={allChats}
                activeChatId={activeChatId}
                onChatClick={handleChatClick}
                onSearch={handleSearch}
                onNewChat={handleNewChat}
              />
            </div>
          )}
          {activeView === 'support-requests' && (
            <div className={styles.chatListContainer}>
              <SupportRequestsList
                requests={supportRequests}
                onAccept={handleAcceptSupport}
                loading={loading}
              />
            </div>
          )}
          {activeView === 'contacts' && (
            <div className={styles.chatListContainer}>
              <ContactsList />
            </div>
          )}
          {activeView === 'media' && (
            <div className={styles.chatListContainer}>
              <MediaView />
            </div>
          )}
          {(activeView === 'archive' || activeView === 'settings') && (
            <div className={styles.chatListContainer}>
              <div className={styles.placeholder}>
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} view
                coming soon
              </div>
            </div>
          )}
          <div className={styles.chatArea}>
            {activeView === 'chat' && (
              <>
                {activeConversation ? (
                  <>
                    <ChatConversation
                      conversation={activeConversation}
                      currentUserId={user?.id}
                      onSendMessage={handleSendMessage}
                      onInfoClick={handleInfoClick}
                      onResolveSupport={handleResolveSupport}
                      showResolveButton={!!activeSupportRequestId}
                    />
                    <RecentChatsSidebar
                      chats={[...pinnedChats, ...allChats]}
                      onChatSelect={handleRecentChatSelect}
                      onNewChat={handleNewChat}
                    />
                  </>
                ) : (
                  <div className={styles.placeholder}>
                    {isConnected ? (
                      <div>
                        <p>✅ Đã kết nối realtime</p>
                        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                      </div>
                    ) : (
                      <div>
                        <p>❌ Chưa kết nối realtime</p>
                        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
