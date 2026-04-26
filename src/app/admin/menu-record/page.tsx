'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuRecordService from '@/services/menu-record.service';
import type { MenuRecord } from '@/types/menu-record';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';
import userService from '@/services/user.service';
import menuService from '@/services/menu.service';
import type { Account } from '@/types/account';
import type { Menu } from '@/types/menu';

import { NewMenuRecordModal, MenuRecordTable, MenuRecordTableControls } from './components';
import { MenuRecordListHeader } from './components/MenuRecordListHeader';
import styles from './menu-record.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallbackMessage;
};

const sortMenuRecords = (items: MenuRecord[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':
      return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'date-asc':
      return arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc':
      return arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

export default function AdminMenuRecordPage() {
  const { toast } = useToast();
  const [menuRecords, setMenuRecords] = useState<MenuRecord[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuRecord, setEditingMenuRecord] = useState<MenuRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuRecordToDelete, setMenuRecordToDelete] = useState<MenuRecord | null>(null);

  const [view, setView] = useState<'table' | 'ui'>('table');

  const fetchMenuRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const [recordsData, accountsData, menusData] = await Promise.all([
        menuRecordService.getAllMenuRecords(),
        userService.getAllAccounts(),
        menuService.getAllMenus(),
      ]);
      setMenuRecords(recordsData);
      setAccounts(accountsData);
      setMenus(menusData);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách bản ghi thực đơn'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuRecords();
  }, []);

  const filteredMenuRecords = useMemo(() => {
    let filtered = [...menuRecords];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) => (m.name || '').toLowerCase().includes(q) || (m.accountId || '').toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) => (statusFilter === 'active' ? m.isActive : !m.isActive));
    }

    return sortMenuRecords(filtered, sortKey);
  }, [menuRecords, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedMenuRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredMenuRecords.slice(start, end);
  }, [filteredMenuRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMenuRecords.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollArea = document.querySelector(`.${styles.pageContainer}`)?.closest('[class*="scrollArea"]');
    scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (menuRecord: MenuRecord) => {
    setEditingMenuRecord(menuRecord);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingMenuRecord(null);
    }
  };

  const handleDelete = (menuRecord: MenuRecord) => {
    setMenuRecordToDelete(menuRecord);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuRecordToDelete) return;
    try {
      setDeletingId(menuRecordToDelete.id);
      await menuRecordService.deleteMenuRecord(menuRecordToDelete.id);
      toast({ title: 'Xóa bản ghi thực đơn thành công', variant: 'success' });
      await fetchMenuRecords();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa bản ghi thực đơn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
      setMenuRecordToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

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
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
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
      noCard={view === 'ui'}
      header={<MenuRecordListHeader view={view} onViewChange={setView} />}
      controlPanel={
        view === 'table' ? (
          <MenuRecordTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewMenuRecord={() => setIsModalOpen(true)}
          />
        ) : null
      }
      pagination={
        view === 'table' && filteredMenuRecords.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMenuRecords.length}
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
        {view === 'table' ? (
          <MenuRecordTable
            menuRecords={paginatedMenuRecords}
            accounts={accounts}
            menus={menus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Dạng xem UI đang được cập nhật...</p>
          </div>
        )}
      </div>

      <NewMenuRecordModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenuRecords}
        menuRecordToEdit={editingMenuRecord}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bản ghi thực đơn"
        message={`Bạn có chắc chắn muốn xóa bản ghi thực đơn "${menuRecordToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />
    </AdminPageLayout>
  );
}

