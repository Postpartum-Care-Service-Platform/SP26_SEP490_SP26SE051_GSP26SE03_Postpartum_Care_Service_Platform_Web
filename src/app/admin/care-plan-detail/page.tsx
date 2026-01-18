'use client';

import { useEffect, useMemo, useState } from 'react';

import { CarePlanDetailListHeader } from './components/CarePlanDetailListHeader';
import { CarePlanDetailStatsCards, CarePlanDetailTable, CarePlanDetailTableControls, NewCarePlanDetailModal } from './components';
import type { CarePlanDetailStats } from './components';
import styles from './care-plan-detail.module.css';

import carePlanDetailService from '@/services/care-plan-detail.service';
import type { CarePlanDetail } from '@/types/care-plan-detail';
import { useToast } from '@/components/ui/toast/use-toast';

const PAGE_SIZE = 10;

const sortCarePlanDetails = (items: CarePlanDetail[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => (a.id || 0) - (b.id || 0));
    case 'createdAt-desc':
      return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
    case 'dayNo-asc':
      return arr.sort((a, b) => a.dayNo - b.dayNo);
    case 'dayNo-desc':
      return arr.sort((a, b) => b.dayNo - a.dayNo);
    case 'packageName-asc':
      return arr.sort((a, b) => a.packageName.localeCompare(b.packageName));
    case 'packageName-desc':
      return arr.sort((a, b) => b.packageName.localeCompare(a.packageName));
    default:
      return arr;
  }
};

export default function AdminCarePlanDetailPage() {
  const { toast } = useToast();
  const [carePlanDetails, setCarePlanDetails] = useState<CarePlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarePlanDetail, setEditingCarePlanDetail] = useState<CarePlanDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCarePlanDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carePlanDetailService.getAllCarePlanDetails();
      setCarePlanDetails(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách chi tiết kế hoạch chăm sóc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarePlanDetails();
  }, []);

  const stats: CarePlanDetailStats = useMemo(() => {
    const total = carePlanDetails.length;
    const uniquePackages = new Set(carePlanDetails.map((c) => c.packageId)).size;
    const uniqueActivities = new Set(carePlanDetails.map((c) => c.activityId)).size;

    return {
      total,
      uniquePackages,
      uniqueActivities,
    };
  }, [carePlanDetails]);

  const filteredCarePlanDetails = useMemo(() => {
    let filtered = [...carePlanDetails];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.packageName.toLowerCase().includes(q) ||
          c.activityName.toLowerCase().includes(q) ||
          c.instruction.toLowerCase().includes(q),
      );
    }

    return sortCarePlanDetails(filtered, sortKey);
  }, [carePlanDetails, searchQuery, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortKey]);

  const paginatedCarePlanDetails = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredCarePlanDetails.slice(start, end);
  }, [filteredCarePlanDetails, currentPage]);

  const totalPages = Math.ceil(filteredCarePlanDetails.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (carePlanDetail: CarePlanDetail) => {
    setEditingCarePlanDetail(carePlanDetail);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingCarePlanDetail(null);
    }
  };

  const handleDelete = async (carePlanDetail: CarePlanDetail) => {
    try {
      setDeletingId(carePlanDetail.id);
      await carePlanDetailService.deleteCarePlanDetail(carePlanDetail.id);
      toast({ title: 'Xóa chi tiết kế hoạch chăm sóc thành công', variant: 'success' });
      await fetchCarePlanDetails();
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa chi tiết kế hoạch chăm sóc thất bại', variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <CarePlanDetailListHeader />

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
          <CarePlanDetailStatsCards stats={stats} />

          <CarePlanDetailTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onNewCarePlanDetail={() => setIsModalOpen(true)}
          />

          <CarePlanDetailTable
            carePlanDetails={paginatedCarePlanDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredCarePlanDetails.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}

      <NewCarePlanDetailModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchCarePlanDetails}
        carePlanDetailToEdit={editingCarePlanDetail}
      />
    </div>
  );
}
