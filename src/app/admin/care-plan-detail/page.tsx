'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import carePlanDetailService from '@/services/care-plan-detail.service';
import type { CarePlanDetail } from '@/types/care-plan-detail';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';

import styles from './care-plan-detail.module.css';
import {
  CarePlanDetailListHeader,
  CarePlanDetailTable,
  CarePlanDetailTableControls,
  NewCarePlanDetailModal,
  ImportCarePlanDetailModal,
} from './components';

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

export default function AdminCarePlanDetailPage() {
  const { toast } = useToast();
  const [carePlanDetails, setCarePlanDetails] = useState<CarePlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarePlanDetail, setEditingCarePlanDetail] = useState<CarePlanDetail | null>(null);
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CarePlanDetail | null>(null);

  const fetchCarePlanDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await carePlanDetailService.getAllCarePlanDetails();
      setCarePlanDetails(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Không thể tải danh sách hoạt động gói dịch vụ';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarePlanDetails();
  }, []);

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
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredCarePlanDetails.slice(start, end);
  }, [filteredCarePlanDetails, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCarePlanDetails.length / pageSize) || 1;

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

  const handleDeleteTrigger = (carePlanDetail: CarePlanDetail) => {
    setItemToDelete(carePlanDetail);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await carePlanDetailService.deleteCarePlanDetail(itemToDelete.id);
      toast({ title: 'Xóa chi tiết kế hoạch chăm sóc thành công', variant: 'success' });
      await fetchCarePlanDetails();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Xóa chi tiết kế hoạch chăm sóc thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      await carePlanDetailService.exportCarePlanDetails();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <AdminPageLayout
          header={<CarePlanDetailHeader />}
          controlPanel={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <SkeletonBone width={320} height={42} />
                <SkeletonBone width={180} height={42} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <SkeletonBone width={120} height={42} />
                <SkeletonBone width={100} height={42} />
                <SkeletonBone width={120} height={42} />
              </div>
            </div>
          }
        >
          <div style={{ 
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            padding: '0 16px'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize || 10)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === (pageSize || 10) - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </AdminPageLayout>
      </div>
    );
  }


  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      header={<CarePlanDetailListHeader />}
      controlPanel={
        <CarePlanDetailTableControls
          onSearch={(q) => setSearchQuery(q)}
          onSortChange={(sort) => setSortKey(sort)}
          onNewCarePlanDetail={() => setIsModalOpen(true)}
          onImport={() => setIsImportModalOpen(true)}
          onExport={handleExport}
        />
      }
      pagination={
        filteredCarePlanDetails.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredCarePlanDetails.length}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showResultCount={true}
          />
        ) : null
      }
    >
      <div className={styles.pageContainer}>
        <CarePlanDetailTable
          carePlanDetails={paginatedCarePlanDetails}
          onEdit={handleEdit}
          onDelete={handleDeleteTrigger}
          deletingId={deletingId}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>

      <NewCarePlanDetailModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchCarePlanDetails}
        carePlanDetailToEdit={editingCarePlanDetail}
      />

      <ImportCarePlanDetailModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchCarePlanDetails}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa hoạt động"
        message={`Bạn có chắc chắn muốn xóa hoạt động này? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />
    </AdminPageLayout>
  );
}
