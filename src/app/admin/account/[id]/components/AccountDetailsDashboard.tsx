'use client';

import {
  Activity,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import type { Account, CustomerDetail } from '@/types/account';
import type { BookingProgress } from '@/types/booking-progress';
import type { FamilyProfile } from '@/types/family-profile';

import { CareProgressCard } from './CareProgressCard';
import { FamilyMembersList } from './FamilyMembersList';
import type { Feedback } from '@/types/feedback';

import styles from './account-details-dashboard.module.css';

interface AccountDetailsDashboardProps {
  familyProfiles: FamilyProfile[];
  account: Account | null;
  customerDetail: CustomerDetail | null;
  bookingProgress: BookingProgress | null;
  feedbacks: Feedback[];
}

// Mock data from the provided JSON
const MOCK_CARE_PROGRESS = {
  bookingId: 16,
  customerName: "Lữ Gia Bảo",
  packageName: "Gói Basic",
  progressPercent: 36,
  totalActivities: 44,
  completedActivities: 16,
  pendingActivities: 7,
  missedActivities: 21,
  activities: [
    {
      familyScheduleId: 42,
      activityName: "Check sức khỏe mẹ buổi sáng",
      workDate: "2026-03-26",
      startTime: "07:00:00",
      endTime: "08:00:00",
      target: "Mom" as const,
      status: "Done" as const,
      staffName: "Nguyễn Thị Hương",
      staffAvatar: "https://res.cloudinary.com/dj4dqbzks/image/upload/v1773717210/family_avatars/Ảnh_chụp_màn_hình_2026-03-17_090807_cl3prb.png",
    },
    {
      familyScheduleId: 43,
      activityName: "Check sức khỏe bé buổi sáng",
      workDate: "2026-03-26",
      startTime: "08:00:00",
      endTime: "09:00:00",
      target: "Baby" as const,
      status: "Missed" as const,
      staffName: "Nhân viên chăm sóc",
      staffAvatar: "https://res.cloudinary.com/dj4dqbzks/image/upload/v1773717210/family_avatars/Ảnh_chụp_màn_hình_2026-03-17_090807_cl3prb.png",
    },
    {
      familyScheduleId: 44,
      activityName: "Bữa sáng dinh dưỡng cho mẹ",
      workDate: "2026-03-26",
      startTime: "09:00:00",
      endTime: "10:00:00",
      target: "Mom" as const,
      status: "Pending" as const,
      staffName: "Nhân viên chăm sóc",
      staffAvatar: "https://res.cloudinary.com/dj4dqbzks/image/upload/v1773717210/family_avatars/Ảnh_chụp_màn_hình_2026-03-17_090807_cl3prb.png",
    },
  ]
};

const TABS = [
  { id: 'profile', label: 'Người giám hộ', icon: User },
  { id: 'progress', label: 'Tiến trình chăm sóc', icon: Activity },
];

export const AccountDetailsDashboard: React.FC<AccountDetailsDashboardProps> = ({
  familyProfiles,
  customerDetail,
  bookingProgress,
  feedbacks = []
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  const parseImages = (imagesStr: any): string[] => {
    if (!imagesStr) return [];
    if (Array.isArray(imagesStr)) return imagesStr;
    try {
      return JSON.parse(imagesStr);
    } catch (e) {
      if (typeof imagesStr === 'string' && imagesStr.startsWith('http')) {
        return [imagesStr];
      }
      return [];
    }
  };

  React.useEffect(() => {
    if (feedbacks.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
    }, 25000); // Near-static: Auto-slide every 25 seconds
    return () => clearInterval(interval);
  }, [feedbacks.length]);

  const currentFeedback = feedbacks[currentFeedbackIndex];

  // Determine active booking data (prioritize bookingProgress API, fallback to customerDetail)
  const displayProgress = bookingProgress || customerDetail?.activeBookings?.[0];
  const currentStatus = displayProgress?.bookingStatus || 'Pending';

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabsNav}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.contentArea}>
        {activeTab === 'profile' && (
          <FamilyMembersList familyProfiles={familyProfiles} />
        )}

        {activeTab === 'progress' && displayProgress && (
          <>
            {/* 1. Service Progress Ribbon Title */}
            <section>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>Tiến độ gói dịch vụ</h2>
              </div>
              <div className={styles.ribbonWrapper}>
                <div className={`${styles.ribbonSegment} ${currentStatus === 'Pending' ? styles.ribbonSegmentActive : styles.ribbonSegmentCompleted}`}>Đang chờ</div>
                <div className={`${styles.ribbonSegment} ${currentStatus === 'Confirmed' ? styles.ribbonSegmentActive : (['Confirmed', 'InProgress', 'Completed'].includes(currentStatus) ? styles.ribbonSegmentCompleted : '')}`}>Đã xác nhận</div>
                <div className={`${styles.ribbonSegment} ${currentStatus === 'InProgress' ? styles.ribbonSegmentActive : (['InProgress', 'Completed'].includes(currentStatus) ? styles.ribbonSegmentCompleted : '')}`}>Đang thực hiện</div>
                <div className={`${styles.ribbonSegment} ${currentStatus === 'Completed' ? styles.ribbonSegmentActive : (currentStatus === 'Completed' ? styles.ribbonSegmentCompleted : '')}`}>Hoàn thành</div>
              </div>
            </section>

            {/* 2. CareProgressCard with its own title if needed, but here it's integrated */}
            <CareProgressCard data={displayProgress as any} />

            {/* 3. Feedback Section */}
            <section style={{ marginTop: '24px' }}>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>Đánh giá từ khách hàng</h2>
              </div>

              <div className={styles.notesList}>
                {feedbacks.length > 0 ? (
                  <div className={styles.carouselContainer}>
                    <div 
                      key={currentFeedbackIndex}
                      className={`${styles.noteCard} ${styles.feedbackAnimation}`}
                    >
                      {/* Header: Avatar + Name/Stars */}
                      <div className={styles.noteHeaderRow}>
                        <div className={styles.noteAvatarWrapper}>
                          <Image
                            src={customerDetail?.avatarUrl || "https://res.cloudinary.com/dj4dqbzks/image/upload/v1774283353/family_avatars/747eeafa-023f-4adb-af4a-5b53fb47de6a3622418385202654628_qflzja.jpg"}
                            alt={currentFeedback.customerName}
                            width={32}
                            height={32}
                            className={styles.noteAvatar}
                            unoptimized
                          />
                        </div>
                        <div className={styles.noteAuthorInfo}>
                          <h4 className={styles.noteAuthor}>{currentFeedback.customerName}</h4>
                          <div className={styles.ratingStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < currentFeedback.rating ? "#fa8314" : "#e9ecef"}
                                strokeWidth={0}
                              />
                            ))}
                          </div>
                          <span className={styles.noteTime}>
                            {new Date(currentFeedback.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      {/* Content Row: Text (Left) + Gallery (Right Bottom) */}
                      <div className={styles.noteMainContent}>
                        <div className={styles.noteTextWrapper}>
                          <h5 
                            style={{ fontSize: '14px', fontWeight: 600, color: '#1a1d23', marginBottom: '8px' }}
                            title={currentFeedback.title}
                          >
                            {currentFeedback.title.length > 60 ? `${currentFeedback.title.slice(0, 60)}...` : currentFeedback.title}
                          </h5>
                          <p className={styles.noteContent} title={currentFeedback.content}>
                            {currentFeedback.content}
                          </p>
                        </div>

                        {parseImages(currentFeedback.images).length > 0 && (
                          <div className={styles.feedbackGallery}>
                            {parseImages(currentFeedback.images).map((src, index) => (
                              <div key={index} className={styles.feedbackImageWrapper}>
                                <Image
                                  src={src}
                                  alt={`Feedback ${index + 1}`}
                                  width={60}
                                  height={60}
                                  className={styles.feedbackImage}
                                  unoptimized
                                  onClick={() => handleImageClick(src)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation Dots */}
                    {feedbacks.length > 1 && (
                      <div className={styles.carouselDots}>
                        {feedbacks.map((_, idx) => (
                          <div 
                            key={idx}
                            className={`${styles.dot} ${idx === currentFeedbackIndex ? styles.dotActive : ''}`}
                            onClick={() => setCurrentFeedbackIndex(idx)}
                            title={`Xem đánh giá ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.emptyPackageState}>
                    <span>Khách hàng chưa có đánh giá nào cho gói dịch vụ này</span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'progress' && !displayProgress && (
          <div className={styles.emptyTabState}>
            <Activity size={48} className={styles.emptyTabIcon} />
            <h3>Chưa có tiến trình chăm sóc</h3>
            <p>Khách hàng này hiện chưa đăng ký gói dịch vụ nào hoặc gói dịch vụ chưa được kích hoạt.</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className={styles.imageModalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalImageContainer} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Full size view"
              width={1000}
              height={1000}
              className={styles.modalLargeImage}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
};
