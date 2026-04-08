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

import type { BookingProgress } from '@/types/booking-progress';
import type { Account, CustomerDetail } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';

import styles from './user-profile-card.module.css';

interface UserProfileCardProps {
  familyProfile: FamilyProfile | null;
  account: Account | null;
  customerDetail: CustomerDetail | null;
  bookingProgress?: BookingProgress | null;
  loading?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  familyProfile,
  account,
  customerDetail,
  bookingProgress,
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
  // Use bookingProgress from API if available, fallback to customerDetail.activeBookings[0]
  const activeBooking = (bookingProgress || customerDetail?.activeBookings?.[0]) as any;
  // BookingProgress might not have assignedStaff, so fallback to customerDetail source
  const allStaff = (activeBooking?.assignedStaff || customerDetail?.activeBookings?.[0]?.assignedStaff || []) as any[];
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
            <span className={styles.countdownBadge}>
              Còn {activeBooking.remainingDays ?? Math.ceil((new Date(activeBooking.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày
            </span>
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
                <span className={`${styles.statusValue} ${activeBooking.bookingStatus === 'InProgress' ? styles.statusInProgress : ''}`}>
                  {activeBooking.bookingStatus === 'InProgress' ? 'Đang thực hiện' :
                    activeBooking.bookingStatus === 'Confirmed' ? 'Đã xác nhận' : activeBooking.bookingStatus}
                </span>
              </div>
              <div className={styles.bookingDetailItem}>
                <span className={styles.detailLabel}>Thời gian:</span>
                <span className={styles.detailValue}>
                  {new Date(activeBooking.startDate).toLocaleDateString('vi-VN')} - {new Date(activeBooking.endDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className={styles.timelineRow}>
                <div className={styles.timelineTrack}>
                  <div
                    className={styles.timelineProgress}
                    style={{ width: `${activeBooking.progressPercent}%` }}
                  />
                </div>
                <div className={styles.timelineStats}>
                  <span className={styles.percentText}>
                    {activeBooking.progressPercent}% ({activeBooking.completedActivities}/{activeBooking.totalActivities} hoạt động)
                  </span>
                  <span className={styles.remainingText}>Còn {activeBooking.remainingDays ?? Math.ceil((new Date(activeBooking.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày</span>
                </div>
              </div>
            </div>

            <div className={styles.financialSummary}>
              <div className={styles.finBadge}>
                <span className={styles.finLabel}>Tổng tiền</span>
                <span className={styles.finValue}>{(activeBooking?.totalPrice || 12500000).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className={styles.finBadge} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <span className={styles.finLabel}>Đã trả</span>
                <span className={styles.finValue}>{(activeBooking?.paidAmount || 12500000).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className={styles.finBadge} style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                <span className={styles.finLabel}>Còn lại</span>
                <span className={styles.finValue}>{(activeBooking?.remainingAmount || 0).toLocaleString('vi-VN')}đ</span>
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
        <span className={styles.sectionTitle}>Nhân viên phụ trách & Pháp lý</span>
        <div className={styles.staffListContainer}>
          {allStaff.length > 0 ? (
            allStaff.slice(0, 2).map((staff, idx) => (
              <div key={staff.id || idx} className={styles.assignedStaff}>
                {staff.avatarUrl ? (
                  <Image src={staff.avatarUrl} alt={staff.fullName} width={36} height={36} className={styles.staffAvatar} unoptimized />
                ) : (
                  <div className={styles.staffAvatarPlaceholder}>
                    <UserIcon size={16} />
                  </div>
                )}
                <div className={styles.staffInfo}>
                  <h5 className={styles.staffName}>{staff.fullName}</h5>
                  <div className={styles.staffContact}>
                    <span className={styles.staffEmail}>{staff?.email}</span>
                    <span className={styles.staffPhone}>{staff?.phone}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyStaffState}>
              <UserIcon size={14} className={styles.emptyIcon} />
              <span>Chưa có nhân viên phụ trách</span>
            </div>
          )}
        </div>
        
        <button className={styles.contractButton}>
          <ExternalLink size={14} style={{ marginRight: '8px' }} />
          Xem hợp đồng pháp lý
        </button>
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
