'use client';

import type { SupportRequestResponse } from '@/services/chat.service';

import styles from './support-requests-list.module.css';

type Props = {
  requests: SupportRequestResponse[];
  onAccept: (requestId: number) => void;
  loading?: boolean;
};

export function SupportRequestsList({ requests, onAccept, loading }: Props) {
  const safeRequests = Array.isArray(requests) ? requests : [];

  return (
    <div className={styles.container}>
      <div className={styles.listHeader}>
        <h2 className={styles.title}>Yêu cầu chat</h2>
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : safeRequests.length === 0 ? (
        <div className={styles.empty}>
          <p>Không có yêu cầu chat nào</p>
        </div>
      ) : (
        <div className={styles.list}>
          {safeRequests.map((request) => {
            const displayName =
              request.customer?.fullName ||
              request.customerName ||
              request.customer?.username ||
              request.customer?.email ||
              'Unknown';

            const avatarUrl = request.customer?.avatarUrl || request.customerAvatar;

            const statusText =
              request.status === 'Pending'
                ? 'Đang chờ'
                : request.status === 'Accepted'
                  ? 'Đang tư vấn'
                  : request.status === 'Resolved'
                    ? 'Đã xử lý'
                    : request.status;

            return (
              <div key={request.id} className={styles.requestCard}>
                <div className={styles.avatar}>
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarCircle}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={styles.statusDot} />
                </div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <h3 className={styles.customerName}>{displayName}</h3>
                    <span className={styles.time}>
                      {new Date(request.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className={styles.reason}>{request.reason || 'Yêu cầu hỗ trợ'}</p>
                  <p className={styles.ticketMeta}>Trạng thái: {statusText}</p>
                  <button
                    onClick={() => onAccept(request.id)}
                    className={styles.acceptButton}
                  >
                    Nhận yêu cầu
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
