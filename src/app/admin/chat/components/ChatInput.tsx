'use client';

import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

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
      <button
        type="button"
        className={styles.attachmentButton}
        onClick={handleAttachmentClick}
        aria-label="Attach file"
      >
        <Paperclip size={20} className={styles.icon} />
      </button>
      <input
        type="text"
        placeholder="Type a message..."
        className={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className={styles.sendButton}
        aria-label="Send message"
      >
        <Send size={20} className={styles.icon} />
      </button>
    </form>
  );
}