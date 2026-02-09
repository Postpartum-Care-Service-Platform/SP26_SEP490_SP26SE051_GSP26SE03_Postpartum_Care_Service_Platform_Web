'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { PlusIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { ROUTES } from '@/routes/routes';
import { useAuth } from '@/contexts/AuthContext';

import styles from './AiChat.module.css';

const SUGGESTIONS = ['Tôi đang stress', 'Tôi cần lời khuyên', 'Tôi chỉ muốn tâm sự', 'Hôm nay mình thấy mệt'];

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

type ChatThread = {
  id: string;
  title: string;
  pinned?: boolean;
};

function SidebarIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button type="button" className={styles.navIconBtn} aria-label={label} onClick={onClick}>
          {icon}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} side="right" align="center" sideOffset={10}>
          {label}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function AiChatPage() {
  const router = useRouter();
  const { token } = useAuth();

  // AuthContext loads from localStorage on mount; avoid redirect until hydrated
  const [authReady, setAuthReady] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isThreadsOpen, setIsThreadsOpen] = useState(false);
  const [threads] = useState<ChatThread[]>([
    { id: 't-1', title: 'Tâm sự hôm nay', pinned: true },
    { id: 't-2', title: 'Căng thẳng & mệt mỏi' },
    { id: 't-3', title: 'Ngủ ngon hơn' },
  ]);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!token) {
      router.replace(ROUTES.login);
    }
  }, [authReady, token, router]);

  const orderedThreads = useMemo(() => {
    const pinned = threads.filter((t) => t.pinned);
    const rest = threads.filter((t) => !t.pinned);
    return [...pinned, ...rest];
  }, [threads]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: trimmedText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `Cảm ơn bạn đã chia sẻ. Mình nghe thấy bạn nói "${trimmedText}".`,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  if (!authReady || !token) {
    return null;
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Sidebar">
          <div className={styles.sidebarTop}>
            <Link href={ROUTES.home} className={styles.sidebarLogoLink} aria-label="Trang chủ">
              <Image className={styles.sidebarLogo} src={LogoSymbol} alt="The Joyful Nest" priority />
            </Link>

            <nav className={styles.sidebarNav} aria-label="Tools">
              <SidebarIconButton
                label="Thêm mới"
                icon={<PlusIcon width={20} height={20} />}
                onClick={() => {
                  setMessages([]);
                  setInput('');
                }}
              />
              <SidebarIconButton
                label="Danh sách chat"
                icon={<ChatBubbleIcon width={20} height={20} />}
                onClick={() => setIsThreadsOpen((v) => !v)}
              />
            </nav>
          </div>

          <div className={styles.sidebarBottom}>
            <div className={styles.avatar} aria-label="User" title="User">
              U
            </div>
          </div>
        </aside>

        <div
          className={`${styles.threadsOverlay} ${isThreadsOpen ? styles.threadsOverlayOpen : ''}`}
          onClick={() => setIsThreadsOpen(false)}
          aria-hidden={!isThreadsOpen}
        />

        <div className={`${styles.threadsPanel} ${isThreadsOpen ? styles.threadsPanelOpen : ''}`} aria-hidden={!isThreadsOpen}>
          <div className={styles.threadsPanelHeader}>
            <div className={styles.threadsTitle}>Đoạn chat</div>
            <button
              type="button"
              className={styles.threadsCloseBtn}
              onClick={() => setIsThreadsOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          <div className={styles.threadsList}>
            {orderedThreads.map((t) => (
              <button
                key={t.id}
                type="button"
                className={styles.threadSelect}
                onClick={() => {
                  setIsThreadsOpen(false);
                  console.log('Select thread', t.id);
                }}
              >
                <span className={styles.threadName}>{t.title}</span>
                {t.pinned ? <span className={styles.threadPinnedTag}>Pinned</span> : null}
              </button>
            ))}
          </div>
        </div>

        <main className={`${styles.shell} ${hasStarted ? styles.chatStarted : ''}`}>
          <div className={styles.chatContainer}>
            <div className={styles.inputWrapper}>
              <div className={styles.welcomeState}>
                <h1 className={styles.welcomeTitle}>Mình có thể giúp gì cho bạn?</h1>
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className={styles.suggestionBadge}
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.chatInputForm}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={styles.chatInput}
                  placeholder={hasStarted ? 'Gõ tin nhắn…' : 'Hôm nay bạn đang thấy thế nào?'}
                />
                <button type="submit" className={styles.sendButton} aria-label="Gửi">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 14L21 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 3L14.5 21L10 14L3 9.5L21 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className={styles.messagesWrapper} ref={chatContainerRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </Tooltip.Provider>
  );
}
