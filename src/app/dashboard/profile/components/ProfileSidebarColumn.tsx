'use client';

import { Calendar, CreditCard, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import bookingService from '@/services/booking.service';
import transactionService from '@/services/transaction.service';
import userService from '@/services/user.service';
import type { Account } from '@/types/account';

import styles from './profile-sidebar-column.module.css';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') return maybeMessage;
  }

  return fallback;
};

export function ProfileSidebarColumn() {
  const { user, isAuthenticated } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadAccount();
      loadStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadAccount = async () => {
    try {
      const data = await userService.getCurrentAccount();
      setAccount(data);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof (err as { status?: unknown }).status === 'number' &&
        (err as { status: number }).status === 401
      ) {
        // 401 đã được xử lý ở apiClient; không log thêm.
      } else {
        console.error('Failed to load account:', getErrorMessage(err, 'Failed to load account'));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [bookings, transactions] = await Promise.all([
        bookingService.getMyBookings().catch(() => []),
        transactionService.getMyTransactions().catch(() => []),
      ]);
      setBookingsCount(bookings.length);
      setTransactionsCount(transactions.length);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Lấy avatar từ account hoặc ownerProfile
  const avatarUrl = account?.avatarUrl || account?.ownerProfile?.avatarUrl || null;
  const displayName = account?.ownerProfile?.fullName || account?.username || user?.username || 'Chưa có thông tin';
  const displayPhone = account?.phone || account?.ownerProfile?.phoneNumber || '';
  const displayEmail = account?.email || '';
  const displayAddress = account?.ownerProfile?.address || '';

  if (loading) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.loading}>Đang tải...</div>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <div className={styles.profileMain}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image 
                src={avatarUrl} 
                alt={displayName} 
                width={120} 
                height={120} 
                className={styles.avatar}
                unoptimized={avatarUrl.startsWith('http')}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{displayName}</div>
            <div className={styles.role}>{account?.roleName || 'Khách hàng'}</div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Calendar size={20} className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statValue}>{bookingsCount}</div>
              <div className={styles.statLabel}>Đặt phòng</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <CreditCard size={20} className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statValue}>{transactionsCount}</div>
              <div className={styles.statLabel}>Giao dịch</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Thông tin liên hệ</div>
          
          {displayEmail && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <Mail size={16} />
                <span>Email</span>
              </div>
              <span className={styles.infoValue}>{displayEmail}</span>
            </div>
          )}

          {displayPhone && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <Phone size={16} />
                <span>Số điện thoại</span>
              </div>
              <span className={styles.infoValue}>{displayPhone}</span>
            </div>
          )}

          {displayAddress && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <MapPin size={16} />
                <span>Địa chỉ</span>
              </div>
              <span className={styles.infoValue}>{displayAddress}</span>
            </div>
          )}

          {!displayEmail && !displayPhone && !displayAddress && (
            <div className={styles.emptyInfo}>Chưa có thông tin liên hệ</div>
          )}
        </div>
      </div>
    </aside>
  );
}

