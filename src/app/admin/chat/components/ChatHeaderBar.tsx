'use client';

import Image from 'next/image';
import { Info, User } from 'lucide-react';

import styles from './chat-header-bar.module.css';

type Props = {
  name: string;
  avatar: string | null;
  isOnline: boolean;
  onInfoClick?: () => void;
};

export function ChatHeaderBar({ name, avatar, isOnline, onInfoClick }: Props) {
  return (
    <div className={styles.headerBar}>
      <div className={styles.participantInfo}>
        <div className={styles.avatarWrapper}>
          {avatar ? (
            <Image src={avatar} alt={name} width={40} height={40} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={20} />
            </div>
          )}
          {isOnline && <span className={styles.onlineIndicator} />}
        </div>
        <div className={styles.nameSection}>
          <span className={styles.name}>{name}</span>
          {isOnline && <span className={styles.status}>Online</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={onInfoClick}
          aria-label="Info"
        >
          <Info size={20} className={styles.icon} />
        </button>
      </div>
    </div>
  );
}

