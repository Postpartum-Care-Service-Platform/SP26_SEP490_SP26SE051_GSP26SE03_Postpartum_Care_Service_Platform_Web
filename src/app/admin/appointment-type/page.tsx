'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import styles from './appointment-type.module.css';
import { NewAppointmentTypeModal } from './components';
import { AppointmentTypeListControlPanel } from './components/AppointmentTypeListControlPanel';
import { AppointmentTypeListTable } from './components/AppointmentTypeListTable';

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
  const [statusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey] = useState<string>('createdAt-desc');

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

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingAppointmentType(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
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
          <AppointmentTypeListControlPanel
            searchValue={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
          />

          <AppointmentTypeListTable
            items={filteredAppointmentTypes}
            onRefresh={fetchAppointmentTypes}
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
