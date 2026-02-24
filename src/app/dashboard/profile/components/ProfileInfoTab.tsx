'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/user.service';
import authService from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import type { Account } from '@/types/account';
import styles from './profile-info-tab.module.css';

export function ProfileInfoTab() {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      // Kiểm tra token trước khi gọi API
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem thông tin');
          return;
        }
      }
      
      setLoading(true);
      const data = await userService.getCurrentAccount();
      setAccount(data);
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setUsername(data.username || '');
    } catch (err: any) {
      // Không hiển thị error nếu là 401 (đã được xử lý ở apiClient)
      if (err?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(err.message || 'Không thể tải thông tin tài khoản');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Note: Backend không có API update account cho customer
    // Chỉ có thể cập nhật qua Family Profile
    setSuccess('Thông tin tài khoản chỉ có thể cập nhật qua hồ sơ gia đình');
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  // Lấy avatar từ account hoặc ownerProfile
  const avatarUrl = account?.avatarUrl || account?.ownerProfile?.avatarUrl || null;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin tài khoản</h3>
          
          {avatarUrl && (
            <div className={styles.avatarSection}>
              <Image 
                src={avatarUrl} 
                alt="Avatar" 
                width={120} 
                height={120} 
                className={styles.avatarImage}
                unoptimized={avatarUrl.startsWith('http')}
              />
            </div>
          )}
          
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              variant="profile"
              className={styles.input}
            />
            <p className={styles.helpText}>Email không thể thay đổi</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Tên đăng nhập
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
              variant="profile"
              className={styles.input}
            />
            <p className={styles.helpText}>Tên đăng nhập không thể thay đổi</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="phone" className={styles.label}>
              Số điện thoại
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled
              variant="profile"
              className={styles.input}
            />
            <p className={styles.helpText}>Số điện thoại không thể thay đổi tại đây</p>
          </div>

          {account && (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Trạng thái:</span>
                <span className={account.isActive ? styles.statusActive : styles.statusInactive}>
                  {account.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Xác thực email:</span>
                <span className={account.isEmailVerified ? styles.statusActive : styles.statusInactive}>
                  {account.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Vai trò:</span>
                <span className={styles.infoValue}>{account.roleName || 'Customer'}</span>
              </div>
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={loadAccount}>
            Làm mới
          </Button>
        </div>
      </form>
    </div>
  );
}
