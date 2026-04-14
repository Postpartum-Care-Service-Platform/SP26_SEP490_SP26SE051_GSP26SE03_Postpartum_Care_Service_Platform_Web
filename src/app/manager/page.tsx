'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import statisticsService from '@/services/statistics.service';
import styles from '../admin/admin-dashboard.module.css';
import { AdminCalendar } from '../admin/components/AdminCalendar';
import { AppointmentCarousel } from '../admin/components/AppointmentCarousel';
import { AppointmentsList } from '../admin/components/AppointmentsList';
import { AveragePatientVisit } from '../admin/components/AveragePatientVisit';
import { CalendarHeader } from '../admin/components/CalendarHeader';
import { DashboardHeader } from '../admin/components/DashboardHeader';
import { DashboardStatsCards } from '../admin/components/DashboardStatsCards';
import { GenderStatsCard } from '../admin/components/GenderStatsCard';
import { InvoiceList } from '../admin/components/InvoiceList';
import { PatientByAge } from '../admin/components/PatientByAge';
import { PatientVisitByGender } from '../admin/components/PatientVisitByGender';
import { TeamProductivity } from '../admin/components/TeamProductivity';
import { TopDoctors } from '../admin/components/TopDoctors';

type DashboardStats = {
  activePatients: number;
  outstandingBalance: number;
  newPatients: number;
  appointments: number;
  bedOccupancy: number;
};

export default function ManagerPage() {
  const [stats] = useState<DashboardStats>({
    activePatients: 1250,
    outstandingBalance: 34250000,
    newPatients: 1250,
    appointments: 3420,
    bedOccupancy: 78,
  });
  const [loading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);

  useEffect(() => {
    // TODO: fetch manager-specific dashboard data
  }, []);

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
      <div className={styles.bottomSection}>
        <div className={styles.topRow}>
          <div className={styles.leftColumn}>
            <div className={styles.calendarSection}>
              <CalendarHeader onDateSelect={(date) => setSelectedDate(date)} />
              <AdminCalendar
                events={[]}
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                }}
                onRangeSelect={(range) => {
                  console.log('Range selected:', range);
                }}
              />
              <AppointmentCarousel
                appointments={selectedDateAppointments.map(app => ({
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
          <InvoiceList />
        </div>
        <div className={styles.appointmentsRow}>
          <AppointmentsList />
          <PatientByAge />
        </div>
      </div>
    </div>
  );
}
