'use client';

import * as signalR from '@microsoft/signalr';
import { useEffect, useRef, useCallback } from 'react';

export interface NotificationPayload {
  id: number;
  senderId: string | null;
  receiverId: string;
  notificationTypeId: number;
  title: string;
  content: string;
  status: 0 | 1 | 'Unread' | 'Read'; // Backend sends 0/1, but may also send string
  createdAt: string;
}

interface UseNotificationHubOptions {
  token?: string | null | undefined;
  onReceive: (notification: NotificationPayload) => void;
}

export function useNotificationHub({ token, onReceive }: UseNotificationHubOptions) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const onReceiveRef = useRef(onReceive);

  useEffect(() => {
    onReceiveRef.current = onReceive;
  }, [onReceive]);

  const getToken = useCallback((): string | null => {
    if (token) return token;
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
  }, [token]);

  const connect = useCallback(async () => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) return;

    const accessToken = getToken();
    if (!accessToken) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? '';
    const hubUrl = `${baseUrl}/hubs/notification`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getToken() ?? '',
        skipNegotiation: false,
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('ReceiveNotification', (notification: any) => {
      onReceiveRef.current(notification);
    });

    connection.onreconnected((id) => console.log('[NotificationHub] Reconnected:', id));
    
    connectionRef.current = connection;

    try {
      await connection.start();
    } catch (err) {
      console.error('[NotificationHub] Connection error:', err);
    }
  }, [getToken]);

  useEffect(() => {
    void connect();

    return () => {
      connectionRef.current?.stop().catch(() => null);
      connectionRef.current = null;
    };
  }, [connect]);
}
