'use client';

import { useEffect, useRef } from 'react';

import type { ChatConversation, Message } from './types';
import { ChatHeaderBar } from './ChatHeaderBar';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { ChatInput } from './ChatInput';
import { shouldShowDateSeparator } from './utils/formatMessageTime';

import styles from './chat-conversation.module.css';

type Props = {
  conversation: ChatConversation | null;
  currentUserId?: string;
  onSendMessage?: (message: string, file?: File) => void;
  onInfoClick?: () => void;
};

export function ChatConversation({
  conversation,
  currentUserId = 'current-user',
  onSendMessage,
  onInfoClick,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className={styles.conversation}>
        <div className={styles.emptyState}>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const handleSend = (message: string, file?: File) => {
    onSendMessage?.(message, file);
  };

  return (
    <div className={styles.conversation}>
      <ChatHeaderBar
        name={conversation.participantName}
        avatar={conversation.participantAvatar}
        isOnline={conversation.isOnline}
        onInfoClick={onInfoClick}
      />
      <div className={styles.messagesContainer}>
        {conversation.messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId;
          const previousMessage = index > 0 ? conversation.messages[index - 1] : null;
          const showDateSeparator = shouldShowDateSeparator(
            message.timestamp,
            previousMessage?.timestamp || null
          );

          return (
            <div key={message.id}>
              {showDateSeparator && <DateSeparator timestamp={message.timestamp} />}
              <MessageBubble message={message} isOwn={isOwn} />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

