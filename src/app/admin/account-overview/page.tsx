'use client';

import { AccountOverviewHeader } from './components/AccountOverviewHeader';
import { AccountOverviewContent } from './components/AccountOverviewContent';
import styles from './account-overview.module.css';

export default function AccountOverviewPage() {
  return (
    <div className={styles.pageContainer}>
      <AccountOverviewHeader />
      <AccountOverviewContent />
    </div>
  );
}
