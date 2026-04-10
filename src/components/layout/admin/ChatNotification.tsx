'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useChatHub } from '@/hooks/useChatHub';
import chatService from '@/services/chat.service';

import styles from './notification-dropdown.module.css';

export function ChatNotification() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !user) return;
    try {
      const data = await chatService.getAllConversations();
      // Handle the object format correctly
      let count = 0;
      if (typeof data === 'object' && data !== null) {
        const rawData = data as any;
        count = rawData.totalUnreadCount || 0;
      }
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch chat unread count:', error);
    }
  }, [token, user]);

  // SignalR for realtime updates
  const { onReceiveMessage, onMessagesRead } = useChatHub({
    token: token || '',
    autoConnect: !!token && !!user,
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll as fallback or for other updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  // Realtime update when message received OR read
  useEffect(() => {
    const unsubReceive = onReceiveMessage((message) => {
      if (message.senderType === 'Customer') {
        fetchData();
      }
    });
    
    const unsubRead = onMessagesRead(() => {
      fetchData();
    });

    return () => {
      unsubReceive();
      unsubRead();
    };
  }, [onReceiveMessage, onMessagesRead, fetchData]);

  const displayCount = unreadCount > 0 ? (unreadCount > 99 ? '99+' : `${unreadCount}`) : null;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <Tooltip.Trigger asChild>
          <button 
            className={styles.trigger} 
            type="button" 
            aria-label="Tin nhắn"
            onClick={() => router.push('/admin/chat')}
          >
            <MessageSquare size={18} />
            {displayCount && <span className={styles.badge}>{displayCount}</span>}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltipContent} side="bottom" sideOffset={5}>
            Tin nhắn ({unreadCount} chưa đọc)
            <Tooltip.Arrow className={styles.tooltipArrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
