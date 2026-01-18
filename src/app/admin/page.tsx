'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStatsCards } from './components/DashboardStatsCards';
import { PatientStatusChart } from './components/PatientStatusChart';
import { CalendarHeader } from './components/CalendarHeader';
import { AdminCalendar } from './components/AdminCalendar';
import { AppointmentCarousel } from './components/AppointmentCarousel';
import { TopDoctors } from './components/TopDoctors';
import { AveragePatientVisit } from './components/AveragePatientVisit';
import { PatientVisitByGender } from './components/PatientVisitByGender';
import { GenderStatsCard } from './components/GenderStatsCard';
import styles from './admin-dashboard.module.css';

type DashboardStats = {
  activePatients: number;
  outstandingBalance: number;
  newPatients: number;
  appointments: number;
  bedOccupancy: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activePatients: 1250,
    outstandingBalance: 34250000,
    newPatients: 1250,
    appointments: 3420,
    bedOccupancy: 78,
  });
  const [loading, setLoading] = useState(false);

  // TODO: Fetch real data from API
  useEffect(() => {
    // Example: Fetch stats from API
    // const fetchStats = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await dashboardService.getStats();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Failed to load dashboard stats', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <DashboardHeader />
        <div className={styles.loading}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <DashboardHeader />
      <DashboardStatsCards stats={stats} />
      <div className={styles.bottomSection}>
        <div className={styles.topRow}>
          <div className={styles.leftColumn}>
            <div className={styles.calendarSection}>
              <CalendarHeader />
              <AdminCalendar
                events={[]}
                onDateSelect={(date) => {
                  console.log('Date selected:', date);
                }}
                onRangeSelect={(range) => {
                  console.log('Range selected:', range);
                }}
              />
              <AppointmentCarousel />
            </div>
          </div>
          <div className={styles.middleColumn}>
            <TopDoctors />
          </div>
          <AveragePatientVisit />
        </div>
        <div className={styles.bottomRow}>
          <PatientVisitByGender />
          <div className={styles.rightColumn}>
            <div className={styles.genderStatsRow}>
              <GenderStatsCard
                title="Total Male"
                value="51.34%"
                trend="3.5%"
                trendColor="#f5d178"
                chartColor="#f5d178"
              />
              <GenderStatsCard
                title="Total Female"
                value="31.54%"
                trend="2.5%"
                trendColor="#a47bc8"
                chartColor="#a47bc8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
