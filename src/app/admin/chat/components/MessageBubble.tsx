'use client';

import { Check, CheckCheck, User } from 'lucide-react';
import Image from 'next/image';

import styles from './message-bubble.module.css';
import { formatMessageTime } from './utils/formatMessageTime';

import type { Message } from './types';

type Props = {
  message: Message;
  isOwn: boolean;
};

export function MessageBubble({ message, isOwn }: Props) {
  const displayTime = formatMessageTime(message.timestamp);

  return (
    <div
      className={`${styles.messageWrapper} ${isOwn ? styles.messageWrapperOwn : ''}`}
    >
      {!isOwn && (
        <div className={styles.avatarWrapper}>
          {message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.senderName}
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={16} />
            </div>
          )}
        </div>
      )}
      <div
        className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}
      >
        <p className={styles.content}>{message.content}</p>
        <div className={styles.footer}>
          <span className={styles.timestamp}>{displayTime}</span>
          {isOwn && (
            <span className={styles.readIndicator}>
              {message.isRead ? (
                <CheckCheck size={14} className={styles.readIcon} />
              ) : (
                <Check size={14} className={styles.sentIcon} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}