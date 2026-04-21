'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import styles from './admin-dashboard.module.css';
import { AdminCalendar } from './components/AdminCalendar';
import { AppointmentCarousel } from './components/AppointmentCarousel';
import { AppointmentAnalytics } from './components/AppointmentAnalytics';
import { AveragePatientVisit } from './components/AveragePatientVisit';
import { CalendarHeader } from './components/CalendarHeader';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStatsCards } from './components/DashboardStatsCards';
import { PerformanceBulletCharts } from './components/PerformanceBulletCharts';
import { GenderStatsCard } from './components/GenderStatsCard';
import { InvoiceList } from './components/InvoiceList';
import { PatientVisitByGender } from './components/PatientVisitByGender';
import { RevenueChart } from './components/RevenueChart';
import { CategoryRevenueChart } from './components/CategoryRevenueChart';
import { ServicePopularityChart } from './components/ServicePopularityChart';
import { CashflowChart } from './components/CashflowChart';
import { ContractStatusChart } from './components/ContractStatusChart';
import { TeamProductivity } from './components/TeamProductivity';
import { TopDoctors } from './components/TopDoctors';
import { AppointmentHeatmap } from './components/AppointmentHeatmap';

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
  const [activityComp, setActivityComp] = useState<any>(null);
  const [rateHistory, setRateHistory] = useState<{ completion: { value: number }[], missed: { value: number }[] }>({
    completion: [],
    missed: []
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          activePatientsRes, 
          weeklyAppointmentsRes, 
          outstandingRes, 
          newPatientsRes,
          transactionsRes,
          activityCompRes
        ] = await Promise.all([
          statisticsService.getActiveCustomers(),
          statisticsService.getWeeklyAppointments(),
          statisticsService.getOutstandingBalance(),
          statisticsService.getNewCustomers(),
          transactionService.getAllTransactions(),
          statisticsService.getActivityCompletionRate()
        ]);

        setStats({
          activePatients: activePatientsRes?.count ?? 0,
          appointments: weeklyAppointmentsRes?.count ?? 0,
          outstandingBalance: outstandingRes?.totalAmount ?? 0,
          newPatients: newPatientsRes?.count ?? 0,
          bedOccupancy: 78,
        });

        setActivityComp(activityCompRes);

        // Fetch historical rates for small charts (last 8 months)
        const now = new Date();
        const months = Array.from({ length: 8 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
          return {
            label: format(d, 'MM/yyyy'),
            start: format(d, 'yyyy-MM-01'),
            end: format(new Date(d.getFullYear(), d.getMonth() + 1, 0), 'yyyy-MM-dd')
          };
        });

        const historicalRes = await Promise.all(
          months.map(m => statisticsService.getActivityCompletionRate({ startDate: m.start, endDate: m.end }))
        );

        const completionTrend = historicalRes.map(res => ({ value: res?.completionRate ?? 0 }));
        const missedTrend = historicalRes.map(res => ({ value: res?.missedRate ?? 0 }));

        setRateHistory({
          completion: completionTrend,
          missed: missedTrend
        });
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
        const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
        const res = await statisticsService.getAppointmentHeatmap({ startDate: start, endDate: end });
        
        if (res && res.points) {
          // Group points by date to see which days have appointments
          const daysWithEvents = res.points
            .filter((p: any) => p.count > 0)
            .reduce((acc: any[], p: any) => {
              const existing = acc.find(a => a.date === p.date);
              if (existing) {
                existing.count += p.count;
              } else {
                acc.push({ date: p.date, count: p.count });
              }
              return acc;
            }, [])
            .map((e: any) => ({
              date: new Date(e.date),
              count: e.count
            }));
          
          setCalendarEvents(daysWithEvents);
        }
      } catch (error) {
        console.error('Failed to fetch calendar events', error);
      }
    };
    fetchCalendarEvents();
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await statisticsService.getAppointmentsByDate(dateStr);
        setSelectedDateAppointments(res.appointments || []);
      } catch (error) {
        console.error('Failed to fetch appointments by date', error);
      }
    };
    fetchAppointments();
  }, [selectedDate]);

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
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.topRow}>
          <div className={styles.leftColumn}>
            <div className={styles.calendarSection}>
              <CalendarHeader onDateSelect={(date) => setSelectedDate(date)} />
              <AdminCalendar
                events={calendarEvents}
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                }}
                onRangeSelect={(range) => {
                  console.log('Range selected:', range);
                }}
              />
              <AppointmentCarousel
                appointments={selectedDateAppointments.slice(0, 5).map(app => ({
                  id: String(app.id),
                  doctorName: app.appointmentTypeName,
                  specialty: app.customerName,
                  room: app.staffName,
                  time: app.appointmentTime.substring(0, 5)
                }))}
              />
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

        <div className={styles.heatmapSection}>
          <AppointmentHeatmap />
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.patientVisitByGenderWrapper}>
            <PatientVisitByGender />
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.genderStatsRow}>
              <GenderStatsCard
                title="Tỉ lệ Hoàn thành"
                value={`${activityComp?.completionRate ?? 0}%`}
                trend=""
                trendColor="#4ec5ad"
                chartColor="#4ec5ad"
                data={rateHistory.completion}
              />
              <GenderStatsCard
                title="Tỉ lệ Bỏ lỡ"
                value={`${activityComp?.missedRate ?? 0}%`}
                trend=""
                trendColor="#fd6161"
                chartColor="#fd6161"
                data={rateHistory.missed}
              />
            </div>
            <div className={styles.teamProductivityWrapper}>
              <TeamProductivity />
            </div>
          </div>
        </div>
        <PerformanceBulletCharts />

        
      </div>
    </div>
  );
}
