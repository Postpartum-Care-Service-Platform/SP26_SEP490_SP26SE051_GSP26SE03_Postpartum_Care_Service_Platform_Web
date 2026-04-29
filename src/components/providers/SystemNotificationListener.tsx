'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useToast } from '@/components/ui/toast/use-toast';

/**
 * Component lắng nghe thông báo hệ thống toàn cục và hiển thị Toast
 */
export function SystemNotificationListener() {
  const { token } = useAuth();
  const { toast } = useToast();

  useNotificationHub({
    token,
    onReceive: (notification: any) => {
      console.log('[SystemNotificationListener] New notification received:', notification);
      
      // Xử lý thông báo loại AmenityTicket
      if (notification.type === 'AmenityTicket') {
        toast({
          title: notification.title || 'Thông báo dịch vụ',
          description: notification.content || 'Có thay đổi mới về dịch vụ tiện ích.',
          variant: 'success',
          durationMs: 5000,
        });
      }

      // Xử lý thông báo loại PackageRequest
      if (notification.type === 'PackageRequest') {
        toast({
          title: notification.title || 'Yêu cầu thiết kế gói',
          description: notification.content || 'Có cập nhật mới về yêu cầu thiết kế gói.',
          variant: 'success',
          durationMs: 5000,
        });
      }
    }
  });

  return null; // Component này không render gì cả
}
