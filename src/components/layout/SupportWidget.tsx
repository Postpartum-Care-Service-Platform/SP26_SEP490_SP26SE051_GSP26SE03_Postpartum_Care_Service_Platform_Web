'use client';

import React from 'react';
import { ChatBubbleIcon, Cross1Icon, MagicWandIcon, PersonIcon } from '@radix-ui/react-icons';

import type { ChatMessage, ChatMode, ChatSender, ChatStructuredData } from '@/types/chat';
import { ChatBox } from '@/components/chat/ChatBox';
import chatService, { type MessageResponse, type ConversationResponse, type AiStructuredResponse } from '@/services/chat.service';
import { streamMessage } from '@/services/chat-stream.service';

import '@/styles/support-widget.css';

// Config: bật/tắt streaming
const USE_STREAMING = true;

// Helper: Convert API MessageResponse to ChatMessage
function toFEMessage(msg: MessageResponse, chatId: string, structuredData?: AiStructuredResponse): ChatMessage {
  let sender: ChatSender = 'other';
  if (msg.senderType === 'Customer') {
    sender = 'me';
  } else if (msg.senderType === 'AI' || msg.senderType === 'Staff') {
    sender = 'other';
  }

  // Convert structured data nếu có
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
  const [open, setOpen] = React.useState(false);
  const [activeChat, setActiveChat] = React.useState<ChatMode | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const [aiConversation, setAiConversation] = React.useState<ConversationResponse | null>(null);
  const [aiMessages, setAiMessages] = React.useState<ChatMessage[]>([]);

  const [agentMessages, setAgentMessages] = React.useState<ChatMessage[]>([]);

  // Load hoặc tạo conversation khi mở chat AI
  const initAiConversation = React.useCallback(async () => {
    if (aiConversation) return;

    setLoading(true);
    try {
      // Lấy danh sách conversations
      const conversations = await chatService.getConversations();

      if (conversations.length > 0) {
        // Dùng conversation đầu tiên
        const conv = await chatService.getConversation(conversations[0].id);
        setAiConversation(conv);
        setAiMessages(conv.messages.map((m) => toFEMessage(m, 'ai')));
      } else {
        // Tạo mới
        const newConv = await chatService.createConversation({ name: 'Tư vấn AI' });
        setAiConversation(newConv);
        setAiMessages([
          {
            id: 'welcome',
            chatId: 'ai',
            sender: 'other',
            text: 'Chào bạn! Mình là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to init conversation:', error);
      // Fallback: hiển thị welcome message
      setAiMessages([
        {
          id: 'welcome',
          chatId: 'ai',
          sender: 'other',
          text: 'Chào bạn! Mình là trợ lý AI. Bạn muốn tư vấn điều gì hôm nay?',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [aiConversation]);

  // Khi mở chat AI
  React.useEffect(() => {
    if (activeChat === 'ai') {
      initAiConversation();
    }
  }, [activeChat, initAiConversation]);

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
    if (mode === 'ai') {
      // Thêm tin nhắn user ngay lập tức
      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        chatId: 'ai',
        sender: 'me',
        text,
        createdAt: new Date().toISOString(),
        status: 'sending',
      };
      setAiMessages((prev) => [...prev, tempUserMsg]);

      // Hiển thị typing indicator
      setIsTyping(true);

      try {
        // Nếu chưa có conversation, tạo mới
        let convId = aiConversation?.id;
        if (!convId) {
          const newConv = await chatService.createConversation({ name: 'Tư vấn AI' });
          setAiConversation(newConv);
          convId = newConv.id;
        }

        if (USE_STREAMING) {
          // Streaming mode: hiển thị text real-time
          const aiMsgId = `ai-stream-${Date.now()}`;

          // Cập nhật user message thành sent, KHÔNG thêm AI message trống
          // Giữ typing indicator cho đến khi có text thực sự
          setAiMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
            return [
              ...filtered,
              { ...tempUserMsg, id: `user-${Date.now()}`, status: 'sent' as const },
            ];
          });
          // Giữ isTyping = true để hiển thị 3 chấm

          let aiMessageAdded = false;

          await streamMessage(convId, text, {
            onChunk: (_chunk, _fullText, displayText) => {
              // Cập nhật text của AI message (đã filter tool calls)
              if (displayText && displayText.trim() !== '') {
                // Có text thực sự, tắt typing và hiển thị message
                setIsTyping(false);

                if (!aiMessageAdded) {
                  // Thêm AI message lần đầu
                  aiMessageAdded = true;
                  setAiMessages((prev) => [
                    ...prev,
                    {
                      id: aiMsgId,
                      chatId: 'ai',
                      sender: 'other' as ChatSender,
                      text: displayText,
                      createdAt: new Date().toISOString(),
                      author: { id: '', name: 'AI Assistant' },
                    },
                  ]);
                } else {
                  // Cập nhật text
                  setAiMessages((prev) =>
                    prev.map((m) => (m.id === aiMsgId ? { ...m, text: displayText } : m))
                  );
                }
              }
              // Nếu chưa có displayText (đang xử lý tool), giữ typing indicator
            },
            onComplete: async (_fullText, displayText, messageId) => {
              setIsTyping(false);

              // Nếu displayText rỗng (toàn bộ là tool calls), gọi API thường để lấy kết quả
              if (!displayText || displayText.trim() === '') {
                console.log('Stream returned only tool calls, fetching final result...');
                setIsTyping(true);
                try {
                  // Đợi một chút để BE xử lý xong
                  await new Promise((r) => setTimeout(r, 500));

                  // Lấy conversation mới nhất để có message cuối
                  const conv = await chatService.getConversation(convId!);
                  const lastAiMsg = conv.messages.filter((m) => m.senderType === 'AI').pop();

                  setIsTyping(false);
                  if (lastAiMsg) {
                    if (!aiMessageAdded) {
                      // Thêm message mới
                      setAiMessages((prev) => [
                        ...prev,
                        {
                          id: String(lastAiMsg.id),
                          chatId: 'ai',
                          sender: 'other' as ChatSender,
                          text: lastAiMsg.content,
                          createdAt: new Date().toISOString(),
                          author: { id: '', name: 'AI Assistant' },
                        },
                      ]);
                    } else {
                      setAiMessages((prev) =>
                        prev.map((m) =>
                          m.id === aiMsgId
                            ? { ...m, id: String(lastAiMsg.id), text: lastAiMsg.content }
                            : m
                        )
                      );
                    }
                  } else {
                    // Fallback message
                    if (!aiMessageAdded) {
                      setAiMessages((prev) => [
                        ...prev,
                        {
                          id: aiMsgId,
                          chatId: 'ai',
                          sender: 'other' as ChatSender,
                          text: 'Đang xử lý yêu cầu của bạn...',
                          createdAt: new Date().toISOString(),
                          author: { id: '', name: 'AI Assistant' },
                        },
                      ]);
                    } else {
                      setAiMessages((prev) =>
                        prev.map((m) =>
                          m.id === aiMsgId
                            ? { ...m, text: 'Đang xử lý yêu cầu của bạn...' }
                            : m
                        )
                      );
                    }
                  }
                } catch (err) {
                  setIsTyping(false);
                  console.error('Failed to fetch final result:', err);
                  if (!aiMessageAdded) {
                    setAiMessages((prev) => [
                      ...prev,
                      {
                        id: aiMsgId,
                        chatId: 'ai',
                        sender: 'other' as ChatSender,
                        text: 'Có lỗi xảy ra. Vui lòng thử lại.',
                        createdAt: new Date().toISOString(),
                        author: { id: '', name: 'AI Assistant' },
                      },
                    ]);
                  } else {
                    setAiMessages((prev) =>
                      prev.map((m) =>
                        m.id === aiMsgId
                          ? { ...m, text: 'Có lỗi xảy ra. Vui lòng thử lại.' }
                          : m
                      )
                    );
                  }
                }
              } else {
                // Cập nhật với ID thật từ server nếu có
                if (aiMessageAdded) {
                  setAiMessages((prev) =>
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
              console.error('Stream error, falling back to normal API:', error);
              setIsTyping(false);
              // Fallback: gọi API thường
              try {
                setIsTyping(true);
                const response = await chatService.sendMessage(convId!, text);
                const structuredData = response.aiStructuredData || response.AiStructuredData;
                setIsTyping(false);

                setAiMessages((prev) => {
                  // Xóa message stream nếu có và thay bằng response thật
                  const filtered = prev.filter((m) => m.id !== aiMsgId);
                  return [
                    ...filtered,
                    toFEMessage(response.aiMessage, 'ai', structuredData),
                  ];
                });
              } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setIsTyping(false);
                // Hiển thị error message
                setAiMessages((prev) => [
                  ...prev,
                  {
                    id: aiMsgId,
                    chatId: 'ai',
                    sender: 'other' as ChatSender,
                    text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                    createdAt: new Date().toISOString(),
                    author: { id: '', name: 'AI Assistant' },
                  },
                ]);
              }
            },
          });
        } else {
          // Normal mode: đợi response đầy đủ
          const response = await chatService.sendMessage(convId, text);
          console.log('Chat API response:', response);

          setIsTyping(false);

          const structuredData = response.aiStructuredData || response.AiStructuredData;

          setAiMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
            return [
              ...filtered,
              toFEMessage(response.userMessage, 'ai'),
              toFEMessage(response.aiMessage, 'ai', structuredData),
            ];
          });
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsTyping(false);
        setAiMessages((prev) =>
          prev.map((m) => (m.id === tempUserMsg.id ? { ...m, status: 'failed' as const } : m))
        );
      }
    } else {
      // Agent chat
      const msg: ChatMessage = {
        id: `agent-${Date.now()}`,
        chatId: 'agent',
        sender: 'me',
        text,
        createdAt: new Date().toISOString(),
      };
      setAgentMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <>
      <ChatBox
        open={activeChat === 'ai'}
        title="Tư vấn bằng AI"
        subtitle={loading ? 'Đang tải...' : 'Đang hoạt động'}
        messages={aiMessages}
        onSend={(text) => sendMessage('ai', text)}
        onClose={() => setActiveChat(null)}
        disabled={loading || isTyping}
        isTyping={isTyping}
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
