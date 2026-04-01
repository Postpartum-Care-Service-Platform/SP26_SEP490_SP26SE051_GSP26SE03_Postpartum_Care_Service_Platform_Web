'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import appointmentService from '@/services/appointment.service';
import type { Appointment as ApiAppointment } from '@/types/appointment';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import styles from './appointment.module.css';
import { AppointmentHeader } from './components/AppointmentHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentTableControls } from './components/AppointmentTableControls';
import { EditAppointmentModal } from './components/EditAppointmentModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import type { Appointment, AppointmentStatus } from './components/types';

export default function AdminAppointmentPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // ... (mapStatus, formatDateTime, formatDate, formatDateOnly, formatTimeOnly functions)

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
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
    } catch (error) {
      console.error('Error formatting date:', isoString, error);
      return '-';
    }
  };

  const formatDate = (isoString: string | null | undefined): string => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (error) {
      console.error('Error formatting date:', isoString, error);
      return '-';
    }
  };

  const formatDateOnly = (dateOnly: string | null | undefined): string => {
    if (!dateOnly) return '-';
    const [year, month, day] = dateOnly.split('-');
    if (!year || !month || !day) return dateOnly;
    return `${day}/${month}/${year}`;
  };

  const formatTimeOnly = (timeOnly: string | null | undefined): string => {
    if (!timeOnly) return '-';
    return timeOnly.slice(0, 5); 
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
      date: apt.appointmentDateOnly ? formatDateOnly(apt.appointmentDateOnly) : formatDate(apt.appointmentDate),
      time: apt.appointmentTimeOnly ? formatTimeOnly(apt.appointmentTimeOnly) : '-',
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
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAppointments.slice(start, end);
  }, [filteredAppointments, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));

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

  const header = <AppointmentHeader />;

  const controlPanel = (
    <AppointmentTableControls 
      onStatusChange={handleStatusChange}
      onAddClick={() => setIsNewModalOpen(true)}
    />
  );

  const pagination = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={filteredAppointments.length}
      onPageChange={setCurrentPage}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      showResultCount={true}
    />
  );

  return (
    <AdminPageLayout
      header={header}
      controlPanel={controlPanel}
      pagination={pagination}
    >
      {loading ? (
        <div className={styles.loadingState}>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchAppointments} className={styles.retryButton}>Thử lại</button>
        </div>
      ) : (
        <>
          <AppointmentTable
            appointments={paginatedAppointments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            pageSize={pageSize}
          />

          <NewAppointmentModal
            open={isNewModalOpen}
            onOpenChange={setIsNewModalOpen}
            onSuccess={fetchAppointments}
          />

          <EditAppointmentModal
            open={isEditModalOpen}
            onOpenChange={(open) => {
              setIsEditModalOpen(open);
              if (!open) setEditingAppointment(null);
            }}
            appointment={editingAppointment}
            onSuccess={fetchAppointments}
          />
        </>
      )}
    </AdminPageLayout>
  );
}


