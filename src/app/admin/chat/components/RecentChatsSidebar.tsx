'use client';

import { User } from 'lucide-react';
import Image from 'next/image';

import styles from './recent-chats-sidebar.module.css';

import type { ChatEntry } from './types';

type Props = {
  chats: ChatEntry[];
  onChatSelect?: (chat: ChatEntry) => void;
  onNewChat?: () => void;
};

export function RecentChatsSidebar({ chats, onChatSelect, onNewChat }: Props) {
  const recentChats = chats.slice(0, 10);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.newChatButton}
          onClick={onNewChat}
          aria-label="New chat"
        >
          <span className={styles.plusIcon}>+</span>
        </button>
      </div>
      <div className={styles.chatsList}>
        {recentChats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            className={styles.chatItem}
            onClick={() => onChatSelect?.(chat)}
            aria-label={chat.name}
          >
            {chat.avatar ? (
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={20} />
              </div>
            )}
            {chat.isOnline && <span className={styles.onlineIndicator} />}
          </button>
        ))}
      </div>
    </div>
  );
}
