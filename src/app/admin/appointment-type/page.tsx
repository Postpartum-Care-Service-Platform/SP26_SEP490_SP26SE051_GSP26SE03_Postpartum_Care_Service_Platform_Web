'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import styles from './appointment-type.module.css';
import {
  AppointmentTypeListHeader,
  AppointmentTypeStatsCards,
  AppointmentTypeTable,
  AppointmentTypeTableControls,
  NewAppointmentTypeModal,
} from './components';

import type { AppointmentTypeStats } from './components';

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

const sortAppointmentTypes = (items: AppointmentTypeDetail[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return arr;
  }
};

export default function AdminAppointmentTypePage() {
  const { toast } = useToast();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentTypeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointmentType, setEditingAppointmentType] = useState<AppointmentTypeDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAppointmentTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentTypeService.getAllAppointmentTypes();
      setAppointmentTypes(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách loại lịch hẹn'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentTypes();
  }, []);

  const stats: AppointmentTypeStats = useMemo(() => {
    const total = appointmentTypes.length;
    const active = appointmentTypes.filter((a) => a.isActive).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [appointmentTypes]);

  const filteredAppointmentTypes = useMemo(() => {
    let filtered = [...appointmentTypes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => (statusFilter === 'active' ? a.isActive : !a.isActive));
    }

    return sortAppointmentTypes(filtered, sortKey);
  }, [appointmentTypes, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedAppointmentTypes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredAppointmentTypes.slice(start, end);
  }, [filteredAppointmentTypes, currentPage]);

  const totalPages = Math.ceil(filteredAppointmentTypes.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (appointmentType: AppointmentTypeDetail) => {
    setEditingAppointmentType(appointmentType);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingAppointmentType(null);
    }
  };

  const handleDelete = async (appointmentType: AppointmentTypeDetail) => {
    try {
      setDeletingId(appointmentType.id);
      await appointmentTypeService.deleteAppointmentType(appointmentType.id);
      toast({ title: 'Xóa loại lịch hẹn thành công', variant: 'success' });
      await fetchAppointmentTypes();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa loại lịch hẹn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppointmentTypeListHeader />

      {loading ? (
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <AppointmentTypeStatsCards stats={stats} />

          <AppointmentTypeTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewAppointmentType={() => setIsModalOpen(true)}
          />

          <AppointmentTypeTable
            appointmentTypes={paginatedAppointmentTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredAppointmentTypes.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}

      <NewAppointmentTypeModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchAppointmentTypes}
        appointmentTypeToEdit={editingAppointmentType}
      />
    </div>
  );
}
