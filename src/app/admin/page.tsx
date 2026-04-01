'use client';

import { useState, useEffect } from 'react';

import styles from './admin-dashboard.module.css';
import { AdminCalendar } from './components/AdminCalendar';
import { AppointmentCarousel } from './components/AppointmentCarousel';
import { AppointmentsList } from './components/AppointmentsList';
import { AveragePatientVisit } from './components/AveragePatientVisit';
import { CalendarHeader } from './components/CalendarHeader';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStatsCards } from './components/DashboardStatsCards';
import { GenderStatsCard } from './components/GenderStatsCard';
import { InvoiceList } from './components/InvoiceList';
import { PatientByAge } from './components/PatientByAge';
import { PatientVisitByGender } from './components/PatientVisitByGender';
import { RevenueChart } from './components/RevenueChart';
import { CategoryRevenueChart } from './components/CategoryRevenueChart';
import { ServicePopularityChart } from './components/ServicePopularityChart';
import { CashflowChart } from './components/CashflowChart';
import { TeamProductivity } from './components/TeamProductivity';
import { TopDoctors } from './components/TopDoctors';

import statisticsService from '@/services/statistics.service';

import { Transaction } from '@/types/transaction';
import transactionService from '@/services/transaction.service';

type DashboardStats = {
  activePatients: number;
  outstandingBalance: number;
  newPatients: number;
  appointments: number;
  bedOccupancy: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activePatients: 0,
    outstandingBalance: 0,
    newPatients: 0,
    appointments: 0,
    bedOccupancy: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          activePatientsRes, 
          weeklyAppointmentsRes, 
          outstandingRes, 
          newPatientsRes,
          transactionsRes
        ] = await Promise.all([
          statisticsService.getActivePatients(),
          statisticsService.getWeeklyAppointments(),
          statisticsService.getOutstandingBalance(),
          statisticsService.getNewPatients(),
          transactionService.getAllTransactions()
        ]);

        setStats({
          activePatients: activePatientsRes?.count ?? 0,
          appointments: weeklyAppointmentsRes?.count ?? 0,
          outstandingBalance: outstandingRes?.totalAmount ?? 0,
          newPatients: newPatientsRes?.count ?? 0,
          bedOccupancy: 78,
        });

        // Set top 10 latest transactions for dashboard
        if (Array.isArray(transactionsRes)) {
          setTransactions(transactionsRes.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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

      <div className={styles.chartSection}>
        <div className={styles.revenueChartWrapper}>
          <RevenueChart />
        </div>
        <div className={styles.categoryChartWrapper}>
          <CategoryRevenueChart />
        </div>
      </div>

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
          <div className={styles.averagePatientVisitWrapper}>
            <AveragePatientVisit />
          </div>
        </div>

        <div className={styles.middleRow}>
          <div className={styles.popularityWrapperSide}>
            <ServicePopularityChart />
          </div>
          <div className={styles.cashflowWrapper}>
            <CashflowChart />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.patientVisitByGenderWrapper}>
            <PatientVisitByGender />
          </div>
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
            <div className={styles.teamProductivityWrapper}>
              <TeamProductivity />
            </div>
          </div>
        </div>
        <div className={styles.invoiceRow}>
          <InvoiceList transactions={transactions} />
        </div>
        <div className={styles.appointmentsRow}>
          <AppointmentsList />
          <PatientByAge />
        </div>
      </div>
    </div>
  );
}
