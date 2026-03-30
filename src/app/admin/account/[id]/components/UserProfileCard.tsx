'use client';

import {
  Star,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import type { Account, CustomerDetail } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';

import styles from './user-profile-card.module.css';

interface UserProfileCardProps {
  familyProfile: FamilyProfile | null;
  account: Account | null;
  customerDetail: CustomerDetail | null;
  loading?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  familyProfile,
  account,
  customerDetail,
  loading
}) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
      </div>
    );
  }

  // Extract data from profile, account or customer detail
  const name = customerDetail?.fullName || familyProfile?.fullName || account?.username || account?.email || 'Chưa cập nhật';
  const avatarUrl = customerDetail?.avatarUrl || familyProfile?.avatarUrl || account?.avatarUrl;
  const email = customerDetail?.email || account?.email || 'Chưa cập nhật';
  const phone = customerDetail?.phone || familyProfile?.phoneNumber || account?.phone || 'Chưa cập nhật';
  const role = customerDetail?.roleName || account?.roleName || 'Người dùng';
  const initials = name.substring(0, 2).toUpperCase();

  // Package and staff info from detail
  const activeBooking = customerDetail?.activeBookings?.[0];
  const staff = activeBooking?.assignedStaff?.[0];
  const rating = customerDetail?.averageRating ?? 0;
  const feedbacks = customerDetail?.totalFeedbacks ?? 0;

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.profileHeader}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={64} height={64} className={styles.avatar} unoptimized />
        ) : (
          <div className={styles.placeholderAvatar}>{initials}</div>
        )}
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{name}</h3>
          </div>
          <span className={styles.subtitle}>{role}</span>
          <div className={styles.rating}>
            <Star size={14} className={styles.starIcon} fill="currentColor" />
            <span>{rating.toFixed(1)} • <span className={styles.reviewCount}>{feedbacks} đánh giá</span></span>
          </div>
        </div>
      </div>

      {/* Package Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Gói dịch vụ đang dùng</span>
          {activeBooking && (
            <span className={styles.countdown}>Còn {activeBooking.remainingDays} ngày</span>
          )}
        </div>
        {activeBooking ? (
          <>
            <h4 className={styles.jobTitle}>{activeBooking.packageName}</h4>
            <div className={styles.packageMeta}>
              <span className={styles.tag}>{activeBooking.packageTypeName}</span>
              <span className={styles.tag}>{activeBooking.roomName} ({activeBooking.roomTypeName})</span>
            </div>
            <div className={styles.bookingDetails}>
              <div className={styles.bookingDetailItem}>
                <span className={styles.detailLabel}>Trạng thái đặt lịch:</span>
                <span className={`${styles.detailValue} ${styles.statusTag}`}>
                  {activeBooking.bookingStatus === 'Confirmed' ? 'Đã xác nhận' : activeBooking.bookingStatus}
                </span>
              </div>
              <div className={styles.bookingDetailItem}>
                <span className={styles.detailLabel}>Thời gian:</span>
                <span className={styles.detailValue}>
                  {new Date(activeBooking.startDate).toLocaleDateString('vi-VN')} - {new Date(activeBooking.endDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyPackageState}>
            <ExternalLink size={16} className={styles.emptyIcon} />
            <span>Chưa có gói dịch vụ nào đang hoạt động</span>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Nhân viên phụ trách</span>
        {staff ? (
          <div className={styles.assignedStaff}>
            {staff.avatarUrl ? (
              <Image src={staff.avatarUrl} alt={staff.fullName} width={32} height={32} className={styles.staffAvatar} unoptimized />
            ) : (
              <div className={styles.staffAvatarPlaceholder}>
                <UserIcon size={14} />
              </div>
            )}
            <div className={styles.staffInfo}>
              <h5 className={styles.staffName}>{staff.fullName}</h5>
              <p className={styles.staffRole}>{staff.email}</p>
            </div>
          </div>
        ) : (
          <div className={styles.emptyStaffState}>
            <UserIcon size={14} className={styles.emptyIcon} />
            <span>Chưa có nhân viên phụ trách</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.chatButton} title="Nhắn tin" style={{ width: '100%' }}>
          <MessageSquare size={18} color="#6d28d9" style={{ marginRight: '8px' }} />
          Nhắn tin trao đổi
        </button>
      </div>

      {/* Contact information section */}
      <div className={styles.contactContainer}>
        <h3 className={styles.contactLabel}>Thông tin liên hệ</h3>

        <div className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <UserIcon size={16} />
          </div>
          <div className={styles.contactInfo}>
            <span className={styles.infoLabel}>Giới tính</span>
            <span className={styles.infoValue}>
              {customerDetail?.gender === 'Male' ? 'Nam' :
                customerDetail?.gender === 'Female' ? 'Nữ' :
                  customerDetail?.gender || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        <div className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <Mail size={16} />
          </div>
          <div className={styles.contactInfo}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{email}</span>
          </div>
        </div>

        <div className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <Phone size={16} />
          </div>
          <div className={styles.contactInfo}>
            <span className={styles.infoLabel}>Số điện thoại</span>
            <span className={styles.infoValue}>{phone}</span>
          </div>
        </div>

        <div className={styles.contactItem}>
          <div className={styles.iconWrapper}>
            <MapPin size={16} />
          </div>
          <div className={styles.contactInfo}>
            <span className={styles.infoLabel}>Địa Chỉ</span>
            <span className={styles.infoValue}>{customerDetail?.address || 'Chưa cập nhật'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
