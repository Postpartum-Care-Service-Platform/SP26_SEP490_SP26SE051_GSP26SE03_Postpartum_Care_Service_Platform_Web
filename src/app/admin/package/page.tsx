'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import packageService from '@/services/package.service';
import type { Package } from '@/types/package';
import { Pagination } from '@/components/ui/pagination';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ImportPackageModal, NewPackageModal, PackageListHeader, PackageTable, PackageTableControls } from './components';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import styles from './package.module.css';

const sortPackages = (items: Package[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'price-asc':
      return arr.sort((a, b) => a.basePrice - b.basePrice);
    case 'price-desc':
      return arr.sort((a, b) => b.basePrice - a.basePrice);
    case 'duration-asc':
      return arr.sort((a, b) => a.durationDays - b.durationDays);
    case 'duration-desc':
      return arr.sort((a, b) => b.durationDays - a.durationDays);
    case 'name-asc':
      return arr.sort((a, b) => a.packageName.localeCompare(b.packageName));
    case 'name-desc':
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

export default function AdminPackagePage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Confirm Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Package | null>(null);

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);


  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Không thể tải danh sách gói dịch vụ';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    let filtered = [...packages];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.packageName.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => (statusFilter === 'active' ? p.isActive : !p.isActive));
    }

    return sortPackages(filtered, sortKey);
  }, [packages, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPackages.slice(start, end);
  }, [filteredPackages, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPackages.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollArea = document.querySelector('[class*="scrollArea"]');
    scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingPackage(null);
    }
  };

  const handleDeleteTrigger = (pkg: Package) => {
    setItemToDelete(pkg);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await packageService.deletePackage(itemToDelete.id);
      toast({ title: 'Xóa gói dịch vụ thành công', variant: 'success' });
      await fetchPackages();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Xóa gói dịch vụ thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await packageService.exportPackages();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Goi_Dich_Vu_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast({ title: 'Đang tải file mẫu...', variant: 'default' });
      const blob = await packageService.downloadTemplatePackages();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_goi_dich_vu.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Tải file mẫu thất bại', variant: 'error' });
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
          header={<PackageListHeader />}
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
    <>
      <AdminPageLayout
        header={<PackageListHeader />}
        controlPanel={
          <PackageTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewPackage={() => setIsModalOpen(true)}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
            onDownloadTemplate={handleDownloadTemplate}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredPackages.length}
              onPageChange={handlePageChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size: number) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : null
        }
      >
        <PackageTable
          packages={paginatedPackages}
          onEdit={handleEdit}
          onDelete={handleDeleteTrigger}
          deletingId={deletingId}
          pagination={{
            currentPage,
            pageSize,
          } as any}
        />
      </AdminPageLayout>

      <NewPackageModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchPackages}
        packageToEdit={editingPackage}
      />

      <ImportPackageModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchPackages}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa gói dịch vụ"
        message={`Bạn có chắc chắn muốn xóa gói dịch vụ "${itemToDelete?.packageName}"? Hành động này không thể hoàn tác.`}
      />

    </>
  );
}

