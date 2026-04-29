'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';
import chatService from '@/services/chat.service';
import type {
  ConversationResponse,
  SupportRequestResponse,
} from '@/services/chat.service';

import styles from '@/app/admin/chat/chat.module.css';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';

// Import from Admin Chat components
import { ChatConversation } from '@/app/admin/chat/components/ChatConversation';
import { ChatHeader } from '@/app/admin/chat/components/ChatHeader';
import { ChatList } from '@/app/admin/chat/components/ChatList';
import { ChatSidebar } from '@/app/admin/chat/components/ChatSidebar';
import { ContactsList } from '@/app/admin/chat/components/ContactsList';
import { MediaView } from '@/app/admin/chat/components/MediaView';
import { RecentChatsSidebar } from '@/app/admin/chat/components/RecentChatsSidebar';
import { SupportRequestsList } from '@/app/admin/chat/components/SupportRequestsList';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { useToast } from '@/components/ui/toast/use-toast';

import type {
  ChatConversation as ChatConversationType,
  ChatEntry,
} from '@/app/admin/chat/components/types';

export default function ReceptionistChatPage() {
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { toast } = useToast();

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

  // Load danh sách conversations (admin/receptionist xem tất cả)
  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('[ReceptionistChatPage] Loading all conversations...');
      const data = await chatService.getAllConversations();
      console.log(`[ReceptionistChatPage] Loaded ${data.length} conversations`);
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
      console.log('[ReceptionistChatPage] Loading pending support requests...');
      const data = await chatService.getPendingSupportRequests();
      console.log(`[ReceptionistChatPage] Loaded ${data.length} pending support requests`);
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
        participantAvatar: data.customerInfo?.avatarUrl || null,
        isOnline: true,
        messages: data.messages.map((msg) => ({
          id: String(msg.id),
          senderId: msg.senderId ?? '', 
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
        avatar: conv.customerInfo?.avatarUrl || '',
        lastMessage: lastMessage?.content || 'Chưa có tin nhắn',
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
    if (!isConnected) {
      console.log('[ReceptionistChatPage] SignalR not connected yet, skipping support request listener');
      return;
    }

    console.log('[ReceptionistChatPage] Subscribing to NewSupportRequest events');
    const unsubscribe = onNewSupportRequest((event) => {
      console.log('[ReceptionistChatPage] EVENT RECEIVED: NewSupportRequest', event);
      loadSupportRequests();
    });

    return () => {
      console.log('[ReceptionistChatPage] Unsubscribing from NewSupportRequest events');
      unsubscribe();
    };
  }, [isConnected, onNewSupportRequest]);

  // SignalR: Lắng nghe support request accepted
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onSupportRequestAccepted(() => {
      loadSupportRequests();
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
  };

  const handleNewChat = () => {
    console.log('New chat');
  };

  const handleChatClick = (entry: ChatEntry) => {
    setActiveChatId(entry.id);
    setActiveConversationId(entry.id);
    loadConversationDetail(Number(entry.id), true); 
  };

  const handleSendMessage = async (message: string) => {
    if (!activeConversationId) return;

    try {
      if (isConnected) {
        await sendSignalRMessage(Number(activeConversationId), message);
      } else {
        await chatService.sendStaffMessage(Number(activeConversationId), message);
        await loadConversationDetail(Number(activeConversationId));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Lỗi gửi tin nhắn',
        description: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
        variant: 'error',
      });
    }
  };

  const handleInfoClick = () => {
    console.log('Info clicked');
  };

  const handleRecentChatSelect = (chat: ChatEntry) => {
    handleChatClick(chat);
  };

  const handleAcceptSupport = async (requestId: number) => {
    try {
      if (isConnected) {
        await acceptSupportRequest(requestId);
      } else {
        await chatService.acceptSupportRequest(requestId);
      }

      await loadSupportRequests();

      const request = supportRequests.find((r) => r.id === requestId);
      if (request) {
        setActiveChatId(String(request.conversationId));
        setActiveConversationId(String(request.conversationId));
        setActiveSupportRequestId(requestId);
        await loadConversationDetail(request.conversationId, false); 
      }
    } catch (error) {
      console.error('Failed to accept support request:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể nhận yêu cầu hỗ trợ.',
        variant: 'error',
      });
    }
  };

  const handleResolveSupport = () => {
    if (!activeSupportRequestId) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmResolve = async () => {
    if (!activeSupportRequestId) return;

    try {
      if (isConnected) {
        await resolveSupport(activeSupportRequestId);
      } else {
        await chatService.resolveSupportRequest(activeSupportRequestId);
      }

      setActiveSupportRequestId(null);
      await loadSupportRequests();
      toast({
        title: 'Hoàn thành tư vấn',
        description: 'Conversation đã chuyển về AI.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to resolve support:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể hoàn thành tư vấn.',
        variant: 'error',
      });
    } finally {
      setIsConfirmModalOpen(false);
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
                  Giao diện {activeView === 'archive' ? 'Lưu trữ' : 'Cài đặt'} sẽ sớm ra mắt
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
                    null
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmResolve}
        title="Xác nhận hoàn thành tư vấn"
        message="Bạn có chắc muốn hoàn thành tư vấn? Cuộc hội thoại này sẽ được chuyển giao lại cho AI xử lý."
        confirmLabel="Hoàn thành"
        cancelLabel="Tiếp tục tư vấn"
        variant="warning"
      />
    </AdminPageLayout>
  );
}
