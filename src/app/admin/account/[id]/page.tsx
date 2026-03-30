'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import familyProfileService from '@/services/family-profile.service';
import userService from '@/services/user.service';

import styles from './account-overview.module.css';
import { AccountDetailsDashboard } from './components/AccountDetailsDashboard';
import { AccountOverviewHeader } from './components/AccountOverviewHeader';
import { UserProfileCard } from './components/UserProfileCard';
import { TransactionHistory } from './components/TransactionHistory';
import { AccountScheduleTab } from './components/AccountScheduleTab';

import type { FamilyProfile } from '@/types/family-profile';
import type { Account, CustomerDetail } from '@/types/account';

interface AccountOverviewData {
  familyProfiles: FamilyProfile[];
  account: Account | null;
  customerDetail: CustomerDetail | null;
}

export default function AccountOverviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = React.useState<AccountOverviewData>({
    familyProfiles: [],
    account: null,
    customerDetail: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('id from params:', id);
    if (id) {
      setLoading(true);
      setError(null);

      // Fetch family profiles, account info, and customer summary detail
      Promise.all([
        familyProfileService.getFamilyProfilesByAccountId(id).catch(() => []),
        userService.getAccountById(id).catch(() => null),
        userService.getCustomerDetail(id).catch(() => null)
      ])
        .then(([familyProfilesData, accountData, customerDetailData]) => {
          console.log('Customer Detail API response:', customerDetailData);
          console.log('Family Profiles API response:', familyProfilesData);
          console.log('Account API response:', accountData);

          setData({
            familyProfiles: familyProfilesData || [],
            account: accountData,
            customerDetail: customerDetailData,
          });
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          // Set error only for critical failures, but don't crash the whole UI
          setError(err.message || 'Failed to load initial data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className={styles.pageContainer}>
      <AccountOverviewHeader />

      <div className={styles.contentRow}>
        {/* Profile Sidebar Card */}
        <UserProfileCard
          familyProfile={data.familyProfiles.find(p => p.isOwner) || data.familyProfiles[0] || null}
          account={data.account}
          customerDetail={data.customerDetail}
          loading={loading}
        />

        <div className={styles.leftColumn} style={{ flex: 2.5 }}>
          <AccountDetailsDashboard
            familyProfiles={data.familyProfiles}
            account={data.account}
            customerDetail={data.customerDetail}
          />
        </div>
      </div>

      {/* Section 1: Billing History (Hóa đơn) */}
      <div style={{ paddingBottom: '32px' }}>
        <TransactionHistory customerId={id} />
      </div>

      {/* Section 2: Appointment Schedule (Lịch hẹn) */}
      <div style={{ paddingBottom: '32px' }}>
        <div style={{ padding: '0 24px 16px', borderBottom: '1px solid #dfe1e6', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#172b4d' }}>Lịch hẹn & Tiến trình chăm sóc</h2>
        </div>
        <AccountScheduleTab accountId={id} />
      </div>

      {error && (
        <div style={{ padding: '16px', color: '#B91C1C', marginTop: '20px', background: '#FEF2F2', borderRadius: '4px', border: '1px solid #FEE2E2', fontSize: '14px' }}>
          <strong>Lưu ý:</strong> {error}. Hệ thống đang hiển thị dữ liệu mẫu để bạn vẫn có thể xem được giao diện.
        </div>
      )}
    </div>
  );
}
