'use client';

import React from 'react';
import type { ChatMessage } from '@/types/chat';
import { ChatBubble } from './ChatBubble';

export function ChatMessageList({ messages }: { messages: ChatMessage[] }) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={ref} className="chatbox__messages">
      {messages.map((m) => (
        <ChatBubble key={m.id} message={m} />
      ))}
    </div>
  );
}

