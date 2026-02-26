'use client';

import { MessageCircle, Pin } from 'lucide-react';

import styles from './chat-list.module.css';
import { ChatEntry as ChatEntryComponent } from './ChatEntry';
import { ChatSearchBar } from './ChatSearchBar';

import type { ChatEntry } from './types';

type Props = {
  pinnedChats: ChatEntry[];
  allChats: ChatEntry[];
  activeChatId?: string;
  onChatClick?: (entry: ChatEntry) => void;
  onSearch?: (query: string) => void;
  onNewChat?: () => void;
};

export function ChatList({
  pinnedChats,
  allChats,
  activeChatId,
  onChatClick,
  onSearch,
  onNewChat,
}: Props) {
  return (
    <div className={styles.chatListContainer}>
      <ChatSearchBar onSearch={onSearch} onNewChat={onNewChat} />
      <div className={styles.chatList}>
        {pinnedChats.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Pin size={16} className={styles.sectionIcon} />
              <span className={styles.sectionTitle}>Pinned</span>
            </div>
            <div className={styles.entries}>
              {pinnedChats.slice(0, 2).map((entry) => (
                <ChatEntryComponent
                  key={entry.id}
                  entry={entry}
                  isActive={activeChatId === entry.id}
                  onClick={onChatClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MessageCircle size={16} className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>All chats</span>
          </div>
          <div className={styles.entries}>
            {allChats.map((entry) => (
              <ChatEntryComponent
                key={entry.id}
                entry={entry}
                isActive={activeChatId === entry.id}
                onClick={onChatClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
