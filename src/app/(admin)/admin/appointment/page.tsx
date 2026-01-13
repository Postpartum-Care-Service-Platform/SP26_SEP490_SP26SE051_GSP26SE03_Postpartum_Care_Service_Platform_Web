'use client';

import { useState, useMemo } from 'react';

import { AppointmentHeader } from './components/AppointmentHeader';
import { AppointmentStatsCards } from './components/AppointmentStatsCards';
import { AppointmentTableControls } from './components/AppointmentTableControls';
import { AppointmentTable } from './components/AppointmentTable';
import { TodayAppointments } from './components/TodayAppointments';
import { mockAppointments } from './components/mockAppointments';
import type { Appointment, AppointmentStatus } from './components/types';
import styles from './appointment.module.css';

const PAGE_SIZE = 10;

export default function AdminAppointmentPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAppointments = useMemo(() => {
    let filtered = [...mockAppointments];
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }
    return filtered;
  }, [statusFilter]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredAppointments.slice(start, end);
  }, [filteredAppointments, currentPage]);

  const totalPages = Math.ceil(filteredAppointments.length / PAGE_SIZE);

  const handleStatusChange = (status: AppointmentStatus | 'all') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAddAppointment = () => {
    console.log('Add appointment');
  };

  const handleEdit = (appointment: Appointment) => {
    console.log('Edit appointment:', appointment);
  };

  const handleDelete = (appointment: Appointment) => {
    console.log('Delete appointment:', appointment);
  };

  return (
    <div className={styles.pageContainer}>
      <AppointmentHeader />
      <AppointmentStatsCards />
      <div className={styles.contentRow}>
        <div className={styles.tableSection}>
        <AppointmentTableControls onStatusChange={handleStatusChange} />
          <AppointmentTable
            appointments={paginatedAppointments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              currentPage,
              totalPages,
              pageSize: PAGE_SIZE,
              totalItems: filteredAppointments.length,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
        <div className={styles.sidebar}>
          <TodayAppointments />
        </div>
      </div>
    </div>
  );
}

