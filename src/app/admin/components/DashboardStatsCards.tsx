'use client';

import { AlertCircle, Activity, Calendar, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { CountUp } from './CountUp';
import styles from './dashboard-stats-cards.module.css';
import { PatientStatusChart } from './PatientStatusChart';

type DashboardStats = {
  activePatients: number;
  outstandingBalance: number;
  newPatients: number;
  appointments: number;
  bedOccupancy: number;
};

type Props = {
  stats: DashboardStats;
};

type StatCard = {
  key: keyof DashboardStats;
  label: string;
  value: number;
  format: 'number' | 'currency' | 'percentage';
  icon: React.ComponentType<{ className?: string; color?: string }>;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

export function DashboardStatsCards({ stats }: Props) {
  // State để track selectedPeriod cho từng card
  const [selectedPeriods, setSelectedPeriods] = useState<Record<string, string>>({
    outstandingBalance: '7',
    newPatients: '7',
    appointments: '7',
    bedOccupancy: '7',
  });

  const cards: StatCard[] = [
    {
      key: 'outstandingBalance',
      label: 'Outstanding Balance',
      value: stats.outstandingBalance,
      format: 'currency',
      icon: AlertCircle,
      iconBgColor: 'rgba(253, 97, 97, 0.15)',
      iconColor: '#FD6161',
      trend: {
        value: '3.5%',
        isPositive: true,
      },
    },
    {
      key: 'newPatients',
      label: 'New Patients',
      value: stats.newPatients,
      format: 'number',
      icon: Users,
      iconBgColor: 'rgba(221, 113, 162, 0.15)',
      iconColor: '#DD71A2',
      trend: {
        value: '12%',
        isPositive: true,
      },
    },
    {
      key: 'appointments',
      label: 'Appointments',
      value: stats.appointments,
      format: 'number',
      icon: Calendar,
      iconBgColor: 'rgba(164, 123, 200, 0.15)',
      iconColor: '#A47BC8',
      trend: {
        value: '5%',
        isPositive: false,
      },
    },
    {
      key: 'bedOccupancy',
      label: 'Bed Occupancy',
      value: stats.bedOccupancy,
      format: 'percentage',
      icon: Activity,
      iconBgColor: 'rgba(82, 136, 175, 0.15)',
      iconColor: '#5288AF',
      trend: {
        value: '8.2%',
        isPositive: true,
      },
    },
  ];

  const handlePeriodChange = (cardKey: string, period: string) => {
    setSelectedPeriods((prev) => ({ ...prev, [cardKey]: period }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.activePatientsCard}>
        <div className={styles.activePatientsContent}>
          <div className={styles.activePatientsHeader}>
            <span className={styles.activePatientsLabel}>Active Patients :</span>
            <h5 className={styles.activePatientsValue}>
              <CountUp value={stats.activePatients} format="number" />
            </h5>
          </div>
          <div className={styles.weeklyAppointments}>
            <h6 className={styles.weeklyAppointmentsTitle}>
              Weekly Appointments
            </h6>
            <p className={styles.weeklyAppointmentsText}>
              You have{' '}
              <CountUp value={stats.appointments} format="number" /> total
              appointments scheduled this week.
            </p>
          </div>
          <button className={styles.bookAppointmentButton}>
            Book Appointment
          </button>
        </div>
        <div className={styles.logoContainer}>
          <Image
            src="/download.png"
            alt="Banner"
            width={105}
            height={105}
            className={styles.logo}
            priority
          />
        </div>
      </div>

      {cards.map((card) => {
        const Icon = card.icon;
        const selectedPeriod = selectedPeriods[card.key];

        return (
          <div key={card.key} className={styles.statCard}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={styles.menuButton} aria-label="More options">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="4" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={styles.dropdownContent}
                align="end"
              >
                <DropdownMenuItem
                  className={`${styles.dropdownItem} ${
                    selectedPeriod === '7' ? styles.dropdownItemActive : ''
                  }`}
                  onClick={() => handlePeriodChange(card.key, '7')}
                >
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`${styles.dropdownItem} ${
                    selectedPeriod === '30' ? styles.dropdownItemActive : ''
                  }`}
                  onClick={() => handlePeriodChange(card.key, '30')}
                >
                  Last 30 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className={styles.statCardHeader}>
              <div
                className={styles.iconWrapper}
                style={{ backgroundColor: card.iconBgColor }}
              >
                <Icon className={styles.icon} color={card.iconColor} />
              </div>
              {card.trend && (
                <div className={styles.trend}>
                  <span
                    className={
                      card.trend.isPositive
                        ? styles.trendPositive
                        : styles.trendNegative
                    }
                  >
                    {card.trend.value}
                  </span>
                  <span
                    className={
                      card.trend.isPositive
                        ? styles.trendArrowUp
                        : styles.trendArrowDown
                    }
                  >
                    {card.trend.isPositive ? '↑' : '↓'}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.statCardBody}>
              <h3 className={styles.statValue}>
                <CountUp value={card.value} format={card.format} />
              </h3>
              <p className={styles.statLabel}>{card.label}</p>
            </div>
            <a href="#" className={styles.viewDetailsLink}>
              View Details &gt;
            </a>
          </div>
        );
      })}
      <PatientStatusChart />
    </div>
  );
}
