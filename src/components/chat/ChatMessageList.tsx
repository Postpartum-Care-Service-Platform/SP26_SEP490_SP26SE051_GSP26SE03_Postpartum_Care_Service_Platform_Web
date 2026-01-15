'use client';

import React from 'react';
import type { ChatMessage } from '@/types/chat';
import { ChatBubble, TypingIndicator } from './ChatBubble';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isTyping?: boolean;
};

export function ChatMessageList({ messages, isTyping }: ChatMessageListProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, isTyping]);

  return (
    <div ref={ref} className="chatbox__messages">
      {messages.map((m) => (
        <ChatBubble key={m.id} message={m} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
}

