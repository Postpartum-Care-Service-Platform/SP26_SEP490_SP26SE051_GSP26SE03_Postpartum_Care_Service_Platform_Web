'use client';

import React from 'react';

import type { ChatMessage } from '@/types/chat';
import '@/styles/chat.css';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatComposer } from './ChatComposer';

type ChatBoxProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  onSend: (text: string) => void | Promise<void>;
  onClose: () => void;
  onMinimize?: () => void;
  leftAvatar?: React.ReactNode;
  rightActions?: React.ReactNode;
  disabled?: boolean;
  isTyping?: boolean;
};

export function ChatBox({
  open,
  title,
  subtitle,
  messages,
  onSend,
  onClose,
  onMinimize,
  leftAvatar,
  rightActions,
  disabled,
  isTyping,
}: ChatBoxProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!open) return null;

  return (
    <section className={`chatbox ${isExpanded ? 'chatbox--expanded' : ''}`} aria-label={title}>
      <ChatHeader
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        onMinimize={onMinimize}
        onExpand={() => setIsExpanded((v) => !v)}
        isExpanded={isExpanded}
        leftAvatar={leftAvatar}
        rightActions={rightActions}
      />
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <ChatComposer onSend={onSend} disabled={disabled} />
    </section>
  );
}

