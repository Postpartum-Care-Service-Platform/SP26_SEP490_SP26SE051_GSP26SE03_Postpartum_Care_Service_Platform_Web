'use client';

import { PaperPlaneIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';

type ChatComposerProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = React.useState('');
  const editableRef = React.useRef<HTMLDivElement>(null);

  const submit = async () => {
    const v = editableRef.current?.innerText.trim();
    if (!v) return;
    if (editableRef.current) editableRef.current.innerText = '';
    setText('');
    await onSend(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.innerText);
  };

  return (
    <div className="chatbox__composer">
      <button type="button" className="chatbox__composer-btn" aria-label="Thêm" disabled={disabled}>
        <PlusIcon />
      </button>

      <div
        ref={editableRef}
        contentEditable={!disabled}
        className="chatbox__composer-input chatbox__composer-editable"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Nhập tin nhắn..."
        style={{ 
          paddingTop: '10px', 
          paddingBottom: '10px',
          minHeight: '42px',
          maxHeight: '120px',
          overflowY: 'auto',
          lineHeight: '20px',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: disabled ? '#f5f5f5' : '#fff'
        }}
      />

      <button
        type="button"
        className="chatbox__composer-btn chatbox__composer-btn--send"
        onClick={submit}
        aria-label="Gửi"
        disabled={disabled || !text.trim()}
      >
        <PaperPlaneIcon />
      </button>
    </div>
  );
}
