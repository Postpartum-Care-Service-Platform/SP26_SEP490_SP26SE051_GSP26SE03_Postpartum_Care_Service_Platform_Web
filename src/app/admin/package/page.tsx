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
      await packageService.exportPackages();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

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
        {loading ? (
          <div className={styles.content}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className={styles.content}>
            <p>{error}</p>
          </div>
        ) : (
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
        )}
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
