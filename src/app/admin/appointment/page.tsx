'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';


import { useToast } from '@/components/ui/toast/use-toast';
import appointmentService from '@/services/appointment.service';
import type { Appointment as ApiAppointment } from '@/types/appointment';

import styles from './appointment.module.css';
import { AppointmentHeader } from './components/AppointmentHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentTableControls } from './components/AppointmentTableControls';
import { EditAppointmentModal } from './components/EditAppointmentModal';
import type { Appointment, AppointmentStatus } from './components/types';

const PAGE_SIZE = 10;

export default function AdminAppointmentPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const mapStatus = (status: string): AppointmentStatus => {
    // Map từ status tiếng Anh trong API sang enum nội bộ
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

  const mapAppointment = useCallback((apt: ApiAppointment): Appointment => {
    const patientName = apt.customer?.username || apt.customer?.email || 'Không xác định';
    const doctor = apt.staff?.username || 'Chưa phân công';
    const department = apt.appointmentType?.name || 'Không xác định';

    return {
      id: apt.id,
      name: apt.name || '',
      rawDateTime: apt.appointmentDate || null,
      patientName,
      patientAvatar: null,
      doctor,
      department,
      appointmentTypeId: apt.appointmentType?.id ?? null,
      dateTime: formatDateTime(apt.appointmentDate),
      status: mapStatus(apt.status),
    };
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data.map(mapAppointment));
    } catch (err) {
      const errorMessage =
        (err as { message?: string } | null | undefined)?.message || 'Không thể tải danh sách lịch hẹn';
      setError(errorMessage);
      toast({ title: errorMessage, variant: 'error' });
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  }, [toast, mapAppointment]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
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

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    console.log('Delete appointment:', appointment);
  };

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
      </div>

      <EditAppointmentModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditingAppointment(null);
        }}
        appointment={editingAppointment}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}

