'use client';

import Image from 'next/image';
import React from 'react';

import { AiResponseTypes, type PackageData } from '@/services/chat.service';
import type { ChatMessage } from '@/types/chat';

import { ChatMarkdownRenderer } from './ChatMarkdownRenderer';
import { ChatPackagesTable } from './ChatPackagesTable';

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Check if text contains markdown table
function hasMarkdownTable(text: string): boolean {
  const lines = text.split('\n');
  const tableLines = lines.filter((line) => line.trim().startsWith('|'));
  return tableLines.length >= 2;
}

// Render nội dung tin nhắn dựa trên structured data hoặc markdown
function renderMessageContent(message: ChatMessage) {
  const { structuredData, text, sender } = message;

  // Nếu là tin nhắn của user, render text bình thường
  if (sender === 'me') {
    return <>{text}</>;
  }

  // Nếu có structured data với type khác text
  if (structuredData && structuredData.type !== AiResponseTypes.Text) {
    switch (structuredData.type) {
      case AiResponseTypes.PackagesTable: {
        const packages = structuredData.data as PackageData[];
        return (
          <ChatPackagesTable
            packages={packages}
            introText={structuredData.text || text}
          />
        );
      }

      case AiResponseTypes.Error:
        return <span className="chat-error">{structuredData.text || text}</span>;

      default:
        return <ChatMarkdownRenderer content={structuredData.text || text} />;
    }
  }

  // Nếu text chứa markdown table hoặc formatting, parse và render
  if (hasMarkdownTable(text) || text.includes('###') || text.includes('**')) {
    return <ChatMarkdownRenderer content={text} />;
  }

  // Fallback: render text bình thường
  return <>{text}</>;
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isMe = message.sender === 'me';
  const hasStructuredData = message.structuredData && message.structuredData.type !== AiResponseTypes.Text;
  const hasMarkdown = !isMe && (hasMarkdownTable(message.text) || message.text.includes('###'));

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

        <div className={`chatbox__bubble ${isMe ? 'chatbox__bubble--me' : 'chatbox__bubble--other'} ${hasStructuredData || hasMarkdown ? 'chatbox__bubble--structured' : ''}`}>
          {renderMessageContent(message)}
        </div>

        <div className={`chatbox__meta ${isMe ? 'chatbox__meta--me' : 'chatbox__meta--other'}`}>{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
}

// Typing indicator component (3 chấm nhảy)
export function TypingIndicator() {
  return (
    <div className="chatbox__bubble-row chatbox__bubble-row--other">
      <div className="chatbox__bubble-avatar" aria-hidden>
        <div className="chatbox__bubble-avatar-fallback" />
      </div>
      <div className="chatbox__bubble-col chatbox__bubble-col--other">
        <div className="chatbox__bubble chatbox__bubble--other chatbox__typing">
          <span className="chatbox__typing-dot" />
          <span className="chatbox__typing-dot" />
          <span className="chatbox__typing-dot" />
        </div>
      </div>
    </div>
  );
}
