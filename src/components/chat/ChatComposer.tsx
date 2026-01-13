'use client';

import React from 'react';
import { PaperPlaneIcon, PlusIcon } from '@radix-ui/react-icons';

type ChatComposerProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = React.useState('');

  const submit = async () => {
    const v = text.trim();
    if (!v) return;
    setText('');
    await onSend(v);
  };

  return (
    <div className="chatbox__composer">
      <button type="button" className="chatbox__composer-btn" aria-label="Thêm" disabled={disabled}>
        <PlusIcon />
      </button>

      <input
        className="chatbox__composer-input"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        disabled={disabled}
      />

      <button
        type="button"
        className="chatbox__composer-btn chatbox__composer-btn--send"
        onClick={submit}
        aria-label="Gửi"
        disabled={disabled}
      >
        <PaperPlaneIcon />
      </button>
    </div>
  );
}
