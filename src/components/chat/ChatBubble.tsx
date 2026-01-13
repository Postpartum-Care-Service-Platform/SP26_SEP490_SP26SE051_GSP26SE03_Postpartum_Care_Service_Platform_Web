'use client';

import React from 'react';
import Image from 'next/image';

import type { ChatMessage } from '@/types/chat';

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isMe = message.sender === 'me';

  return (
    <div className={`chatbox__bubble-row ${isMe ? 'chatbox__bubble-row--me' : 'chatbox__bubble-row--other'}`}>
      {!isMe && (
        <div className="chatbox__bubble-avatar" aria-hidden>
          {message.author?.avatarUrl ? (
            <Image src={message.author.avatarUrl} alt={message.author.name} width={28} height={28} />
          ) : (
            <div className="chatbox__bubble-avatar-fallback" />
          )}
        </div>
      )}

      <div className={`chatbox__bubble-col ${isMe ? 'chatbox__bubble-col--me' : 'chatbox__bubble-col--other'}`}>
        {!isMe && message.author?.name && <div className="chatbox__bubble-author">{message.author.name}</div>}

        <div className={`chatbox__bubble ${isMe ? 'chatbox__bubble--me' : 'chatbox__bubble--other'}`}>{message.text}</div>

        <div className={`chatbox__meta ${isMe ? 'chatbox__meta--me' : 'chatbox__meta--other'}`}>{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
}
