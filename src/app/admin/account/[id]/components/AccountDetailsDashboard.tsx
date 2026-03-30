'use client';

import { 
  Plus, 
  ChevronDown, 
  User, 
  Activity, 
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import type { Account, CustomerDetail } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';

import { FamilyMembersList } from './FamilyMembersList';

import styles from './account-details-dashboard.module.css';

interface AccountDetailsDashboardProps {
  familyProfiles: FamilyProfile[];
  account: Account | null;
  customerDetail: CustomerDetail | null;
}

export const AccountDetailsDashboard: React.FC<AccountDetailsDashboardProps> = ({ 
  familyProfiles, 
  account: _account,
  customerDetail: _customerDetail
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  const activeBooking = null; // Forced null as requested to show empty state
  
  const tabs = [
    { id: 'profile', label: 'Người giám hộ', icon: User },
    { id: 'progress', label: 'Tiến trình chăm sóc', icon: Activity },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabsNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.contentArea} style={{ display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'profile' && (
          <FamilyMembersList familyProfiles={familyProfiles} />
        )}

        {activeTab === 'progress' && activeBooking && (
          <>
            <section>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>Giai đoạn dịch vụ hiện tại</h2>
                <button className={styles.ratingButton}>
                  <ChevronDown size={14} /> 
                  <span>Đánh giá dịch vụ</span>
                </button>
              </div>

              <div className={styles.ribbonWrapper}>
                <div className={`${styles.ribbonSegment} ${styles.ribbonSegmentCompleted}`}>Đăng ký</div>
                <div className={`${styles.ribbonSegment} ${styles.ribbonSegmentCompleted}`}>Khám tổng quát</div>
                <div className={`${styles.ribbonSegment} ${styles.ribbonSegmentActive}`}>Đang chăm sóc</div>
                <div className={styles.ribbonSegment}>Hoàn tất / Đã đóng</div>
              </div>

              <div className={styles.stageInfoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ngày bắt đầu</span>
                  <span className={styles.infoValue}>10 - 13/07/2026</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Trạng thái phục hồi</span>
                  <div className={styles.statusChip}>Đang tiến triển</div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phòng thực hiện</span>
                  <span className={styles.infoValue}>Tòa Silver, Phòng Nomad, Tầng 3</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nhân viên phụ trách</span>
                  <div className={styles.assignedContainer}>
                    <Image src="/avatar-1.jpg" alt="Assignee" width={24} height={24} className={styles.assigneeAvatar} unoptimized />
                    <Image src="/avatar-2.jpg" alt="Assignee" width={24} height={24} className={styles.assigneeAvatar} unoptimized />
                    <Image src="/avatar-3.jpg" alt="Assignee" width={24} height={24} className={styles.assigneeAvatar} unoptimized />
                  </div>
                </div>
              </div>

              <button className={styles.nextStepButton} disabled>
                Tiếp tục bước tiếp theo
              </button>
            </section>

            <section style={{ marginTop: '32px' }}>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>Ghi chú & Theo dõi</h2>
                <button className={`${styles.ratingButton} border-none text-blue-500`} style={{ border: 'none', color: '#3b82f6', gap: '4px' }}>
                  <Plus size={14} /> 
                  <span>Thêm ghi chú</span>
                </button>
              </div>

              <div className={styles.notesList}>
                <div className={styles.noteItem}>
                  <Image src="/avatar-staff.jpg" alt="Maria Kelly" width={32} height={32} className={styles.noteAvatar} unoptimized />
                  <div className={styles.noteBody}>
                    <div className={styles.noteHeader}>
                      <h5 className={styles.noteAuthor}>Bác sĩ Maria Kelly</h5>
                      <span className={styles.noteTime}>10/07/2026 • 11:30 AM</span>
                    </div>
                    <p className={styles.noteText}>
                      Vui lòng kiểm tra lại chế độ dinh dưỡng hàng ngày của mẹ. Chỉ số phục hồi đang rất tốt nhưng cần bổ sung thêm sắt. 
                      Cần lên lịch khám mắt cho bé vào tuần tới.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'progress' && !activeBooking && (
          <div className={styles.emptyTabState}>
            <Activity size={48} className={styles.emptyTabIcon} />
            <h3>Chưa có tiến trình chăm sóc</h3>
            <p>Khách hàng này hiện chưa đăng ký gói dịch vụ nào hoặc gói dịch vụ chưa được kích hoạt.</p>
          </div>
        )}
      </div>
    </div>

  );
};
