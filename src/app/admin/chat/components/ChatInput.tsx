'use client';

import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import styles from './chat-input.module.css';

type Props = {
  onSend?: (message: string, file?: File) => void;
};

export function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend?.(message.trim());
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSend?.(message.trim() || '', file);
      setMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form className={styles.chatInput} onSubmit={handleSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        className={styles.fileInput}
        onChange={handleFileSelect}
        accept="image/*,application/pdf,.doc,.docx"
        aria-label="Upload file"
      />
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={styles.attachmentButton}
            onClick={handleAttachmentClick}
            aria-label="Attach file"
          >
            <Paperclip size={20} className={styles.icon} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Đính kèm tệp
        </TooltipContent>
      </Tooltip>
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        className={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="submit"
            className={styles.sendButton}
            aria-label="Send message"
          >
            <Send size={20} className={styles.icon} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Gửi tin nhắn
        </TooltipContent>
      </Tooltip>
    </form>
  );
}