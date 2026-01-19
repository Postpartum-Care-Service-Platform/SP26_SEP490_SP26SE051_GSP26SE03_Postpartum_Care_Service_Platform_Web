'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import userService from '@/services/user.service';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';
import type { Account } from '@/types/account';
import styles from './account-info-card.module.css';

export function AccountInfoCard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await userService.getCurrentAccount();
        setAccount(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải thông tin tài khoản');
        console.error('Error fetching account:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push(ROUTES.login);
      window.location.href = ROUTES.login;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.card}>
        <h4 className={styles.title}>Thông tin cá nhân</h4>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <h4 className={styles.title}>Thông tin cá nhân</h4>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Thông tin cá nhân</h4>
      <div className={styles.infoItem}>
        <span className={styles.label}>Vai trò:</span>
        <span className={styles.value}>{account.roleName}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Email:</span>
        <span className={styles.value}>{account.email}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Số điện thoại:</span>
        <span className={styles.value}>{account.phone || 'Chưa cập nhật'}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Tên người dùng:</span>
        <span className={styles.value}>{account.username || 'Chưa cập nhật'}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Xác thực email:</span>
        <span className={styles.value}>
          {account.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        </span>
      </div>
      {account.avatarUrl && (
        <div className={styles.infoItem}>
          <span className={styles.label}>Ảnh đại diện:</span>
          <span className={styles.value}>{account.avatarUrl}</span>
        </div>
      )}
      <div className={styles.logoutWrapper}>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  );
}
