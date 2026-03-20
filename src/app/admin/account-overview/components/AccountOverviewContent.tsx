'use client';

import Image from 'next/image';

import type { FamilyProfile } from '@/types/family-profile';
import type { Account } from '@/types/account';

import styles from './account-overview-content.module.css';

interface AccountOverviewContentProps {
  familyProfile: FamilyProfile | null;
  account: Account | null;
  loading: boolean;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function AccountOverviewContent({ familyProfile, account, loading }: AccountOverviewContentProps) {
  console.log('AccountOverviewContent - familyProfile:', familyProfile);
  console.log('AccountOverviewContent - account:', account);
  console.log('AccountOverviewContent - loading:', loading);
  
  // Reference to data
  const profileData = familyProfile;
  const accountData = account;
  
  // Get fields from API
  const avatarUrl = profileData?.avatarUrl || accountData?.avatarUrl || accountData?.ownerProfile?.avatarUrl || '/download.png';
  const fullName = profileData?.fullName || accountData?.ownerProfile?.fullName || accountData?.username || 'N/A';
  const phoneNumber = profileData?.phoneNumber || accountData?.phone || accountData?.ownerProfile?.phoneNumber || '-';
  const gender = profileData?.gender || accountData?.ownerProfile?.gender || '-';
  const dateOfBirth = profileData?.dateOfBirth || accountData?.ownerProfile?.dateOfBirth;
  const address = profileData?.address || accountData?.ownerProfile?.address || '-';
  const createdAt = profileData?.createdAt || accountData?.createdAt || accountData?.ownerProfile?.createdAt;
  const email = accountData?.email || '-';
  const isActive = profileData?.isDeleted !== true && accountData?.isActive !== false;
  const memberTypeName = profileData?.memberTypeName || accountData?.ownerProfile?.memberTypeName || '-';
  
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  if (!familyProfile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Không có dữ liệu</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={120}
                height={120}
                className={styles.avatarImage}
                unoptimized
              />
            </div>
          </div>
          <h6 className={styles.name}>{fullName}</h6>
          <p className={styles.email}>{phoneNumber}</p>
          <button type="button" className={styles.sendMessageButton}>
            Gửi tin nhắn
          </button>
        </div>
      </div>
      <div className={styles.rightSection}>
        {/* Row 1 */}
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Giới tính</p>
          <p className={styles.detailValue}>{gender}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Ngày sinh</p>
          <p className={styles.detailValue}>{formatDate(dateOfBirth ?? null)}</p>
        </div>
        {/* Row 2 */}
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Số điện thoại</p>
          <p className={styles.detailValue}>{phoneNumber}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Email</p>
          <p className={styles.detailValue}>{email}</p>
        </div>
        {/* Row 3 */}
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Địa chỉ</p>
          <p className={styles.detailValue}>{address}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Loại thành viên</p>
          <p className={styles.detailValue}>{memberTypeName}</p>
        </div>
        {/* Row 4 */}
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Ngày đăng ký</p>
          <p className={styles.detailValue}>{formatDate(createdAt ?? null)}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Trạng thái</p>
          <p className={styles.detailValue}>{isActive ? 'Hoạt động' : 'Ngừng hoạt động'}</p>
        </div>
      </div>
    </div>
  );
}
