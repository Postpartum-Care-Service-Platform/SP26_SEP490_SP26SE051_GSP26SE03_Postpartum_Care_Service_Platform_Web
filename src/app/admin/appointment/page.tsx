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
import { useToast } from '@/components/ui/toast/use-toast';
import styles from './appointment.module.css';

const PAGE_SIZE = 10;

export default function AdminAppointmentPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data.map(mapAppointment));
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể tải danh sách lịch hẹn';
      setError(errorMessage);
      toast({ title: errorMessage, variant: 'error' });
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const mapStatus = (status: string): AppointmentStatus => {
    if (status === 'Pending') return 'Pending';
    if (status === 'Completed') return 'Completed';
    if (status === 'Cancelled') return 'Cancelled';
    if (status === 'Rescheduled') return 'Rescheduled';
    return 'Upcoming';
  };

  const formatDateTime = (isoString: string | null | undefined): string => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      console.error('Error formatting date:', isoString, error);
      return '-';
    }
  };

  const mapAppointment = (apt: ApiAppointment): Appointment => {
    const patientName = apt.customer?.username || apt.customer?.email || 'Không xác định';
    const doctor = apt.staff?.username || 'Chưa phân công';
    const department = apt.appointmentType?.name || 'Không xác định';

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
        if (!apt.dateTime || apt.dateTime === '-') return false;
        try {
          const date = new Date(apt.dateTime);
          if (isNaN(date.getTime())) return false;
          return date >= startOfDay && date < endOfDay;
        } catch {
          return false;
        }
      })
      .map((apt) => {
        let time = '-';
        try {
          if (apt.dateTime && apt.dateTime !== '-') {
            const date = new Date(apt.dateTime);
            if (!isNaN(date.getTime())) {
              time = date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }
          }
        } catch (error) {
          console.error('Error parsing time:', apt.dateTime, error);
        }

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

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todayCount = appointments.filter((apt) => {
      if (!apt.dateTime || apt.dateTime === '-') return false;
      try {
        const aptDate = new Date(apt.dateTime);
        if (isNaN(aptDate.getTime())) return false;
        return aptDate.toISOString().split('T')[0] === todayStr;
      } catch {
        return false;
      }
    }).length;

    const upcoming = appointments.filter((apt) => {
      if (!apt.dateTime || apt.dateTime === '-') return false;
      try {
        const aptDate = new Date(apt.dateTime);
        if (isNaN(aptDate.getTime())) return false;
        return aptDate > today && apt.status !== 'Completed' && apt.status !== 'Cancelled';
      } catch {
        return false;
      }
    }).length;

    const completed = appointments.filter((apt) => apt.status === 'Completed').length;
    const cancelled = appointments.filter((apt) => apt.status === 'Cancelled').length;
    const rescheduled = appointments.filter((apt) => apt.status === 'Rescheduled').length;

    return {
      today: todayCount,
      upcoming,
      completed,
      cancelled,
      rescheduled,
    };
  }, [appointments]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <AppointmentHeader />
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <AppointmentHeader />
        <div className={styles.content}>
          <p>{error}</p>
          <button onClick={fetchAppointments} style={{ marginTop: '16px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <AppointmentHeader />
      <AppointmentStatsCards stats={stats} />
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

