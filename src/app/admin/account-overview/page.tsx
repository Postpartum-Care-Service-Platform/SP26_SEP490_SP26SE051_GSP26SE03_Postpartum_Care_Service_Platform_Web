'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import familyProfileService from '@/services/family-profile.service';
import userService from '@/services/user.service';

import styles from './account-overview.module.css';
import { AccountOverviewContent } from './components/AccountOverviewContent';
import { AccountOverviewHeader } from './components/AccountOverviewHeader';
import { BookingCard } from './components/BookingCard';
import { MedicalHistoryTable } from './components/MedicalHistoryTable';
import { PrescriptionsTable } from './components/PrescriptionsTable';
import type { FamilyProfile } from '@/types/family-profile';
import type { Account } from '@/types/account';

interface AccountOverviewData {
  familyProfile: FamilyProfile | null;
  account: Account | null;
}

export default function AccountOverviewPage() {
  const searchParams = useSearchParams();
  const customId = searchParams.get('customId');
  
  const [data, setData] = React.useState<AccountOverviewData>({
    familyProfile: null,
    account: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('customId:', customId);
    if (customId) {
      setLoading(true);
      setError(null);
      
      // Fetch both family profile and account info
      Promise.all([
        familyProfileService.getFamilyProfileByCustomerId(customId),
        userService.getAccountById(customId).catch(() => null)
      ])
        .then(([familyProfileData, accountData]) => {
          console.log('Family Profile API response:', familyProfileData);
          console.log('Account API response:', accountData);
          
          // Handle array response for family profile
          let familyProfile: FamilyProfile | null = null;
          if (Array.isArray(familyProfileData) && familyProfileData.length > 0) {
            familyProfile = familyProfileData[0];
          } else if (familyProfileData) {
            familyProfile = familyProfileData;
          }
          
          setData({
            familyProfile,
            account: accountData,
          });
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setError(err.message || 'Failed to load data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [customId]);

  return (
    <div className={styles.pageContainer}>
      <AccountOverviewHeader />
      <div className={styles.contentRow}>
        <div className={styles.leftColumn}>
          <AccountOverviewContent 
            familyProfile={data.familyProfile} 
            account={data.account}
            loading={loading} 
          />
        </div>
      </div>
      <BookingCard />
      <div className={styles.bottomRow}>
        <div className={styles.bottomLeftColumn}>
          <MedicalHistoryTable customerId={customId} />
        </div>
        <div className={styles.bottomRightColumn}>
          <PrescriptionsTable customerId={customId} />
        </div>
      </div>
    </div>
  );
}
