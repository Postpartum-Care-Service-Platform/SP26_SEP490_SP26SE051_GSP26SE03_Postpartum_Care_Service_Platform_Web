'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

import type { ChatEntry as ChatEntryType } from './types';
import { formatRelativeTimestamp } from './utils/formatTimestamp';
import { truncateText } from '@/utils/text';

import styles from './chat-entry.module.css';

type Props = {
  entry: ChatEntryType;
  isActive?: boolean;
  onClick?: (entry: ChatEntryType) => void;
};

const MAX_MESSAGE_PREVIEW_LENGTH = 30;

export function ChatEntry({ entry, isActive = false, onClick }: Props) {
  const handleClick = () => {
    onClick?.(entry);
  };

  const displayTimestamp = formatRelativeTimestamp(entry.timestamp);
  const truncatedMessage = truncateText(entry.lastMessage, MAX_MESSAGE_PREVIEW_LENGTH);

  return (
    <button
      type="button"
      className={`${styles.entry} ${isActive ? styles.entryActive : ''}`}
      onClick={handleClick}
    >
      <div className={styles.avatarWrapper}>
        {entry.avatar ? (
          <Image
            src={entry.avatar}
            alt={entry.name}
            width={48}
            height={48}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <User size={24} />
          </div>
        )}
        {entry.isOnline && <span className={styles.onlineIndicator} />}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{entry.name}</span>
          <span className={styles.timestamp}>{displayTimestamp}</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.messagePreview}>{truncatedMessage}</span>
          {entry.unreadCount > 0 && (
            <span className={styles.unreadBadge}>{entry.unreadCount}</span>
          )}
        </div>
      </div>
    </button>
  );
}

