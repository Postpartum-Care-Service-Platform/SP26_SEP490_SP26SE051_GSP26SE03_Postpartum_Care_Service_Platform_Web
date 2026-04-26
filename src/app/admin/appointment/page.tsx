'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import appointmentService from '@/services/appointment.service';
import type { Appointment as ApiAppointment } from '@/types/appointment';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';
import styles from './appointment.module.css';
import { AppointmentHeader } from './components/AppointmentHeader';
import { AppointmentTable } from './components/AppointmentTable';
import { AppointmentTableControls } from './components/AppointmentTableControls';
import { EditAppointmentModal } from './components/EditAppointmentModal';
import { ImportAppointmentModal } from './components/ImportAppointmentModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import type { Appointment, AppointmentStatus } from './components/types';

// Internal Premium Skeleton Component for consistent look
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Appointment | null>(null);

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
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    setItemToDelete(appointment);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await appointmentService.deleteAppointment(itemToDelete.id);
      toast({ title: 'Xóa lịch hẹn thành công', variant: 'success' });
      fetchAppointments();
    } catch (err) {
      toast({ title: 'Xóa lịch hẹn thất bại', variant: 'error' });
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      await appointmentService.exportAppointments();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  const header = <AppointmentHeader />;

  const controlPanel = (
    <AppointmentTableControls 
      onStatusChange={handleStatusChange}
      onAddClick={() => setIsNewModalOpen(true)}
      onImportClick={() => setIsImportModalOpen(true)}
      onExportClick={handleExport}
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

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Area Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={320} height={42} />
              <SkeletonBone width={180} height={42} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={42} />
              <SkeletonBone width={100} height={42} />
              <SkeletonBone width={120} height={42} />
            </div>
          </div>

          {/* Table Area Placeholder */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="50%" height={16} />
                </div>
                <SkeletonBone width={120} height={16} />
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
        <button onClick={fetchAppointments} className={styles.retryButton}>Thử lại</button>
      </div>
    );
  }

  return (
    <AdminPageLayout
      header={
        <AppointmentHeader
          onNewAppointment={() => setIsNewModalOpen(true)}
          onImportClick={() => setIsImportModalOpen(true)}
          onExportClick={handleExport}
        />
      }
      controlPanel={
        <AppointmentTableControls
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />
      }
      pagination={pagination}
    >
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

      <ImportAppointmentModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchAppointments}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa lịch hẹn"
        message={`Bạn có chắc chắn muốn xóa lịch hẹn của bệnh nhân "${itemToDelete?.patientName || ''}" vào ngày ${itemToDelete?.date || ''}? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
      />
    </AdminPageLayout>
  );

