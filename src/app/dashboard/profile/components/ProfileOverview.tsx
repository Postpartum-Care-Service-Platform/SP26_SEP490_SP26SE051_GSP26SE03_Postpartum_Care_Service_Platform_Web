'use client';

import { useState, useEffect } from 'react';
import { Calendar, CreditCard, Bell, Package } from 'lucide-react';
import bookingService from '@/services/booking.service';
import transactionService from '@/services/transaction.service';
import notificationService from '@/services/notification.service';
import type { Booking } from '@/types/booking';
import type { Transaction } from '@/types/transaction';
import type { Notification } from '@/types/notification';
import styles from './profile-overview.module.css';

export function ProfileOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Kiểm tra token trước khi gọi API
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem dữ liệu');
          setLoading(false);
          return;
        }
      }
      
      setLoading(true);
      const [bookingsData, transactionsData, notificationsData] = await Promise.all([
        bookingService.getMyBookings().catch(() => []),
        transactionService.getMyTransactions().catch(() => []),
        notificationService.getMyNotifications().catch(() => []),
      ]);
      setBookings(bookingsData);
      setTransactions(transactionsData);
      setNotifications(notificationsData.slice(0, 5)); // Chỉ hiển thị 5 thông báo gần nhất
    } catch (err: any) {
      // Không hiển thị error nếu là 401 (đã được xử lý ở apiClient)
      if (err?.status !== 401) {
        setError(err.message || 'Không thể tải dữ liệu');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{bookings.length}</div>
            <div className={styles.statLabel}>Đặt phòng</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{transactions.length}</div>
            <div className={styles.statLabel}>Giao dịch</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Bell size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {notifications.filter((n) => n.status === 'Unread').length}
            </div>
            <div className={styles.statLabel}>Thông báo mới</div>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Package size={20} />
            Đặt phòng gần đây
          </h3>
          {bookings.length === 0 ? (
            <p className={styles.empty}>Chưa có đặt phòng nào</p>
          ) : (
            <div className={styles.list}>
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{booking.packageName || `Đặt phòng #${booking.id}`}</div>
                    <div className={styles.itemMeta}>
                      <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                      <span className={styles.status}>{booking.status}</span>
                    </div>
                  </div>
                  <div className={styles.itemAmount}>{formatCurrency(booking.totalPrice)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <CreditCard size={20} />
            Giao dịch gần đây
          </h3>
          {transactions.length === 0 ? (
            <p className={styles.empty}>Chưa có giao dịch nào</p>
          ) : (
            <div className={styles.list}>
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{transaction.description || transaction.type}</div>
                    <div className={styles.itemMeta}>
                      <span>{formatDate(transaction.createdAt)}</span>
                      <span className={styles.status}>{transaction.status}</span>
                    </div>
                  </div>
                  <div className={styles.itemAmount}>{formatCurrency(transaction.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Bell size={20} />
            Thông báo mới nhất
          </h3>
          {notifications.length === 0 ? (
            <p className={styles.empty}>Không có thông báo nào</p>
          ) : (
            <div className={styles.list}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.item} ${notification.status === 'Unread' ? styles.unread : ''}`}
                >
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{notification.title}</div>
                    <div className={styles.itemMeta}>
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                    {notification.content && (
                      <div className={styles.itemDescription}>{notification.content}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
