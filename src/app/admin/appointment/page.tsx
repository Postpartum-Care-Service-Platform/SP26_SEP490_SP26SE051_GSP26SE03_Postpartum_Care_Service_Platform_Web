'use client';

import { useState, useMemo, useEffect } from 'react';

import { AppointmentHeader } from './components/AppointmentHeader';
import { AppointmentStatsCards } from './components/AppointmentStatsCards';
import { AppointmentTableControls } from './components/AppointmentTableControls';
import { AppointmentTable } from './components/AppointmentTable';
import { TodayAppointments } from './components/TodayAppointments';
import type { TimelineAppointment } from './components/AppointmentTimelineItem';
import type { Appointment, AppointmentStatus } from './components/types';
import appointmentService from '@/services/appointment.service';
import type { Appointment as ApiAppointment } from '@/types/appointment';
import styles from './appointment.module.css';

const PAGE_SIZE = 10;

export default function AdminAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    const mapStatus = (status: string): AppointmentStatus => {
      if (status === 'Pending') return 'Pending';
      if (status === 'Completed') return 'Completed';
      if (status === 'Cancelled') return 'Cancelled';
      return 'Upcoming';
    };

    const formatDateTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    };

    const mapAppointment = (apt: ApiAppointment): Appointment => {
      const patientName = apt.customer.username || apt.customer.email;
      const doctor = apt.staff?.username || 'Chưa phân công';
      const department = apt.appointmentType.name;

      return {
        id: apt.id,
        patientName,
        patientAvatar: null,
        doctor,
        department,
        dateTime: formatDateTime(apt.appointmentDate),
        status: mapStatus(apt.status),
      };
    };

    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        if (!mounted) return;
        setAppointments(data.map(mapAppointment));
      } catch (error) {
        console.error('Failed to load appointments', error);
      }
    };

    fetchAppointments();

    return () => {
      mounted = false;
    };
  }, []);
  const todayTimelineAppointments: TimelineAppointment[] = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const toTimelineStatus = (status: AppointmentStatus): TimelineAppointment['status'] => {
      if (status === 'Completed') return 'Completed';
      if (status === 'Cancelled') return 'Cancelled';
      if (status === 'Pending') return 'In Progress';
      return 'Upcoming';
    };

    return appointments
      .filter((apt) => {
        const date = new Date(apt.dateTime);
        return date >= startOfDay && date < endOfDay;
      })
      .map((apt) => {
        const date = new Date(apt.dateTime);
        const time = date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        return {
          id: apt.id,
          time,
          patientName: apt.patientName,
          patientAvatar: apt.patientAvatar,
          doctorName: apt.doctor,
          department: apt.department,
          description: `Lịch hẹn ${apt.department}`,
          status: toTimelineStatus(apt.status),
        };
      });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }
    return filtered;
  }, [appointments, statusFilter]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredAppointments.slice(start, end);
  }, [filteredAppointments, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));

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
          <TodayAppointments appointments={todayTimelineAppointments} />
        </div>
      </div>
    </div>
  );
}

