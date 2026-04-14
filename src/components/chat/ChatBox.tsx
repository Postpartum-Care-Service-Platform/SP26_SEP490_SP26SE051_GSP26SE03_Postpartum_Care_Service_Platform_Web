'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import type { ChatMessage } from '@/types/chat';

import '@/styles/chat.css';
import { ChatComposer } from './ChatComposer';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';

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
  const router = useRouter();

  if (!open) return null;

  const handleExpand = () => {
    router.push('/ai-chat');
  };

  return (
    <section className="chatbox" aria-label={title}>
      <ChatHeader
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        onMinimize={onMinimize}
        onExpand={handleExpand}
        isExpanded={false}
        leftAvatar={leftAvatar}
        rightActions={rightActions}
      />
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <ChatComposer onSend={onSend} disabled={disabled} />
    </section>
  );
}

