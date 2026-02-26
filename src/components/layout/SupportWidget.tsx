'use client';

import { ChatBubbleIcon, Cross1Icon } from '@radix-ui/react-icons';
import React from 'react';

import { ChatBox } from '@/components/chat/ChatBox';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';
import { streamMessage } from '@/services/chat-stream.service';
import chatService, { type AiStructuredResponse, type ConversationResponse, type MessageResponse } from '@/services/chat.service';
import type { ChatMessage, ChatMode, ChatSender, ChatStructuredData } from '@/types/chat';

import '@/styles/support-widget.css';

const USE_STREAMING = true;

function toFEMessage(msg: MessageResponse, chatId: string, structuredData?: AiStructuredResponse): ChatMessage {
  let sender: ChatSender = 'other';
  if (msg.senderType === 'Customer') {
    sender = 'me';
  } else if (msg.senderType === 'AI' || msg.senderType === 'Staff') {
    sender = 'other';
  }

  let feStructuredData: ChatStructuredData | undefined;
  if (structuredData) {
    feStructuredData = {
      type: structuredData.type,
      text: structuredData.text,
      data: structuredData.data,
    };
  }

  return {
    id: String(msg.id),
    chatId,
    sender,
    text: msg.content,
    createdAt: msg.createdAt,
    author: msg.senderName ? { id: msg.senderId || '', name: msg.senderName } : undefined,
    structuredData: feStructuredData,
  };
}

export function SupportWidget() {
  const { token, user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [activeChat, setActiveChat] = React.useState<ChatMode | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const [conversation, setConversation] = React.useState<ConversationResponse | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = React.useState<Set<string>>(new Set());
  const [hasStaffSupport, setHasStaffSupport] = React.useState(false);

  const {
    isConnected,
    joinConversation,
    leaveConversation,
    requestSupport,
    onReceiveMessage,
    onUserTyping,
    onStaffJoined,
    onSupportRequestCreated,
    onSupportResolved,
  } = useChatHub({
    token: token || '',
    autoConnect: !!token && !!user,
  });

  const initConversation = React.useCallback(async () => {
    if (conversation) return;

    setLoading(true);
    try {
      const conversations = await chatService.getConversations();

      if (conversations.length > 0) {
        const conv = await chatService.getConversation(conversations[0].id);
        setConversation(conv);

        const msgs = conv.messages.map((m) => toFEMessage(m, 'chat'));

        // Use hasActiveSupport from API response
        setHasStaffSupport(conv.hasActiveSupport);

        if (msgs.length === 0) {
          msgs.unshift({
            id: 'welcome',
            chatId: 'chat',
            sender: 'other',
            text: 'Xin chào! Tôi là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
            createdAt: new Date().toISOString(),
          });
        }

        setMessages(msgs);

        if (isConnected) {
          await joinConversation(conv.id);
        }
      } else {
        const newConv = await chatService.createConversation({ name: 'Chat tư vấn' });
        setConversation(newConv);
        setMessages([
          {
            id: 'welcome',
            chatId: 'chat',
            sender: 'other',
            text: 'Xin chào! Tôi là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
            createdAt: new Date().toISOString(),
          },
        ]);

        if (isConnected) {
          await joinConversation(newConv.id);
        }
      }
    } catch (error) {
      console.error('Failed to init conversation:', error);
      setMessages([
        {
          id: 'welcome',
          chatId: 'chat',
          sender: 'other',
          text: 'Xin chào! Tôi là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [conversation, isConnected, joinConversation]);

  React.useEffect(() => {
    if (activeChat === 'agent') {
      initConversation();
    }

    return () => {
      if (conversation && isConnected) {
        leaveConversation(conversation.id);
      }
    };
  }, [activeChat, initConversation, conversation, isConnected, leaveConversation]);

  React.useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onReceiveMessage((message) => {
      if (message.conversationId === conversation.id) {
        const newMsg: ChatMessage = {
          id: String(message.id),
          chatId: 'chat',
          sender: message.senderType === 'Customer' && message.senderId === user?.id ? 'me' : 'other',
          text: message.content,
          createdAt: message.createdAt,
          author: message.senderName ? { id: message.senderId || '', name: message.senderName } : undefined,
        };

        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        if (message.senderType === 'Staff') {
          setHasStaffSupport(true);
        }
      }
    });

    return unsubscribe;
  }, [conversation, onReceiveMessage, user?.id]);

  React.useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onUserTyping((event) => {
      if (event.conversationId === conversation.id && event.userId !== user?.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (event.isTyping) {
            newSet.add(event.userName);
          } else {
            newSet.delete(event.userName);
          }
          return newSet;
        });

        setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(event.userName);
            return newSet;
          });
        }, 3000);
      }
    });

    return unsubscribe;
  }, [conversation, onUserTyping, user?.id]);

  React.useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onStaffJoined((event) => {
      if (event.conversationId === conversation.id) {
        // System message đã được broadcast qua ReceiveMessage
        // Chỉ cần update state
        setHasStaffSupport(true);
      }
    });

    return unsubscribe;
  }, [conversation, onStaffJoined]);

  React.useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onSupportRequestCreated((event) => {
      if (event.conversationId === conversation.id) {
        const systemMsg: ChatMessage = {
          id: `system-${Date.now()}`,
          chatId: 'chat',
          sender: 'other',
          text: event.message,
          createdAt: event.timestamp,
          author: { id: 'system', name: 'Hệ thống' },
        };
        setMessages((prev) => [...prev, systemMsg]);
      }
    });

    return unsubscribe;
  }, [conversation, onSupportRequestCreated]);

  React.useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onSupportResolved((event) => {
      if (event.conversationId === conversation.id) {
        // Không cần thêm system message vì đã được broadcast qua ReceiveMessage
        // Chỉ cần update state
        setHasStaffSupport(false);
      }
    });

    return unsubscribe;
  }, [conversation, onSupportResolved]);

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

  const sendMessage = async (_mode: ChatMode, text: string) => {
    if (!conversation) return;

    if (text === '/request-support') {
      await handleRequestSupport();
      return;
    }

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      chatId: 'chat',
      sender: 'me',
      text,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      if (hasStaffSupport) {
        // Có staff support → customer gửi qua REST API messages
        await chatService.sendMessage(conversation.id, text);

        // Remove temp message - SignalR sẽ broadcast message thật
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      } else {
        // Chưa có staff → gửi qua AI streaming
        setIsTyping(true);

        if (USE_STREAMING) {
          const aiMsgId = `ai-stream-${Date.now()}`;
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempMsg.id);
            return [
              ...filtered,
              { ...tempMsg, id: `user-${Date.now()}`, status: 'sent' as const },
            ];
          });

          let aiMessageAdded = false;

          await streamMessage(conversation.id, text, {
            onChunk: (_chunk, _fullText, displayText) => {
              if (displayText && displayText.trim() !== '') {
                setIsTyping(false);

                if (!aiMessageAdded) {
                  aiMessageAdded = true;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: aiMsgId,
                      chatId: 'chat',
                      sender: 'other' as ChatSender,
                      text: displayText,
                      createdAt: new Date().toISOString(),
                      author: { id: '', name: 'AI Assistant' },
                    },
                  ]);
                } else {
                  setMessages((prev) =>
                    prev.map((m) => (m.id === aiMsgId ? { ...m, text: displayText } : m))
                  );
                }
              }
            },
            onComplete: async (_fullText, displayText, messageId) => {
              setIsTyping(false);

              if (!displayText || displayText.trim() === '') {
                setIsTyping(true);
                try {
                  await new Promise((r) => setTimeout(r, 500));
                  const conv = await chatService.getConversation(conversation.id);
                  const lastAiMsg = conv.messages.filter((m) => m.senderType === 'AI').pop();

                  setIsTyping(false);
                  if (lastAiMsg) {
                    if (!aiMessageAdded) {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: String(lastAiMsg.id),
                          chatId: 'chat',
                          sender: 'other' as ChatSender,
                          text: lastAiMsg.content,
                          createdAt: new Date().toISOString(),
                          author: { id: '', name: 'AI Assistant' },
                        },
                      ]);
                    } else {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === aiMsgId
                            ? { ...m, id: String(lastAiMsg.id), text: lastAiMsg.content }
                            : m
                        )
                      );
                    }
                  }
                } catch (err) {
                  setIsTyping(false);
                  console.error('Failed to fetch final result:', err);
                }
              } else {
                if (aiMessageAdded) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId
                        ? { ...m, id: messageId ? String(messageId) : aiMsgId, text: displayText }
                        : m
                    )
                  );
                }
              }
            },
            onError: async (error) => {
              console.error('Stream error:', error);
              setIsTyping(false);
              try {
                setIsTyping(true);
                const response = await chatService.sendMessage(conversation.id, text);
                const structuredData = response.aiStructuredData || response.AiStructuredData;
                setIsTyping(false);

                setMessages((prev) => {
                  const filtered = prev.filter((m) => m.id !== aiMsgId);
                  return [
                    ...filtered,
                    toFEMessage(response.aiMessage, 'chat', structuredData),
                  ];
                });
              } catch (fallbackError) {
                console.error('Fallback failed:', fallbackError);
                setIsTyping(false);
              }
            },
          });
        } else {
          const response = await chatService.sendMessage(conversation.id, text);
          setIsTyping(false);

          const structuredData = response.aiStructuredData || response.AiStructuredData;

          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempMsg.id);
            return [
              ...filtered,
              toFEMessage(response.userMessage, 'chat'),
              toFEMessage(response.aiMessage, 'chat', structuredData),
            ];
          });
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? { ...m, status: 'failed' as const } : m))
      );
    }
  };

  const handleRequestSupport = async () => {
    if (!conversation || !isConnected) return;

    try {
      await requestSupport(conversation.id, 'Yêu cầu hỗ trợ từ khách hàng');
    } catch (error) {
      console.error('Failed to request support:', error);
      alert('Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <ChatBox
        open={activeChat === 'agent'}
        title="Chat tư vấn"
        subtitle={
          loading
            ? 'Đang tải...'
            : hasStaffSupport
              ? 'Nhân viên đang hỗ trợ'
              : 'AI Assistant'
        }
        messages={messages}
        onSend={(text) => sendMessage('agent', text)}
        onClose={() => setActiveChat(null)}
        disabled={loading}
        isTyping={isTyping || typingUsers.size > 0}
      />

      <div className={`support-widget ${open ? 'support-widget--open' : ''}`}>
        <div className="support-widget__menu" aria-hidden={!open}>
          <button
            type="button"
            className="support-widget__item"
            onClick={() => {
              setActiveChat('agent');
              setOpen(false);
            }}
            aria-label="Chat tư vấn"
          >
            <ChatBubbleIcon className="support-widget__icon" />
            <span className="support-widget__tooltip">Chat tư vấn</span>
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
