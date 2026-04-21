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
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
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
      // Handle various response formats (.value, .items, .$values, or direct array)
      let conversationsData: ConversationResponse[] = [];
      if (Array.isArray(data)) {
        conversationsData = data;
      } else if (data && typeof data === 'object') {
        const rawData = data as any;
        conversationsData = rawData.conversations || rawData.value || rawData.items || rawData.$values || rawData.data || [];
      }
      setConversations(Array.isArray(conversationsData) ? conversationsData : []);
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
      let supportData: SupportRequestResponse[] = [];
      if (Array.isArray(data)) {
        supportData = data;
      } else if (data && typeof data === 'object') {
        const rawData = data as any;
        supportData = rawData.supportRequests || rawData.value || rawData.items || rawData.$values || rawData.data || [];
      }
      setSupportRequests(Array.isArray(supportData) ? supportData : []);
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
        participantName: data.customerInfo?.fullName || data.customerInfo?.username || data.name || 'Customer',
        participantAvatar: data.customerInfo?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.customerInfo?.fullName || data.customerInfo?.username || data.name || 'Customer')}&background=random&color=fff`,
        isOnline: true,
        messages: (data.messages || []).map((msg) => {
          const isCustomer = msg.senderType === 'Customer';
          const customerAvatar = data.customerInfo?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.customerInfo?.fullName || data.customerInfo?.username || 'Customer')}&background=random&color=fff`;
          
          return {
            id: String(msg.id),
            senderId: msg.senderId ?? '',
            senderName: msg.senderName || 'Unknown',
            senderAvatar: isCustomer ? customerAvatar : null,
            content: msg.content,
            timestamp: msg.createdAt,
            isRead: msg.isRead,
          };
        }),
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

      // Đánh dấu đã đọc
      try {
        await chatService.markAsRead(conversationId);
        // Cập nhật local state để UI phản hồi ngay (xóa badge unread)
        setConversations(prev => {
          if (!Array.isArray(prev)) return [];
          return prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                unreadCount: 0,
                messages: Array.isArray(conv.messages) 
                  ? conv.messages.map(m => ({ ...m, isRead: true }))
                  : []
              };
            }
            return conv;
          });
        });
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert conversations sang ChatEntry format
  const { pinnedChats, allChats } = useMemo(() => {
    if (!Array.isArray(conversations)) {
      return { pinnedChats: [], allChats: [] };
    }

    const chatEntries: ChatEntry[] = conversations.map((conv) => {
      const lastMessage = conv.messages && Array.isArray(conv.messages) 
        ? conv.messages[conv.messages.length - 1]
        : null;
      const displayName = conv.customerInfo?.fullName || conv.customerInfo?.username || conv.name || 'Conversation';
      const displayAvatar = conv.customerInfo?.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff`;

      return {
        id: String(conv.id),
        name: displayName,
        avatar: displayAvatar,
        lastMessage: lastMessage?.content || 'Chưa có tin nhắn',
        timestamp: lastMessage
          ? new Date(lastMessage.createdAt).toISOString()
          : conv.createdAt 
            ? new Date(conv.createdAt).toISOString() 
            : new Date(0).toISOString(), // Rất cũ nếu không có gì
        unreadCount: conv.unreadCount,
        isPinned: false,
        isOnline: true,
      };
    }).sort((a, b) => {
      // 1. Ưu tiên cuộc hội thoại có tin nhắn chưa đọc lên đầu
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

      // 2. Nếu cùng trạng thái (cùng unread hoặc cùng read), sắp xếp theo thời gian mới nhất
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const pinned = chatEntries.filter((chat) => chat.isPinned);
    const all = chatEntries.filter((chat) => !chat.isPinned);
    return { pinnedChats: pinned, allChats: all };
  }, [conversations]);

  // Lấy danh sách customer duy nhất cho sidebar bên phải (RecentChatsSidebar)
  const uniqueCustomers = useMemo(() => {
    if (!Array.isArray(conversations)) return [];
    
    const customersMap = new Map<string, ChatEntry>();
    const allEntries = [...pinnedChats, ...allChats];

    allEntries.forEach((entry) => {
      const conv = conversations.find((c) => String(c.id) === entry.id);
      const customerId = conv?.customerInfo?.id || entry.id;

      // Chỉ giữ lại entry đầu tiên (thường là cái mới nhất do data order) cho mỗi customer
      if (!customersMap.has(customerId)) {
        customersMap.set(customerId, entry);
      }
    });

    return Array.from(customersMap.values());
  }, [pinnedChats, allChats, conversations]);

  // SignalR: Lắng nghe tin nhắn mới
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = onReceiveMessage((message) => {
      // 1. Luôn cập nhật danh sách conversations tổng (để hiện số tin nhắn mới, preview tin nhắn cuối)
      setConversations((prev) => {
        if (!Array.isArray(prev)) return [];
        
        return prev.map((conv) => {
          if (String(conv.id) === String(message.conversationId)) {
            // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh bị lặp
            const messages = Array.isArray(conv.messages) ? conv.messages : [];
            const isExist = messages.some(m => String(m.id) === String(message.id));
            if (isExist) return conv;

            const isCurrentActive = String(message.conversationId) === activeConversationId;
            
            return {
              ...conv,
              unreadCount: isCurrentActive ? 0 : (conv.unreadCount || 0) + 1,
              messages: [
                ...(Array.isArray(conv.messages) ? conv.messages : []),
                {
                  id: message.id,
                  content: message.content,
                  senderType: message.senderType,
                  senderId: message.senderId,
                  senderName: message.senderName,
                  senderAvatar: message.senderType === 'Customer' 
                    ? (conv.customerInfo?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.customerInfo?.fullName || conv.customerInfo?.username || 'Customer')}&background=random&color=fff`)
                    : null,
                  createdAt: message.createdAt,
                  isRead: isCurrentActive,
                },
              ],
            };
          }
          return conv;
        });
      });

      // 2. Nếu đang đứng ở đúng cuộc trò chuyện đó thì cập nhật khung chat chính
      if (String(message.conversationId) === activeConversationId) {
        setActiveConversation((prev: ChatConversationType | null) => {
          if (!prev) return null;
          // Tránh lặp tin nhắn
          const messages = Array.isArray(prev.messages) ? prev.messages : [];
          if (messages.some(m => m.id === String(message.id))) return prev;

          return {
            ...prev,
            messages: [
              ...messages,
              {
                id: String(message.id),
                senderId: message.senderId || 'unknown',
                senderName: message.senderName || 'Unknown',
                senderAvatar: message.senderType === 'Customer' ? prev.participantAvatar : null,
                content: message.content,
                timestamp: message.createdAt,
                isRead: true,
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
    if (!isConnected) return;

    const unsubscribe = onNewSupportRequest((event) => {
      console.log('New support request:', event);
      void loadSupportRequests();
    });

    return unsubscribe;
  }, [isConnected, onNewSupportRequest]);

  // SignalR: Lắng nghe support request accepted
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onSupportRequestAccepted((event) => {
      console.log('Support request accepted:', event);
      void loadSupportRequests();
    });

    return unsubscribe;
  }, [isConnected, onSupportRequestAccepted]);

  // Tự động chọn cuộc trò chuyện đầu tiên khi dữ liệu đã tải xong
  useEffect(() => {
    if (!activeChatId && !loading) {
      if (pinnedChats.length > 0) {
        handleChatClick(pinnedChats[0]);
      } else if (allChats.length > 0) {
        handleChatClick(allChats[0]);
      }
    }
  }, [pinnedChats, allChats, activeChatId, loading]);

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

    // Cập nhật local state ngay lập tức cho mượt mà (xóa badge số lượng tin nhắn chưa đọc)
    setConversations(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.map(conv => {
        if (String(conv.id) === String(entry.id)) {
          return {
            ...conv,
            unreadCount: 0,
            messages: Array.isArray(conv.messages) 
              ? conv.messages.map(m => ({ ...m, isRead: true }))
              : []
          };
        }
        return conv;
      });
    });
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
        setActiveView('chat');
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
    <AdminPageLayout
      header={<ChatHeader />}
      noCard
      noScroll
    >
      <div className={styles.container}>
        <div className={styles.bottomSection}>
          <ChatSidebar
            activeView={activeView}
            onViewChange={setActiveView}
            supportRequestsBadgeCount={supportRequests.length}
          />
          <div className={styles.mainContent}>
            {activeView === 'contacts' ? (
              <div className={styles.contactsFullWidth}>
                <ContactsList recentChats={uniqueCustomers} />
              </div>
            ) : (
              <>
                {activeView === 'chat' && (
                  <div className={styles.chatListContainer}>
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
                {activeView === 'media' && (
                  <div className={styles.chatListContainer}>
                    <MediaView />
                  </div>
                )}
                {(activeView === 'archive' || activeView === 'settings') && (
                  <div className={styles.chatListContainer}>
                    <div className={styles.placeholder}>
                      Giao diện {activeView === 'archive' ? 'Lưu trữ' : 'Cài đặt'} sẽ sớm ra mắt
                    </div>
                  </div>
                )}
                <div className={styles.chatArea}>
                  {(activeView === 'chat' || activeView === 'support-requests') && activeConversation ? (
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
                        chats={uniqueCustomers}
                        onChatSelect={handleRecentChatSelect}
                        onNewChat={handleNewChat}
                      />
                    </>
                  ) : (
                    <div className={styles.placeholder}>
                      {activeView === 'chat' ? 'Chọn một cuộc trò chuyện để bắt đầu' : 
                      activeView === 'support-requests' ? 'Chọn một yêu cầu hỗ trợ để tư vấn' :
                      null}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
