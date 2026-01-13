'use client';

import React from 'react';
import { ChatBubbleIcon, Cross1Icon, MagicWandIcon, PersonIcon } from '@radix-ui/react-icons';

import type { ChatMessage, ChatMode } from '@/types/chat';
import { ChatBox } from '@/components/chat/ChatBox';

import '@/styles/support-widget.css';

function nowMinusMinutes(min: number) {
  return new Date(Date.now() - min * 60_000).toISOString();
}

const MOCK_AI_MESSAGES: ChatMessage[] = [
  {
    id: 'ai-1',
    chatId: 'ai',
    sender: 'other',
    text: 'Chào bạn! Mình là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
    createdAt: nowMinusMinutes(25),
  },
  {
    id: 'ai-2',
    chatId: 'ai',
    sender: 'me',
    text: 'Mình muốn hỏi về chế độ ăn sau sinh.',
    createdAt: nowMinusMinutes(23),
  },
  {
    id: 'ai-3',
    chatId: 'ai',
    sender: 'other',
    text: 'Bạn có thể cho mình biết bạn sinh thường hay sinh mổ, và hiện bé được bao nhiêu tuần không?',
    createdAt: nowMinusMinutes(22),
  },
];

const MOCK_AGENT_MESSAGES: ChatMessage[] = [
  {
    id: 'ag-1',
    chatId: 'agent',
    sender: 'other',
    text: 'Xin chào! Mình là nhân viên tư vấn. Mình có thể hỗ trợ gì cho bạn?',
    createdAt: nowMinusMinutes(18),
  },
];

export function SupportWidget() {
  const [open, setOpen] = React.useState(false);
  const [activeChat, setActiveChat] = React.useState<ChatMode | null>(null);

  const [aiMessages, setAiMessages] = React.useState<ChatMessage[]>(MOCK_AI_MESSAGES);
  const [agentMessages, setAgentMessages] = React.useState<ChatMessage[]>(MOCK_AGENT_MESSAGES);

  React.useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest('.support-widget')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const sendMessage = async (mode: ChatMode, text: string) => {
    const msg: ChatMessage = {
      id: `${mode}-${Date.now()}`,
      chatId: mode,
      sender: 'me',
      text,
      createdAt: new Date().toISOString(),
    };

    if (mode === 'ai') {
      setAiMessages((prev) => [...prev, msg]);
      window.setTimeout(() => {
        setAiMessages((prev) => [
          ...prev,
          {
            id: `ai-reply-${Date.now()}`,
            chatId: 'ai',
            sender: 'other',
            text: 'Mình đã ghi nhận. (Bước sau mình sẽ nối API AI để trả lời thật.)',
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 600);
    } else {
      setAgentMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <>
      <ChatBox
        open={activeChat === 'ai'}
        title="Tư vấn bằng AI"
        subtitle="Đang hoạt động"
        messages={aiMessages}
        onSend={(text) => sendMessage('ai', text)}
        onClose={() => setActiveChat(null)}
      />

      <ChatBox
        open={activeChat === 'agent'}
        title="Chat với nhân viên"
        subtitle="Đang hoạt động"
        messages={agentMessages}
        onSend={(text) => sendMessage('agent', text)}
        onClose={() => setActiveChat(null)}
      />

      <div className={`support-widget ${open ? 'support-widget--open' : ''}`}>
        <div className="support-widget__menu" aria-hidden={!open}>
          <button
            type="button"
            className="support-widget__item"
            onClick={() => {
              setActiveChat('ai');
              setOpen(false);
            }}
            aria-label="Tư vấn bằng AI"
          >
            <MagicWandIcon className="support-widget__icon" />
            <span className="support-widget__tooltip">Tư vấn bằng AI</span>
          </button>

          <button
            type="button"
            className="support-widget__item"
            onClick={() => {
              setActiveChat('agent');
              setOpen(false);
            }}
            aria-label="Chat với nhân viên"
          >
            <PersonIcon className="support-widget__icon" />
            <span className="support-widget__tooltip">Chat với nhân viên</span>
          </button>
        </div>

        <button
          type="button"
          className="support-widget__main"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Đóng hỗ trợ' : 'Mở hỗ trợ'}
        >
          <div className="support-widget__main-icon-wrapper">
            <ChatBubbleIcon
              className={`support-widget__icon support-widget__icon--chat ${open ? 'support-widget__icon--hidden' : ''}`}
            />
            <Cross1Icon
              className={`support-widget__icon support-widget__icon--cross ${open ? '' : 'support-widget__icon--hidden'}`}
            />
          </div>
        </button>
      </div>
    </>
  );
}
