'use client';

import { AccountOverviewHeader } from './components/AccountOverviewHeader';
import { AccountOverviewContent } from './components/AccountOverviewContent';
import { BookingCard } from './components/BookingCard';
import { HealthMetricsCards } from './components/HealthMetricsCards';
import { HealthMetricsTimeline } from './components/HealthMetricsTimeline';
import { MedicalHistoryTable } from './components/MedicalHistoryTable';
import { PrescriptionsTable } from './components/PrescriptionsTable';
import styles from './account-overview.module.css';

export default function AccountOverviewPage() {
  return (
    <div className={styles.pageContainer}>
      <AccountOverviewHeader />
      <div className={styles.contentRow}>
        <div className={styles.leftColumn}>
          <AccountOverviewContent />
        </div>
        <div className={styles.rightColumn}>
          <HealthMetricsCards />
          <HealthMetricsTimeline />
        </div>
      </div>
      <BookingCard />
      <div className={styles.bottomRow}>
        <div className={styles.bottomLeftColumn}>
          <MedicalHistoryTable />
        </div>
        <div className={styles.bottomRightColumn}>
          <PrescriptionsTable />
        </div>
      </div>
    </div>
  );
}
