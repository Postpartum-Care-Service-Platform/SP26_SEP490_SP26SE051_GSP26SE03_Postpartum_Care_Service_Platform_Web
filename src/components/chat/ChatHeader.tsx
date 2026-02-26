'use client';

import { Cross1Icon, EnterFullScreenIcon, ExitFullScreenIcon, MinusIcon } from '@radix-ui/react-icons';
import React from 'react';

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  leftAvatar?: React.ReactNode;
  rightActions?: React.ReactNode;
};

export function ChatHeader({
  title,
  subtitle,
  onClose,
  onMinimize,
  onExpand,
  isExpanded,
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
        {onExpand && (
          <button
            type="button"
            className="chatbox__icon-btn"
            onClick={onExpand}
            aria-label={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
            title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
          >
            {isExpanded ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
          </button>
        )}
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

