'use client';

import type { SupportRequestResponse } from '@/services/chat.service';

import styles from './support-requests-list.module.css';

type Props = {
  requests: SupportRequestResponse[];
  onAccept: (requestId: number) => void;
  loading?: boolean;
};

export function SupportRequestsList({ requests, onAccept, loading }: Props) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>Không có yêu cầu chat nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Yêu cầu chat ({requests.length})</h2>
      </div>
      <div className={styles.list}>
        {requests.map((request) => (
          <div key={request.id} className={styles.requestCard}>
            <div className={styles.avatar}>
              <div className={styles.avatarCircle}>
                {(request.customerName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className={styles.statusDot} />
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.customerName}>
                  {request.customerName || 'Unknown'}
                </h3>
                <span className={styles.time}>
                  {new Date(request.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className={styles.reason}>{request.reason || 'Yêu cầu hỗ trợ'}</p>
              <button
                onClick={() => onAccept(request.id)}
                className={styles.acceptButton}
              >
                Nhận yêu cầu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
