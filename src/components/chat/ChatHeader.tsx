'use client';

import React from 'react';
import { Cross1Icon, MinusIcon } from '@radix-ui/react-icons';

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onMinimize?: () => void;
  leftAvatar?: React.ReactNode;
  rightActions?: React.ReactNode;
};

export function ChatHeader({
  title,
  subtitle,
  onClose,
  onMinimize,
  leftAvatar,
  rightActions,
}: ChatHeaderProps) {
  return (
    <div className="chatbox__header">
      <div className="chatbox__header-left">
        <div className="chatbox__avatar">{leftAvatar}</div>
        <div className="chatbox__title">
          <div className="chatbox__title-main">{title}</div>
          {subtitle && <div className="chatbox__title-sub">{subtitle}</div>}
        </div>
      </div>

      <div className="chatbox__header-actions">
        {rightActions}
        {onMinimize && (
          <button type="button" className="chatbox__icon-btn" onClick={onMinimize} aria-label="Thu nhỏ">
            <MinusIcon />
          </button>
        )}
        <button type="button" className="chatbox__icon-btn" onClick={onClose} aria-label="Đóng">
          <Cross1Icon />
        </button>
      </div>
    </div>
  );
}

