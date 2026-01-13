'use client';

import { useState, useMemo } from 'react';

import { ChatHeader } from './components/ChatHeader';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatList } from './components/ChatList';
import { ContactsList } from './components/ContactsList';
import { MediaView } from './components/MediaView';
import { ChatConversation } from './components/ChatConversation';
import { RecentChatsSidebar } from './components/RecentChatsSidebar';
import { UserProfilePanel } from './components/UserProfilePanel';
import { mockChats } from './components/mockChatData';
import { mockConversations } from './components/mockChatConversations';
import { mockUserProfiles } from './components/mockUserProfiles';
import type { ChatEntry } from './components/types';

import styles from './chat.module.css';

export default function AdminChatPage() {
  const [activeView, setActiveView] = useState('chat');
  const [activeChatId, setActiveChatId] = useState<string | undefined>('1');
  const [activeConversationId, setActiveConversationId] = useState<string | null>('1');
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  const { pinnedChats, allChats } = useMemo(() => {
    const pinned = mockChats.filter((chat) => chat.isPinned);
    const all = mockChats.filter((chat) => !chat.isPinned);
    return { pinnedChats: pinned, allChats: all };
  }, []);

  const activeConversation = activeConversationId
    ? mockConversations[activeConversationId] || null
    : null;

  const activeProfile = activeConversation
    ? mockUserProfiles[activeConversation.participantId] || null
    : null;

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleNewChat = () => {
    console.log('New chat');
  };

  const handleChatClick = (entry: ChatEntry) => {
    setActiveChatId(entry.id);
    const conversation = mockConversations[entry.id];
    if (conversation) {
      setActiveConversationId(conversation.id);
    } else {
      setActiveConversationId(null);
    }
  };

  const handleSendMessage = (message: string, file?: File) => {
    console.log('Send message:', message, file);
  };

  const handleInfoClick = () => {
    setIsProfilePanelOpen((prev) => !prev);
  };

  const handleCloseProfile = () => {
    setIsProfilePanelOpen(false);
  };

  const handleCall = () => {
    console.log('Call clicked');
  };

  const handleVideoCall = () => {
    console.log('Video call clicked');
  };

  const handleMore = () => {
    console.log('More options clicked');
  };

  const handleRecentChatSelect = (chat: ChatEntry) => {
    handleChatClick(chat);
  };

  return (
    <div className={styles.container}>
      <ChatHeader />
      <div className={styles.bottomSection}>
        <ChatSidebar activeView={activeView} onViewChange={setActiveView} />
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
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} view coming soon
              </div>
            </div>
          )}
          <div className={styles.chatArea}>
            {activeView === 'chat' && (
              <>
                <ChatConversation
                  conversation={activeConversation}
                  onSendMessage={handleSendMessage}
                  onInfoClick={handleInfoClick}
                />
                <RecentChatsSidebar
                  chats={[...pinnedChats, ...allChats]}
                  onChatSelect={handleRecentChatSelect}
                  onNewChat={handleNewChat}
                />
                {isProfilePanelOpen && (
                  <UserProfilePanel
                    profile={activeProfile}
                    onClose={handleCloseProfile}
                    onCall={handleCall}
                    onVideoCall={handleVideoCall}
                    onMore={handleMore}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

