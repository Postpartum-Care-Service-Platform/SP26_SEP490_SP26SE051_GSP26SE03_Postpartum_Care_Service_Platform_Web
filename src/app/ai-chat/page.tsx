'use client';

import { ChatBubbleIcon, PlusIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';

import chatService, { ConversationResponse, MessageResponse } from '@/services/chat.service';
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

function createIdGenerator() {
  let current = 1;
  return () => current++;
}

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
  const getNextIdRef = useRef<(() => number) | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLDivElement>(null);

  const [isThreadsOpen, setIsThreadsOpen] = useState(false);
  const [threads, setThreads] = useState<ConversationResponse[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchThreads = async () => {
    try {
      const data = await chatService.getConversations();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchThreads();
    }
  }, [token]);

  const hasStarted = messages.length > 0 || activeConversationId !== null;

  useEffect(() => {
    if (!getNextIdRef.current) {
      getNextIdRef.current = createIdGenerator();
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.replace(ROUTES.login);
    }
  }, [token, router]);

  const orderedThreads = useMemo(() => {
    return [...threads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [threads]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    let convId = activeConversationId;

    try {
      setIsLoading(true);
      
      // Nếu chưa có conversation, tạo mới
      if (!convId) {
        const newConv = await chatService.createConversation();
        convId = newConv.id;
        setActiveConversationId(convId);
        fetchThreads(); // Refresh list sidebar
      }

      // Tạm thời hiển thị tin nhắn của user
      const tempUserMsg: Message = {
        id: Date.now(),
        text: trimmedText,
        sender: 'user',
      };
      setMessages((prev) => [...prev, tempUserMsg]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.innerText = '';
      }

      // Gửi tin nhắn và chờ AI phản hồi
      const response = await chatService.sendMessage(convId, trimmedText);

      // Cập nhật messages thực tế từ BE
      const aiMsg: Message = {
        id: response.aiMessage.id,
        text: response.aiMessage.content,
        sender: 'ai',
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        {
          id: response.userMessage.id,
          text: response.userMessage.content,
          sender: 'user',
        },
        aiMsg,
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  if (!token) {
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
            <button
              type="button"
              className={styles.newChatThread}
              onClick={() => {
                setMessages([]);
                setActiveConversationId(null);
                setIsThreadsOpen(false);
              }}
            >
              + Đoạn chat mới
            </button>
            {orderedThreads.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${styles.threadSelect} ${activeConversationId === t.id ? styles.threadActive : ''}`}
                onClick={async () => {
                  try {
                    setIsThreadsOpen(false);
                    setActiveConversationId(t.id);
                    setIsLoading(true);
                    const detail = await chatService.getConversation(t.id);
                    const mappedMsgs: Message[] = detail.messages.map(m => ({
                      id: m.id,
                      text: m.content,
                      sender: m.senderType === 'Customer' ? 'user' : 'ai'
                    }));
                    setMessages(mappedMsgs);
                  } catch (err) {
                    console.error('Load thread error', err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <span className={styles.threadName}>{t.name || `Đoạn chat #${t.id}`}</span>
                <span className={styles.threadTime}>{new Date(t.createdAt).toLocaleDateString('vi-VN')}</span>
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
                <div
                  ref={textareaRef}
                  contentEditable={!isLoading}
                  onInput={(e) => setInput(e.currentTarget.innerText)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(textareaRef.current?.innerText || '');
                    }
                  }}
                  className={styles.chatInput}
                  data-placeholder={hasStarted ? 'Gõ tin nhắn…' : 'Hôm nay bạn đang thấy thế nào?'}
                />
                <button type="submit" className={styles.sendButton} aria-label="Gửi" disabled={isLoading || !input.trim()}>
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
              {isLoading && (
                <div className={`${styles.message} ${styles.ai} ${styles.loading}`}>
                  <span className={styles.dot}>.</span>
                  <span className={styles.dot}>.</span>
                  <span className={styles.dot}>.</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Tooltip.Provider>
  );
}
