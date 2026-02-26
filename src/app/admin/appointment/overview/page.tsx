'use client';

import { AppointmentOverviewHeader } from '../components/AppointmentOverviewHeader';

import styles from './appointment-overview-page.module.css';
import { OverviewStatsCards } from './components/OverviewStatsCards';
import { PatientFlowChart } from './components/PatientFlowChart';

export default function AppointmentOverviewPage() {
  return (
    <div className={styles.pageContainer}>
      <AppointmentOverviewHeader />
      <div className={styles.contentRow}>
        <div className={styles.statsSection}>
          <OverviewStatsCards />
        </div>
        <div className={styles.chartSection}>
          <PatientFlowChart />
        </div>
      </div>
    </div>
  );
}

