'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import bookingProgressService from '@/services/booking-progress.service';
import familyProfileService from '@/services/family-profile.service';
import feedbackService from '@/services/feedback.service';
import userService from '@/services/user.service';

import type { Account, CustomerDetail } from '@/types/account';
import type { BookingProgress } from '@/types/booking-progress';
import type { FamilyProfile } from '@/types/family-profile';
import type { Feedback } from '@/types/feedback';

import { AccountDetailsDashboard } from './components/AccountDetailsDashboard';
import { AccountOverviewHeader } from './components/AccountOverviewHeader';
import { AccountScheduleTab } from './components/AccountScheduleTab';
import { TransactionHistory } from './components/TransactionHistory';
import { UserProfileCard } from './components/UserProfileCard';

import styles from './account-overview.module.css';

interface AccountOverviewData {
  familyProfiles: FamilyProfile[];
  account: Account | null;
  customerDetail: CustomerDetail | null;
  bookingProgress: BookingProgress | null;
  feedbacks: Feedback[];
}

export default function AccountOverviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = React.useState<AccountOverviewData>({
    familyProfiles: [],
    account: null,
    customerDetail: null,
    bookingProgress: null,
    feedbacks: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      Promise.all([
        familyProfileService.getFamilyProfilesByAccountId(id).catch(() => []),
        userService.getAccountById(id).catch(() => null),
        userService.getCustomerDetail(id).catch(() => null),
        bookingProgressService.getBookingProgressByAccountId(id).catch(() => null)
      ])
        .then(([familyProfilesData, accountData, customerDetailData, bookingProgressData]) => {
          const customerId = customerDetailData?.id;

          if (customerId) {
            feedbackService.getFeedbacksByUserId(customerId)
              .then(feedbacks => {
                setData(prev => ({ ...prev, feedbacks: feedbacks || [] }));
              })
              .catch(err => console.error('Error fetching feedbacks:', err));
          }

          setData(prev => ({
            ...prev,
            familyProfiles: familyProfilesData || [],
            account: accountData,
            customerDetail: customerDetailData,
            bookingProgress: bookingProgressData,
          }));
        })
        .catch((err) => {
          setError(err.message || 'Failed to load initial data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWrapper}>
        <AccountOverviewHeader />
      </div>

      <div className={styles.mainScrollArea}>
        <div className={styles.contentRow}>
          <div className={styles.sidebarColumn}>
            <UserProfileCard
              familyProfile={data.familyProfiles.find(p => p.isOwner) || data.familyProfiles[0] || null}
              account={data.account}
              customerDetail={data.customerDetail}
              bookingProgress={data.bookingProgress}
              loading={loading}
            />
          </div>

          <div className={styles.mainColumn}>
            <AccountDetailsDashboard
              familyProfiles={data.familyProfiles}
              account={data.account}
              customerDetail={data.customerDetail}
              bookingProgress={data.bookingProgress}
              feedbacks={data.feedbacks}
            />
          </div>
        </div>

        {/* Section: Transaction History */}
        <div style={{ marginTop: '24px' }}>
          <TransactionHistory customerId={id} />
        </div>

        {/* Section: Appointment & Progress Details */}
        <div id="room-allotment-schedule" style={{ paddingBottom: '8px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172b4d', fontFamily: 'Lexend Deca, sans-serif' }}>
              Lịch hẹn & Tiến trình chăm sóc chi tiết
            </h2>
          </div>
          <AccountScheduleTab accountId={id} />
        </div>

        {error && (
          <div style={{ padding: '16px', color: '#B91C1C', marginTop: '20px', background: '#FEF2F2', borderRadius: '4px', border: '1px solid #FEE2E2', fontSize: '14px' }}>
            <strong>Lưu ý:</strong> {error}.
          </div>
        )}
      </div>
    </div>
  );
}
